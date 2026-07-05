import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/user_model.js";

const INVALID_CREDENTIALS_RESPONSE = {
  success: false,
  message: "Invalid email or password.",
};

const LoginUser = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body ?? {};
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json(INVALID_CREDENTIALS_RESPONSE);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json(INVALID_CREDENTIALS_RESPONSE);
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie('token', token, {
        maxAge: 172800000, // Expires in 2 days (in milliseconds)
        httpOnly: true, // Prevents client-side JS from reading the cookie
        secure: true,   // Sends cookie only over HTTPS (use false for local http testing)
        sameSite: 'none' // Protects against CSRF attacks
    });

    return res.status(200).json({
      success: true,
      message: "Signed in successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Failed to sign in:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to sign in. Please try again.",
    });
  }
};

export default LoginUser;
