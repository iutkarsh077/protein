from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
import boto3
from pydantic import BaseModel
from fastapi import BackgroundTasks
import httpx

load_dotenv()

origins = ["http://localhost:5173", "http://localhost:4000"]


class AnalyzeImageUrl(BaseModel):
    key: str
    id: str

class NutritionInfo(BaseModel):
    food_name: str | None
    estimated_weight_g: float | None
    calories: float | None
    protein_g: float | None
    carbohydrates_g: float | None
    fat_g: float | None
    fiber_g: float | None
    sugar_g: float | None
    confidence: float | None


try:
    from .model_calling import analyze_image
except ImportError:
    from model_calling import analyze_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatOpenAI(model="gpt-5-nano", temperature=0)

structured_llm = llm.with_structured_output(NutritionInfo, method="json_schema")

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
    region_name=os.getenv("AWS_REGION"),
)


def process_image(key: str, id: str):
    obj = s3.get_object(
        Bucket=os.getenv("AWS_BUCKET_NAME"),
        Key=key,
    )

    image = Image.open(obj["Body"])

    response = analyze_image(image)

    nutrition = structured_llm.invoke(f"""
    Convert the following nutrition analysis into the schema.

    {response}
    """)

    nutrition_dict = nutrition.model_dump()
    nutrition_dict["imageKey"] = key
    nutrition_dict["userId"] = id

    backend_url = os.getenv("NODEJS_BACKEND")

    with httpx.Client(timeout=30.0) as client:
        client.post(
            f"{backend_url}/api/save-analysis",
            json=nutrition_dict,
        )


@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}


@app.post("/analyze-image")
async def analyze_uploaded_image(
    req: AnalyzeImageUrl, background_tasks: BackgroundTasks
):
    print("The req is: ", req)
    try:
        background_tasks.add_task(process_image, req.key, req.id)

        return {"message": "Image analysis started.", "status": "PROCESSING"}
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(status_code=400, detail="Invalid image file.") from exc
