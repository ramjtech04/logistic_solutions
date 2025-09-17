import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 chars long"),

  body("email")
    .isEmail().withMessage("Must be a valid email"),
  body("phone")
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
