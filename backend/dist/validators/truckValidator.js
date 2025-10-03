"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTruckValidation = exports.addTruckValidation = void 0;
const express_validator_1 = require("express-validator");
// Regex for Indian truck number
const truckNumberRegex = /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4}$/;
exports.addTruckValidation = [
    (0, express_validator_1.body)("truckNumber")
        .notEmpty().withMessage("Truck number is required")
        .matches(truckNumberRegex).withMessage("Truck number must be valid (e.g., MHXXABXXXX)"),
    (0, express_validator_1.body)("truckType")
        .notEmpty().withMessage("Truck type is required")
        .isIn(["open", "container", "trailer", "tanker", "refrigerated"])
        .withMessage("Invalid truck type"),
    (0, express_validator_1.body)("capacity")
        .notEmpty().withMessage("Capacity is required")
        .isNumeric().withMessage("Capacity must be a number")
        .custom((value) => value > 0).withMessage("Capacity must be positive"),
    (0, express_validator_1.body)("state")
        .notEmpty().withMessage("State is required")
        .isLength({ min: 2 }).withMessage("State name too short"),
    (0, express_validator_1.body)("city")
        .notEmpty().withMessage("City is required")
        .isLength({ min: 2 }).withMessage("City name too short"),
    (0, express_validator_1.body)("fuelType")
        .notEmpty().withMessage("Fuel type is required")
        .isIn(["diesel", "petrol", "cng", "electric"])
        .withMessage("Invalid fuel type"),
];
// For update 
exports.updateTruckValidation = [
    (0, express_validator_1.body)("truckNumber")
        .optional()
        .matches(truckNumberRegex).withMessage("Truck number must be valid (e.g., MH12AB1234)"),
    (0, express_validator_1.body)("truckType")
        .optional()
        .isIn(["open", "container", "trailer", "tanker", "refrigerated"])
        .withMessage("Invalid truck type"),
    (0, express_validator_1.body)("capacity")
        .optional()
        .isNumeric().withMessage("Capacity must be a number")
        .custom((value) => value > 0).withMessage("Capacity must be positive"),
    (0, express_validator_1.body)("state")
        .optional()
        .isLength({ min: 2 }).withMessage("State name too short"),
    (0, express_validator_1.body)("city")
        .optional()
        .isLength({ min: 2 }).withMessage("City name too short"),
    (0, express_validator_1.body)("fuelType")
        .optional()
        .isIn(["diesel", "petrol", "cng", "electric"])
        .withMessage("Invalid fuel type"),
];
//# sourceMappingURL=truckValidator.js.map