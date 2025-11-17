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
        .isIn(["open", "container", "trailer", "tanker", "refrigerated", "Heavy Commerical", "Medium Commerical", "Light Commerical"])
        .withMessage("Invalid truck type"),
    (0, express_validator_1.body)("capacity")
        .notEmpty()
        .withMessage("Capacity is required")
        .custom((value) => {
        // SINGLE NUMBER → "35"
        if (/^\d+$/.test(value)) {
            if (Number(value) <= 0) {
                throw new Error("Capacity must be positive");
            }
            return true;
        }
        // RANGE → "25-40"
        if (/^\d+-\d+$/.test(value)) {
            const [min, max] = value.split("-").map(Number);
            if (isNaN(min) || isNaN(max)) {
                throw new Error("Invalid capacity ");
            }
            if (min <= 0 || max <= 0) {
                throw new Error("Capacity values must be positive");
            }
            return true;
        }
        throw new Error("Capacity must be a positive number or range (e.g., 35 or 25-40)");
    }),
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
        .isIn(["open", "container", "trailer", "tanker", "refrigerated", "Heavy Commerical", "Medium Commerical", "Light Commerical"])
        .withMessage("Invalid truck type"),
    (0, express_validator_1.body)("capacity")
        .notEmpty()
        .withMessage("Capacity is required")
        .custom((value) => {
        // SINGLE NUMBER → "35"
        if (/^\d+$/.test(value)) {
            if (Number(value) <= 0) {
                throw new Error("Capacity must be positive");
            }
            return true;
        }
        // RANGE → "25-40"
        if (/^\d+-\d+$/.test(value)) {
            const [min, max] = value.split("-").map(Number);
            if (isNaN(min) || isNaN(max)) {
                throw new Error("Invalid capacity ");
            }
            if (min <= 0 || max <= 0) {
                throw new Error("Capacity values must be positive");
            }
            return true;
        }
    }),
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