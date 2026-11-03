import { Router } from 'express';
import { create, listForHotel } from '../Controllers/review.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { reviewSchema } from '../validators/booking.validator.js';

const router = Router();
router.get('/hotel/:hotelId', listForHotel);
router.post('/hotel/:hotelId', requireAuth, validate(reviewSchema), create);
export default router;
