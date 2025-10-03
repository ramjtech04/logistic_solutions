"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOTP = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../models/userModel"));
const passwordResetOtp_1 = __importDefault(require("../models/passwordResetOtp"));
const sendEmail_1 = require("../utils/sendEmail");
// Helper to generate JWT with role included
const generateToken = (id, role) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET not defined");
    return jsonwebtoken_1.default.sign({ id, role }, JWT_SECRET, { expiresIn: "30d" });
};
// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        const userExists = await userModel_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                data: null,
            });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await userModel_1.default.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role,
        });
        // send email only if role is customer or truck_owner
        if (user && (user.role === "customer" || user.role === "truck_owner")) {
            await (0, sendEmail_1.sendEmail)({
                to: process.env.EMAIL_USER,
                subject: "New User Signed Up",
                text: `A new user has signed up on the platform.
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
Role: ${user.role}`,
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
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid user data",
                data: null,
            });
        }
    }
    catch (error) {
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
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.registerUser = registerUser;
// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.default.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
                data: null,
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
                data: null,
            });
        }
        // send email only if role is customer or truck_owner
        if (user.role === "customer" || user.role === "truck_owner") {
            await (0, sendEmail_1.sendEmail)({
                to: process.env.EMAIL_USER,
                subject: "User Logged In",
                text: `User logged in on the platform.
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
Role: ${user.role}`,
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
            data: null,
        });
    }
};
exports.loginUser = loginUser;
//FORGOT PASSWORD (OTP)
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        //  Checking user exists
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Hash OTP
        const otpHash = crypto_1.default.createHash("sha256").update(otp).digest("hex");
        //  Remove old OTPs
        await passwordResetOtp_1.default.deleteMany({ userId: user._id });
        // Save new OTP
        await passwordResetOtp_1.default.create({
            userId: user._id,
            otpHash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
        });
        //  Send email
        await (0, sendEmail_1.sendEmail)({
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
        });
        res.status(200).json({ message: "OTP sent to email" });
    }
    catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.forgotPassword = forgotPassword;
// VERIFY OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        // Find user
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //  Find OTP record
        const otpRecord = await passwordResetOtp_1.default.findOne({ userId: user._id });
        if (!otpRecord) {
            return res.status(400).json({ message: "OTP not found or expired" });
        }
        //  Check expiry
        if (otpRecord.expiresAt < new Date()) {
            await otpRecord.deleteOne();
            return res.status(400).json({ message: "OTP expired" });
        }
        // Compare hash
        const otpHash = crypto_1.default.createHash("sha256").update(otp).digest("hex");
        if (otpHash !== otpRecord.otpHash) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        //  Mark as used
        otpRecord.used = true;
        await otpRecord.save();
        res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.verifyOTP = verifyOTP;
// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password required" });
        }
        //  Find user
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //  Hash new password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        //  Update password
        user.password = hashedPassword;
        await user.save();
        //  Cleanup OTPs
        await passwordResetOtp_1.default.deleteMany({ userId: user._id });
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map