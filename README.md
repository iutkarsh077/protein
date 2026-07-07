# Nourish — Eat well. Feel good.

![Nourish Dashboard](http://res.cloudinary.com/dakddv1pm/image/upload/v1783288167/posts/p731vyiwqvw5u2mwtftm.png)

**Nourish** is an AI-powered nutrition tracking app. Users upload meal photos, get automatic macro and calorie estimates, and view a daily dashboard with calories, protein, carbs, fats, fiber, sugar, and weekly intake trends.

**Live app:** [https://protein-nine.vercel.app](https://protein-nine.vercel.app)
---
**Demo video:** [https://youtu.be/AKqM69CaISE?si=siKE3SrrPglRCRxe](https://youtu.be/AKqM69CaISE?si=siKE3SrrPglRCRxe)
---

## Features

- **Meal photo upload** — file upload or live camera capture
- **AI nutrition analysis** — InternVL3 vision model + GPT structured output
- **Daily dashboard** — calories, macros, sugar intake, analysis confidence
- **Weekly intake chart** — 7-day calorie trends
- **User auth** — signup, OTP email verification, JWT cookie-based login
- **Historical data** — browse nutrition by date

---

## Architecture

```
┌─────────────────┐
│  React (Vercel) │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────────────────┐
│  API Gateway + Lambda       │
│  Express.js (client/server) │
│  • Auth, S3 presign, proxy  │
└────────┬────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐  ┌──────────────────────┐
│ MongoDB│  │  ECS Fargate         │
│ Atlas  │  │  FastAPI (server/)   │
│        │  │  InternVL3 + GPT     │
└────────┘  └──────────┬───────────┘
                       │
                       ▼
              ┌────────────────┐
              │  AWS S3        │
              │  (meal images) │
              └────────────────┘
```

| Layer | Tech | Hosting |
|-------|------|---------|
| Frontend | React 19, Vite, Tailwind CSS, shadcn/ui | Vercel |
| API / Auth | Express.js 5, Mongoose, JWT | AWS Lambda + API Gateway |
| ML / Analysis | FastAPI, InternVL3-1B, LangChain + OpenAI | AWS ECS (Docker) + ECR |
| Storage | AWS S3 | ap-south-1 |
| Database | MongoDB Atlas | Cloud |

---

## Project structure

```
vl3/
├── client/
│   ├── react/          # Frontend (Vite + React)
│   │   └── src/
│   │       ├── components/home/   # Dashboard cards, camera, sidebar
│   │       ├── contexts/          # Global auth context
│   │       └── lib/               # Nutrition dashboard logic
│   └── server/         # Express API (Lambda)
│       ├── controllers/
│       ├── helpers/
│       ├── models/
│       ├── lambda.js   # Lambda handler
│       ├── local.js    # Local dev server
│       └── serverless.yml
└── server/             # FastAPI ML service (ECS)
    ├── main.py
    ├── model_calling.py
    ├── Dockerfile
    └── requirements.txt
```

---

## How meal analysis works

1. User uploads a photo on the dashboard.
2. **Express (Lambda)** returns an S3 presigned URL → browser uploads image to S3.
3. **Express** proxies `POST /api/analyze-image` → **FastAPI on ECS**.
4. **FastAPI** queues background work and returns `{ status: "PROCESSING" }`.
5. Background pipeline:
   - Download image from S3
   - Run **InternVL3** vision model for food detection
   - Structure output with **GPT** (LangChain)
   - Save results via `POST /api/save-analysis` → **MongoDB**
6. React refreshes dashboard data.

---

## Tech stack

### Frontend (`client/react`)

- React 19, React Router, Vite
- Tailwind CSS 4, shadcn/ui
- Axios, date-fns, react-toastify
- Camera capture via `getUserMedia`

### Express API (`client/server`)

- Express 5, Mongoose, bcryptjs, JWT
- AWS SDK S3 presigned URLs
- Nodemailer (OTP emails)
- `@codegenie/serverless-express` for Lambda
- Serverless Framework for deploy

### ML service (`server`)

- FastAPI, Uvicorn
- **InternVL3-1B-hf** (Hugging Face transformers)
- LangChain OpenAI for structured nutrition JSON
- PyTorch, Pillow, boto3, httpx
- Docker (PyTorch CUDA base image)

---

## API endpoints (Express / Lambda)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Register user |
| POST | `/api/send-otp` | Send email OTP |
| POST | `/api/login` | Login (JWT cookie) |
| GET | `/api/get-user` | Current user (auth) |
| GET | `/api/get-user-data` | Nutrition history (auth) |
| POST | `/api/get-url` | S3 presigned upload URL |
| POST | `/api/analyze-image` | Proxy to FastAPI ECS |
| POST | `/api/save-analysis` | Save nutrition to MongoDB |
| GET | `/health` | Health check |

### FastAPI (`server`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health |
| POST | `/analyze-image` | Start async image analysis |

---

## Environment variables

### `client/react/.env`

```env
VITE_BACKEND_API_URL=https://your-api.execute-api.us-east-1.amazonaws.com
```

### `client/server/.env`

```env
FRONTEND_URL=https://protein-nine.vercel.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_REGION=ap-south-1
S3_BUCKET_NAME=...
SMTP_EMAIL=...
SMTP_PASSWORD=...
FASTAPI_BACKEND=http://ECS_PUBLIC_IP:8000
```

### `server/.env`

```env
INTERN_VL3=hf_...              # Hugging Face token
OPENAI_API_KEY=sk-...
AWS_ACCESS_KEY=...
AWS_SECRET_KEY=...
AWS_BUCKET_NAME=...
AWS_REGION=ap-south-1
NODEJS_BACKEND=https://your-api.execute-api.us-east-1.amazonaws.com
FRONTEND_URL=https://protein-nine.vercel.app
```

> Never commit `.env` files. Use `.env.example` with placeholders for GitHub.

---

## Local development

### Prerequisites

- Node.js 20+
- Python 3.11+
- MongoDB Atlas URI
- AWS credentials (S3)
- Hugging Face + OpenAI API keys

### Frontend

```bash
cd client/react
npm install
npm run dev
# → http://localhost:5173
```

### Express API

```bash
cd client/server
npm install
npm run dev
# → http://localhost:4000
```

### FastAPI ML service

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

---

## Deployment

### Frontend → Vercel

1. Connect repo to Vercel
2. Set `VITE_BACKEND_API_URL`
3. Deploy `client/react`

### Express → AWS Lambda

```bash
cd client/server
npx serverless deploy
```

### FastAPI → AWS ECS + ECR

```bash
cd server
docker build -t vl3-fastapi:latest .
docker tag vl3-fastapi:latest ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPO:latest
docker push ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPO:latest
# ECS → force new deployment
```

**Important:** Update Lambda `FASTAPI_BACKEND` when ECS public IP changes.

---

## Security notes

- JWT stored in `httpOnly` cookies (`secure`, `sameSite: 'none'` in production)
- S3 direct upload via presigned URLs (browser → S3)
- Lambda env vars must use `S3_*` prefixes (not `AWS_*` — reserved on Lambda)
- S3 bucket CORS must allow your Vercel origin
- ECS security group must allow inbound **TCP 8000** from `0.0.0.0/0` for Lambda proxy
- Rotate any credentials that were committed or exposed

---

## License

ISC (server packages). Add a project license as needed.

---

## Author

Built by Utkarsh Singh
