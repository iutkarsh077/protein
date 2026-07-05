import { Router } from "express"
import analyzeImage from "../controllers/analyze-image.js";
import getPresignedUrl from "../controllers/aws_presignedUrl.js";
import getUser from "../controllers/get-user.js";
import LoginUser from "../controllers/login.js";
import SaveAnalysis from "../controllers/save-analysis.js";
import SendVerificationOTP from "../controllers/send-otp.js";
import SignupUser from "../controllers/signup.js";
import GetCookie from "../helpers/get-cookie.js";
import getUserData from "../controllers/get-user-data.js";

const route = Router();

route.post("/get-url", getPresignedUrl)
route.post("/analyze-image", analyzeImage)
route.post("/login", LoginUser)
route.post("/save-analysis", SaveAnalysis)
route.post("/send-otp", SendVerificationOTP)
route.post("/signup", SignupUser)
route.get("/get-user", GetCookie, getUser);
route.get("/get-user-data", GetCookie, getUserData);
export default route;
