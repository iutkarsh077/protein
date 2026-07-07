import 'dotenv/config';
import e from "express";
import cors from "cors";
import route from './routers/index.js';
import dbConnect from './helpers/dbConnect.js';
import cookieParser from 'cookie-parser';

const app = e();

app.use(e.json());
app.use(cookieParser());

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["PUT", "POST", "GET"],
  credentials: true,
}));


app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    console.error("DB connection failed:", error);
    return res.status(500).json({ message: "Database unavailable" });
  }
});

app.use("/api", route);

app.get("/health", (req, res) => {
  return res.json({ currentDate: new Date().toISOString() });
});

dbConnect().then(()=>{
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}).catch((error)=>{
  console.error("DB connection failed:", error);
  process.exit(1);
})