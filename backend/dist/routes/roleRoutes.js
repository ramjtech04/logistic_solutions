"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Only Admin
router.get("/admin", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), (req, res) => {
    res.json({ message: "Welcome admin" });
});
// Admin + Truck Owner
router.get("/truck-owner", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), (req, res) => {
    res.json({ message: "Welcome truck owner" });
});
// Admin + Customer
router.get("/customer", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "customer"]), (req, res) => {
    res.json({ message: "Welcome customer" });
});
exports.default = router;
//# sourceMappingURL=roleRoutes.js.map