"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2 }).withMessage("Name must be at least 2 chars long"),
    (0, express_validator_1.body)("email")
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        .withMessage("Only valid Gmail addresses are allowed (no spaces/special chars before @).")
        .isEmail()
        .withMessage("Email must be valid"),
    (0, express_validator_1.body)("phone")
        .matches(/^[6-9]\d{9}$/)
        .isLength({ min: 10 }).withMessage("Phone must be at least 10 digits"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["admin", "truck_owner", "customer"]).withMessage("Invalid role"),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Must be a valid email"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
exports.resetPasswordValidation = [
    (0, express_validator_1.body)("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
//# sourceMappingURL=authValidator.js.map