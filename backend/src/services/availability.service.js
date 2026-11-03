import { Booking } from '../models/Booking.model.js';
import { ApiError } from '../utils/ApiError.js';

export function dateOnly(value) {
  const date = new Date(value);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export function nightsBetween(checkIn, checkOut) {
  return Math.ceil((dateOnly(checkOut) - dateOnly(checkIn)) / 86400000);
}

export async function getReservedRoomCount(roomId, checkIn, checkOut, session) {
  const query = Booking.find({
    room: roomId,
    status: { $in: ['confirmed', 'completed'] },
    checkIn: { $lt: dateOnly(checkOut) },
    checkOut: { $gt: dateOnly(checkIn) }
  });
  if (session) query.session(session);
  const bookings = await query;
  return bookings.length;
}

export async function assertRoomAvailable(room, checkIn, checkOut, session) {
  const reserved = await getReservedRoomCount(room._id, checkIn, checkOut, session);
  if (reserved >= room.quantity) {
    throw new ApiError(409, 'The selected room is not available for those dates');
  }
}
