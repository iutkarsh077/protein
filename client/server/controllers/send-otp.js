import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";

import { sendMail } from "../helpers/send-email.js";
import UserModel from "../models/user_model.js";
import VerificationCodeModel from "../models/verification_code_model.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_LIFETIME_MS = 10 * 60 * 1000;

const SendVerificationOTP = async (req, res) => {
  try {
    const { name: rawName, email: rawEmail } = req.body ?? {};
    const name = rawName?.trim();
    const email = rawEmail?.trim().toLowerCase();

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required.",
      });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const existingUser = await UserModel.exists({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const otp = randomInt(100000, 1000000).toString();
    const codeHash = await bcrypt.hash(otp, 10);

    await VerificationCodeModel.findOneAndUpdate(
      { email },
      {
        codeHash,
        expiresAt: new Date(Date.now() + OTP_LIFETIME_MS),
      },
      { upsert: true, runValidators: true },
    );

    try {
      await sendMail({
        to: email,
        name,
        subject: "Your VL3 verification code",
        body: otp,
      });
    } catch (emailError) {
      await VerificationCodeModel.deleteOne({ email });
      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    console.error("Failed to send verification code:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send the verification code. Please try again.",
    });
  }
};

export default SendVerificationOTP;
