import { Router } from 'express';
import { login, logout, me, register } from '../Controllers/auth.controller.js';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware.js';
import { authRateLimit } from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = Router();
router.post('/register', authRateLimit, validate(registerSchema), register);
router.post('/login', authRateLimit, validate(loginSchema), login);
router.get('/me', optionalAuth, me);
router.post('/logout', requireAuth, logout);
export default router;
