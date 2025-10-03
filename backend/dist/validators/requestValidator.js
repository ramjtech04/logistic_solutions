"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createRequestValidation = [
    (0, express_validator_1.body)("pickupState")
        .trim()
        .notEmpty()
        .withMessage("Pickup state is required"),
    (0, express_validator_1.body)("pickupCity")
        .trim()
        .notEmpty()
        .withMessage("Pickup city is required"),
    (0, express_validator_1.body)("pickupAddress")
        .trim()
        .notEmpty()
        .withMessage("Pickup address is required"),
    (0, express_validator_1.body)("dropState")
        .trim()
        .notEmpty()
        .withMessage("Drop state is required"),
    (0, express_validator_1.body)("dropCity")
        .trim()
        .notEmpty()
        .withMessage("Drop city is required"),
    (0, express_validator_1.body)("dropAddress")
        .trim()
        .notEmpty()
        .withMessage("Drop address is required"),
    (0, express_validator_1.body)("loadType")
        .trim()
        .notEmpty()
        .withMessage("Load type is required"),
    (0, express_validator_1.body)("loadWeight")
        .notEmpty()
        .withMessage("Load weight is required")
        .isFloat({ gt: 0 })
        .withMessage("Load weight must be a positive number"),
];
//# sourceMappingURL=requestValidator.js.map