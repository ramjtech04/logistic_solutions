import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { createRequest, getMyRequests,getAvailableRequests,acceptRequest } from "../controllers/requestController";
import { createRequestValidation } from "../validators/requestValidator";
import { validateRequest } from "../middleware/validateRequest";
import { authorizeRoles } from "../middleware/roleMiddleware";
const router = Router();

// Create a new request
// Only Customers can create
router.post(
  "/",verifyToken,createRequestValidation,validateRequest,
  authorizeRoles(["customer"]),createRequest);

// Get all requests of logged-in customer
router.get(
  "/my",verifyToken,authorizeRoles(["customer"]),getMyRequests);

  // Truck owner routes
router.get("/available", verifyToken, authorizeRoles(["truck_owner"]), getAvailableRequests);
router.post("/accept/:id", verifyToken, authorizeRoles(["truck_owner"]), acceptRequest);
export default router;