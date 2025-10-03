"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// All requests
router.get("/requests", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), adminController_1.getAllRequests);
// Accepted requests
router.get("/requests/accepted", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), adminController_1.getAcceptedRequests);
// Approve a request
router.patch("/requests/approve/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), adminController_1.approveRequest);
// Reject a request
router.patch("/requests/reject/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), adminController_1.rejectRequest);
// Manual assignment of a truck to a request
router.patch("/requests/manual-assign", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), adminController_1.manualAssignRequest);
//delete the request
router.delete("/requests/delete/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), adminController_1.deleteRequest);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map