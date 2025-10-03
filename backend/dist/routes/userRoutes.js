"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Logged-in user profile
router.get("/me", authMiddleware_1.verifyToken, userController_1.getMe);
router.put("/me", authMiddleware_1.verifyToken, userController_1.updateMe);
router.delete("/me", authMiddleware_1.verifyToken, userController_1.deleteMe);
// Admin-only routes
// CREATE
router.post("/create", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), userController_1.createUserByAdmin);
//READ
//router.get("/", verifyToken, authorizeRoles(["admin"]), getAllUsers);
router.get("/admins", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), userController_1.getAdmins);
router.get("/customers", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), userController_1.getCustomers);
router.get("/truck-owners", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), userController_1.getTruckOwners);
router.get("/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), userController_1.getUserById);
//UPDATE
router.put("/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), userController_1.updateUserByAdmin);
//DELETE
router.delete("/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map