import { Router, Request, Response } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

// Only Admin
router.get("/admin", verifyToken, authorizeRoles(["admin"]), (req: Request, res: Response) => {
  res.json({ message: "Welcome admin" });
});

// Admin + Truck Owner
router.get("/truck-owner", verifyToken, authorizeRoles(["admin", "truck_owner"]), (req: Request, res: Response) => {
  res.json({ message: "Welcome truck owner" });
});

// Admin + Customer
router.get("/customer", verifyToken, authorizeRoles(["admin", "customer"]), (req: Request, res: Response) => {
  res.json({ message: "Welcome customer" });
});

export default router;
