import express from "express";
import {
  addMaintenance,
  getMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceById,
  
} from "../controllers/maintanceController";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = express.Router();

router.post("/",verifyToken, authorizeRoles(["admin","truck_owner"]), addMaintenance);
router.get("/",verifyToken, authorizeRoles(["admin","truck_owner"]),getMaintenance);
router.get("/:id",verifyToken, authorizeRoles(["admin","truck_owner"]), getMaintenanceById);
router.put("/:id",verifyToken, authorizeRoles(["admin","truck_owner"]), updateMaintenance);
router.delete("/:id",verifyToken, authorizeRoles(["admin","truck_owner"]), deleteMaintenance);

export default router;