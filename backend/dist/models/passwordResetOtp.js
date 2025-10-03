"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const passwordResetOTPSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("PasswordResetOTP", passwordResetOTPSchema);
//# sourceMappingURL=passwordResetOtp.js.map