import { Router } from 'express';
import { dashboard } from '../Controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();
router.get('/dashboard', requireAuth, requireAdmin, dashboard);
export default router;
