"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const requestController_1 = require("../controllers/requestController");
const requestValidator_1 = require("../validators/requestValidator");
const validateRequest_1 = require("../middleware/validateRequest");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Create a new request
// Only Customers can create
router.post("/create", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "customer"]), requestValidator_1.createRequestValidation, validateRequest_1.validateRequest, requestController_1.createRequest);
// Get all requests of logged-in customer
router.get("/my-requests", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["customer"]), requestController_1.getMyRequests);
// Truck owner routes
//fetch all trucks with status=available
router.get("/available", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["truck_owner", "admin"]), requestController_1.getPendingRequests);
//accept request
router.post("/accept/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["truck_owner"]), requestController_1.acceptRequest);
//fetch only logged in customer status=available trucks
router.get("/my-available", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["truck_owner"]), requestController_1.getMyAvailableTrucks);
exports.default = router;
//# sourceMappingURL=requestRoutes.js.map