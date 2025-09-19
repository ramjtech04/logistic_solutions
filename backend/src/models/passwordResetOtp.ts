import { Schema, model, Document, Types } from "mongoose";

export interface IPasswordResetOTP extends Document {
  userId: Types.ObjectId;   
  otpHash: string;
  expiresAt: Date;
  used: boolean;
  attempts: number;
  createdAt: Date;          
  updatedAt: Date;         
}

const passwordResetOTPSchema = new Schema<IPasswordResetOTP>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true } 
);

export default model<IPasswordResetOTP>(
  "PasswordResetOTP",
  passwordResetOTPSchema
);
