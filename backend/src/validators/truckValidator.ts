import { body } from "express-validator";

// Regex for Indian truck number
const truckNumberRegex = /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4}$/;

export const addTruckValidation = [
  body("truckNumber")
    .notEmpty().withMessage("Truck number is required")
    .matches(truckNumberRegex).withMessage("Truck number must be valid (e.g., MHXXABXXXX)"),

  body("truckType")
    .notEmpty().withMessage("Truck type is required")
    .isIn(["open", "container", "trailer", "tanker", "refrigerated"])
    .withMessage("Invalid truck type"),

  body("capacity")
    .notEmpty().withMessage("Capacity is required")
    .isNumeric().withMessage("Capacity must be a number")
    .custom((value) => value > 0).withMessage("Capacity must be positive"),

  body("state")
    .notEmpty().withMessage("State is required")
    .isLength({ min: 2 }).withMessage("State name too short"),

  body("city")
    .notEmpty().withMessage("City is required")
    .isLength({ min: 2 }).withMessage("City name too short"),

  body("fuelType")
    .notEmpty().withMessage("Fuel type is required")
    .isIn(["diesel", "petrol", "cng", "electric"])
    .withMessage("Invalid fuel type"),
];

// For update 
export const updateTruckValidation = [
  body("truckNumber")
    .optional()
    .matches(truckNumberRegex).withMessage("Truck number must be valid (e.g., MH12AB1234)"),

  body("truckType")
    .optional()
    .isIn(["open", "container", "trailer", "tanker", "refrigerated"])
    .withMessage("Invalid truck type"),

  body("capacity")
    .optional()
    .isNumeric().withMessage("Capacity must be a number")
    .custom((value) => value > 0).withMessage("Capacity must be positive"),

  body("state")
    .optional()
    .isLength({ min: 2 }).withMessage("State name too short"),

  body("city")
    .optional()
    .isLength({ min: 2 }).withMessage("City name too short"),

  body("fuelType")
    .optional()
    .isIn(["diesel", "petrol", "cng", "electric"])
    .withMessage("Invalid fuel type"),
];
