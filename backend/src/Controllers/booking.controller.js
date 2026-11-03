import { Booking } from '../models/Booking.model.js';
import { createBooking } from '../services/booking.service.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/ApiResponse.js';

export async function create(req, res, next) {
  try {
    const booking = await createBooking({ ...req.body, userId: req.user._id });
    return sendResponse(res, 201, { booking }, 'Booking confirmed');
  } catch (error) { return next(error); }
}

export async function listMine(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('hotel room').sort({ createdAt: -1 });
    return sendResponse(res, 200, { bookings });
  } catch (error) { return next(error); }
}

export async function cancel(req, res, next) {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: 'confirmed' },
      { status: 'cancelled' }, { new: true }
    ).populate('hotel room');
    if (!booking) throw new ApiError(404, 'Active booking not found');
    return sendResponse(res, 200, { booking }, 'Booking cancelled');
  } catch (error) { return next(error); }
}

export async function listAll(req, res, next) {
  try {
    const bookings = await Booking.find().populate('user hotel room').sort({ createdAt: -1 }).limit(200);
    return sendResponse(res, 200, { bookings });
  } catch (error) { return next(error); }
}
