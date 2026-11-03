import { Router } from 'express';
import { createRoom, deleteRoom, listRooms, updateRoom } from '../Controllers/room.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { roomSchema } from '../validators/hotel.validator.js';

const router = Router();
router.get('/', listRooms);
router.post('/hotel/:hotelId', requireAuth, requireAdmin, validate(roomSchema), createRoom);
router.patch('/:id', requireAuth, requireAdmin, validate(roomSchema.partial()), updateRoom);
router.delete('/:id', requireAuth, requireAdmin, deleteRoom);
export default router;
