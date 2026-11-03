import { Router } from 'express';
import { createHotel, deleteHotel, getHotel, listHotels, updateHotel } from '../Controllers/hotel.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { hotelSchema } from '../validators/hotel.validator.js';

const router = Router();
router.get('/', listHotels);
router.get('/:id', getHotel);
router.post('/', requireAuth, requireAdmin, validate(hotelSchema), createHotel);
router.patch('/:id', requireAuth, requireAdmin, validate(hotelSchema.partial()), updateHotel);
router.delete('/:id', requireAuth, requireAdmin, deleteHotel);
export default router;
