import { Router } from 'express';
import { getProfile, updateProfile } from '../Controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
export default router;
