"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const deliveryController_1 = require("../controllers/deliveryController");
const router = (0, express_1.Router)();
// Update delivery status (Truck Owner / Admin)
router.patch("/updatestatus/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["truck_owner", "admin"]), deliveryController_1.updateDeliveryStatus);
// Get deliveries assigned to logged-in Truck Owner
router.get("/my", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["truck_owner"]), deliveryController_1.getMyDeliveries);
// Get delivery status for a specific request (Customer/Admin)
router.get("/currentstatus/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["customer", "admin"]), deliveryController_1.getDeliveryStatus);
exports.default = router;
//# sourceMappingURL=deliveryRoutes.js.map