import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel";
import PasswordResetOTP from "../models/passwordResetOtp";
import { sendEmail } from "../utils/sendEmail";
import logger from "../utils/logger";

// Helper to generate JWT with role included
const generateToken = (id: string, role: string): string => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "30d" });
};

// Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        data: null,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    // send email only if role is customer or truck_owner
    if (user && (user.role === "customer" || user.role === "truck_owner")) {
         await sendEmail({
        to: process.env.EMAIL_USER!,
        subject: "New User Registration Notification",
        text: `New User Registration Notification.`,
        html: `<h3>New User Registration Alert</h3>
        <p>A new user has just registered on the Logistic Solution platform.</p>
        <h4>User Details:</h4>
        <ul>
        <li><strong>Name:</strong> ${user.name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Phone:</strong> ${user.phone}</li>
        <li><strong>Role:</strong> ${user.role.toUpperCase()}</li>
        </ul><p>Registration  Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        <p>This is an automated notification from Logistic Solution.</p>`,
        sendToAdmins:true
 

      });
  
    }

    //Response
    if (user) {
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user.id, user.role),
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
        data: null,
      });
    }
  } catch (error: any) {
    if (error.code === 11000 && error.keyValue) {
      const field = Object.keys(error.keyValue)[0];
      if (field) {
        return res.status(400).json({
          success: false,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
          data: null,
        });
      }
    }
    logger.error("Error registerUser",error)
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};







// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    // send email only if role is customer or truck_owner
    if (user.role === "customer" || user.role === "truck_owner") {
        await sendEmail({
        to: process.env.EMAIL_USER!,
        subject: "User Logged In",
        text: `User logged in on the platform.`,
        html: `<h3>User Login Alert</h3>
        <p>A user has just logged into the Logistic Solution platform.</p>
        <h4>User Details:</h4>
        <ul>
        <li><strong>Name:</strong> ${user.name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Phone:</strong> ${user.phone}</li>
        <li><strong>Role:</strong> ${user.role.toUpperCase()}</li>
        </ul><p>Login Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        <p>This is an automated notification from Logistic Solution.</p>`,
        sendToAdmins:true
 

      });
    }

    // always return success response
    return res.json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user.id, user.role),
      },
    });
  } catch (error: any) {
       logger.error("Error auth controller loginUser",error)
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};


//FORGOT PASSWORD (OTP)
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    //  Checking user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    //  Remove old OTPs
    await PasswordResetOTP.deleteMany({ userId: user._id });

    // Save new OTP
    await PasswordResetOTP.create({
      userId: user._id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    });

    //  Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    logger.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// VERIFY OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Find OTP record
    const otpRecord = await PasswordResetOTP.findOne({ userId: user._id });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    //  Check expiry
    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.deleteOne();
      return res.status(400).json({ message: "OTP expired" });
    }

    // Compare hash
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== otpRecord.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }



    //  Mark as used
    otpRecord.used = true;
    await otpRecord.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    logger.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    //  Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //  Update password
    user.password = hashedPassword;
    await user.save();

    //  Cleanup OTPs
    await PasswordResetOTP.deleteMany({ userId: user._id });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    logger.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const sendEnquiry = async (req: Request, res: Response) => {
  try {
    const { name, email,phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await sendEmail({
      to: process.env.EMAIL_USER!, // admin email
      subject: "New Enquiry – Logistics App",
      text: `New enquiry received:`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color:#991b1b;">New Enquiry Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background:#f9f9f9;padding:10px;border-radius:6px;">
            ${message}
          </p>
          <p><strong>Time:</strong> ${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}</p>
          <hr />
          <p>— Logistics App</p>
        </div>
      `,
      sendToAdmins:true
    });

    return res.status(200).json({
      success: true,
      message: "Enquiry sent successfully",
    });
  } catch (error: any) {
    logger.error("Send Enquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send enquiry",
    });
  }
};