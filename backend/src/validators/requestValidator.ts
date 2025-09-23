import { body } from "express-validator";

export const createRequestValidation = [
  
  body("pickupState")
    .trim()
    .notEmpty()
    .withMessage("Pickup state is required"),
  body("pickupCity")
    .trim()
    .notEmpty()
    .withMessage("Pickup city is required"),
  body("pickupAddress")
    .trim()
    .notEmpty()
    .withMessage("Pickup address is required"),

  
  body("dropState")
    .trim()
    .notEmpty()
    .withMessage("Drop state is required"),
  body("dropCity")
    .trim()
    .notEmpty()
    .withMessage("Drop city is required"),
  body("dropAddress")
    .trim()
    .notEmpty()
    .withMessage("Drop address is required"),

  
  body("loadType")
    .trim()
    .notEmpty()
    .withMessage("Load type is required"),
  body("loadWeight")
    .notEmpty()
    .withMessage("Load weight is required")
    .isFloat({ gt: 0 })
    .withMessage("Load weight must be a positive number"),
];
