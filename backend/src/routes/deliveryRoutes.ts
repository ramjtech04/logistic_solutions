import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import {
  updateDeliveryStatus,
  getMyDeliveries,
  getDeliveryStatus
} from "../controllers/deliveryController";

const router = Router();

// Update delivery status (Truck Owner / Admin)
router.patch("/updatestatus/:id",verifyToken,authorizeRoles(["truck_owner", "admin"]),updateDeliveryStatus);

// Get deliveries assigned to logged-in Truck Owner
router.get("/my",verifyToken,authorizeRoles(["truck_owner"]),getMyDeliveries);

// Get delivery status for a specific request (Customer/Admin)
router.get("/currentstatus/:id",verifyToken,authorizeRoles(["customer", "admin"]),getDeliveryStatus);

export default router;
