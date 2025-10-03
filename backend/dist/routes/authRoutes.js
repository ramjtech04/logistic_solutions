"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authValidator_1 = require("../validators/authValidator");
const validateRequest_1 = require("../middleware/validateRequest");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const forgotPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { message: "Too many requests, try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});
// Public routes only
router.post('/register', authValidator_1.registerValidation, validateRequest_1.validateRequest, authController_1.registerUser);
router.post('/login', authValidator_1.loginValidation, validateRequest_1.validateRequest, authController_1.loginUser);
router.post("/forgot-password", forgotPasswordLimiter, authController_1.forgotPassword);
router.post("/verify-otp", authController_1.verifyOTP);
router.post("/reset-password", authValidator_1.resetPasswordValidation, validateRequest_1.validateRequest, authController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map