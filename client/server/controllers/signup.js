import bcrypt from "bcryptjs";
import UserModel from "../models/user_model.js";
import VerificationCodeModel from "../models/verification_code_model.js";

const SALT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupUser = async (req, res) => {
  try {
    const { name: rawName, email: rawEmail, password, otp } = req.body ?? {};
    const name = rawName?.trim();
    const email = rawEmail?.trim().toLowerCase();

    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and verification code are required.",
      });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid six-digit verification code.",
      });
    }

    const existingUser = await UserModel.exists({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const verification = await VerificationCodeModel.findOne({
      email,
      expiresAt: { $gt: new Date() },
    });

    const isValidOtp =
      verification && (await bcrypt.compare(otp, verification.codeHash));

    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        message: "The verification code is invalid or has expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    await VerificationCodeModel.deleteOne({ email });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Failed to create user:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create the account. Please try again.",
    });
  }
};

export default SignupUser;
