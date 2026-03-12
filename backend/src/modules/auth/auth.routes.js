import { Router } from 'express';
import { register, login, getMe, forgotPassword, logout, updateProfile, changePassword } from './auth.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { loginSchema, signupSchema, forgotPasswordSchema, updateProfileSchema, changePasswordSchema } from './auth.validation.js';

const router = Router();

router.post('/signup', validate(signupSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);
router.put('/profile', authMiddleware, validate(updateProfileSchema), updateProfile);
router.put('/change-password', authMiddleware, validate(changePasswordSchema), changePassword);

export default router;
