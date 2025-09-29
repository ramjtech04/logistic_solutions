import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { createRequest, getMyRequests,getPendingRequests,acceptRequest,getMyAvailableTrucks} from "../controllers/requestController";
import { createRequestValidation } from "../validators/requestValidator";
import { validateRequest } from "../middleware/validateRequest";
import { authorizeRoles } from "../middleware/roleMiddleware";
const router = Router();

// Create a new request
// Only Customers can create
router.post("/create",verifyToken, authorizeRoles(["admin","customer"]),
  createRequestValidation,validateRequest,createRequest);

// Get all requests of logged-in customer
router.get("/my-requests",verifyToken,authorizeRoles(["customer"]),getMyRequests);
// Truck owner routes
//fetch all trucks with status=available
router.get("/available", verifyToken, authorizeRoles(["truck_owner","admin"]), getPendingRequests);
//accept request
router.post("/accept/:id", verifyToken, authorizeRoles(["truck_owner"]), acceptRequest);
//fetch only logged in customer status=available trucks
router.get("/my-available", verifyToken, authorizeRoles(["truck_owner"]),getMyAvailableTrucks);
export default router;