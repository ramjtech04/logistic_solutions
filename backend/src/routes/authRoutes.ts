import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { registerValidation, loginValidation } from '../validators/authValidator';
import { validateRequest } from '../middleware/validateRequest';
const router = Router();

// Public routes only
router.post('/register',  registerValidation, validateRequest, registerUser);
router.post('/login', loginValidation, validateRequest,loginUser);

export default router;
