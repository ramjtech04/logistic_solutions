"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const maintanceController_1 = require("../controllers/maintanceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), maintanceController_1.addMaintenance);
router.get("/", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), maintanceController_1.getMaintenance);
router.get("/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), maintanceController_1.getMaintenanceById);
router.put("/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), maintanceController_1.updateMaintenance);
router.delete("/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), maintanceController_1.deleteMaintenance);
exports.default = router;
//# sourceMappingURL=maintanceRoutes.js.map