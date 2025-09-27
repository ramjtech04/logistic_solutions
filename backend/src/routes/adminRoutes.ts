import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { getAllRequests, approveRequest, rejectRequest,getAcceptedRequests, manualAssignRequest,deleteRequest } from "../controllers/adminController";

const router = Router();

// All requests
router.get("/requests", verifyToken, authorizeRoles(["admin"]), getAllRequests);
// Accepted requests
router.get("/requests/accepted", verifyToken, authorizeRoles(["admin"]), getAcceptedRequests);
// Approve a request
router.patch("/requests/approve/:id", verifyToken, authorizeRoles(["admin"]), approveRequest);
// Reject a request
router.patch("/requests/reject/:id", verifyToken, authorizeRoles(["admin"]), rejectRequest);
// Manual assignment of a truck to a request
router.patch("/requests/manual-assign", verifyToken, authorizeRoles(["admin"]), manualAssignRequest);
//delete the request
router.delete("/requests/delete/:id",verifyToken,authorizeRoles(["admin"]),deleteRequest);
export default router;