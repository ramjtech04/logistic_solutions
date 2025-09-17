import { Router, Request, Response } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import {
  getAllUsers,
  getUserById,
  getMe,
  updateMe,
  deleteMe,
  deleteUser,
  createUserByAdmin,
  updateUserByAdmin
} from "../controllers/userController";

const router=Router();

// Logged-in user profile
router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);
router.delete("/me", verifyToken, deleteMe);

// Admin-only routes
// CREATE
router.post("/create",verifyToken,authorizeRoles(["admin"]),createUserByAdmin);
//READ
router.get("/", verifyToken, authorizeRoles(["admin"]), getAllUsers);
router.get("/:id", verifyToken, authorizeRoles(["admin"]), getUserById);
//UPDATE
router.put("/:id",verifyToken,authorizeRoles(["admin"]),updateUserByAdmin);
//DELETE
router.delete("/:id", verifyToken, authorizeRoles(["admin"]), deleteUser);

export default router;