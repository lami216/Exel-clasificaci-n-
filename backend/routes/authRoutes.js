import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/login', login);
router.get('/me', protectAdmin, me);

export default router;
