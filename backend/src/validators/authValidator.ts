import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 chars long"),

  body("email")
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .withMessage("Only valid Gmail addresses are allowed (no spaces/special chars before @).")
    .isEmail()
    .withMessage("Email must be valid"),
  body("phone")
  .matches(/^[6-9]\d{9}$/)
  .isLength({ min: 10 }).withMessage("Phone must be at least 10 digits"),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "truck_owner", "customer"]).withMessage("Invalid role"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Must be a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];
export const resetPasswordValidation = [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
