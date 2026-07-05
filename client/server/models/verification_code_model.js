import mongoose, { Schema } from "mongoose";

const VerificationCodeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true },
);

const VerificationCodeModel = mongoose.model(
  "verification_code",
  VerificationCodeSchema,
);

export default VerificationCodeModel;
