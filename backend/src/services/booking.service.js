import mongoose from 'mongoose';
import { Booking } from '../models/Booking.model.js';
import { Room } from '../models/Room.model.js';
import { assertRoomAvailable, dateOnly, nightsBetween } from './availability.service.js';
import { ApiError } from '../utils/ApiError.js';

export async function createBooking({ userId, roomId, checkIn, checkOut, guests }) {
  const room = await Room.findOne({ _id: roomId, active: true });
  if (!room) throw new ApiError(404, 'Room not found');
  if (guests > room.capacity) throw new ApiError(400, 'This room cannot accommodate that many guests');
  const start = dateOnly(checkIn);
  const end = dateOnly(checkOut);
  const nights = nightsBetween(start, end);
  if (nights < 1) throw new ApiError(400, 'Check-out must be after check-in');

  const session = await mongoose.startSession();
  try {
    let booking;
    await session.withTransaction(async () => {
      await assertRoomAvailable(room, start, end, session);
      [booking] = await Booking.create([{
        user: userId, hotel: room.hotel, room: room._id, checkIn: start, checkOut: end,
        guests, nights, totalPrice: nights * room.pricePerNight
      }], { session });
    });
    return Booking.findById(booking._id).populate('hotel room');
  } finally {
    await session.endSession();
  }
}
