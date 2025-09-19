import { Router } from 'express';
import { registerUser, loginUser, forgotPassword,verifyOTP,resetPassword,} from '../controllers/authController';
import { registerValidation, loginValidation } from '../validators/authValidator';
import { validateRequest } from '../middleware/validateRequest';
import rateLimit from "express-rate-limit";
const router = Router();
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  message: { message: "Too many requests, try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});
// Public routes only
router.post('/register',  registerValidation, validateRequest, registerUser);
router.post('/login', loginValidation, validateRequest,loginUser);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
export default router;
