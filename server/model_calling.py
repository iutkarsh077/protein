import os
from functools import lru_cache

import torch
from dotenv import load_dotenv
from PIL import Image
from transformers import AutoModelForImageTextToText, AutoProcessor

load_dotenv()

MODEL_NAME = "OpenGVLab/InternVL3-1B-hf"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


prompt_text = """
You are a nutrition expert.

Analyze the food in this image.

Instructions:
- Return ONLY valid JSON.
- No markdown.
- No code fences.
- No explanation.
- Use numbers for numeric values.
- If a value is unknown, use null.

Schema:

{
  "food_name": "string",
  "estimated_weight_g": 0,
  "calories": 0,
  "protein_g": 0,
  "carbohydrates_g": 0,
  "fat_g": 0,
  "fiber_g": 0,
  "sugar_g": 0,
  "confidence": 0.0
}
"""


@lru_cache(maxsize=1)
def _load_model():
    """Load the processor and model once, on the first API request."""
    token = os.getenv("INTERN_VL3")
    processor = AutoProcessor.from_pretrained(MODEL_NAME, token=token)
    model = AutoModelForImageTextToText.from_pretrained(
        MODEL_NAME,
        token=token,
        torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32,
    ).to(DEVICE)
    model.eval()
    return processor, model


def analyze_image(image: Image.Image) -> str:
    """Run InternVL3 against a PIL image and return its generated response."""
    processor, model = _load_model()
    image = image.convert("RGB")

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image"},
                {"type": "text", "text": prompt_text},
            ],
        }
    ]
    prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
    inputs = processor(images=image, text=prompt, return_tensors="pt").to(DEVICE)

    with torch.inference_mode():
        output = model.generate(**inputs, max_new_tokens=256)

    # Decode only newly generated tokens so the answer does not repeat the prompt.
    input_length = inputs["input_ids"].shape[1]
    generated_tokens = output[:, input_length:]
    return processor.batch_decode(
        generated_tokens,
        skip_special_tokens=True,
    )[0].strip()
