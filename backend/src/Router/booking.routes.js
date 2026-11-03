import { Router } from 'express';
import { cancel, create, listAll, listMine } from '../Controllers/booking.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { bookingSchema } from '../validators/booking.validator.js';

const router = Router();
router.use(requireAuth);
router.get('/', listMine);
router.post('/', validate(bookingSchema), create);
router.patch('/:id/cancel', cancel);
router.get('/admin/all', requireAdmin, listAll);
export default router;
