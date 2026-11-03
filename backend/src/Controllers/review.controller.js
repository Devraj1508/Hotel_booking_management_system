import { Booking } from '../models/Booking.model.js';
import { Review } from '../models/Review.model.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/ApiResponse.js';

export async function listForHotel(req, res, next) {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId }).populate('user', 'name avatar').sort({ createdAt: -1 });
    return sendResponse(res, 200, { reviews });
  } catch (error) { return next(error); }
}

export async function create(req, res, next) {
  try {
    const booking = await Booking.findOne({ _id: req.body.bookingId, user: req.user._id, hotel: req.params.hotelId, status: { $in: ['completed', 'confirmed'] } });
    if (!booking) throw new ApiError(400, 'You can only review a hotel you have booked');
    const review = await Review.create({ ...req.body, booking: booking._id, hotel: booking.hotel, user: req.user._id });
    return sendResponse(res, 201, { review }, 'Review added');
  } catch (error) { return next(error); }
}
