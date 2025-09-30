import express from 'express';
import { login, verifyTokenController } from '../controllers/authController.mjs';
import { authenticate } from '../middlewares/authMiddleware.mjs';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/verify
router.get('/verify', authenticate, verifyTokenController);

export default router;