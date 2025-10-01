import express from 'express';
import { login, register, verifyTokenController } from '../controllers/authController.mjs';
import { authenticate } from '../middlewares/authMiddleware.mjs';

const router = express.Router();

// POST /api/auth/register (NUEVA)
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/verify
router.get('/verify', authenticate, verifyTokenController);

export default router;