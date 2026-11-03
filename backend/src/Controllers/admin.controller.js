import { User } from '../models/User.model.js';
import { Booking } from '../models/Booking.model.js';
import { Hotel } from '../models/Hotel.model.js';
import { sendResponse } from '../utils/ApiResponse.js';

export async function dashboard(_req, res, next) {
  try {
    const [users, hotels, bookings, revenue] = await Promise.all([
      User.countDocuments(), Hotel.countDocuments(), Booking.countDocuments({ status: { $ne: 'cancelled' } }),
      Booking.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }])
    ]);
    return sendResponse(res, 200, { stats: { users, hotels, bookings, revenue: revenue[0]?.total || 0 } });
  } catch (error) { return next(error); }
}
