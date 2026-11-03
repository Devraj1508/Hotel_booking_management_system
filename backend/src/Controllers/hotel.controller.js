import { Hotel } from '../models/Hotel.model.js';
import { Room } from '../models/Room.model.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/ApiResponse.js';

export async function listHotels(req, res, next) {
  try {
    const { q, location, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (location) filter.location = new RegExp(String(location), 'i');
    if (q) {
      const search = String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (search) {
        filter.$or = [
          { name: new RegExp(search, 'i') },
          { location: new RegExp(search, 'i') },
          { category: new RegExp(search, 'i') },
          { amenities: new RegExp(search, 'i') }
        ];
      }
    }
    const size = Math.min(Number(limit) || 12, 50);
    const [hotels, total] = await Promise.all([
      Hotel.find(filter).sort({ rating: -1, createdAt: -1 }).skip((Number(page) - 1) * size).limit(size).lean(),
      Hotel.countDocuments(filter)
    ]);
    return sendResponse(res, 200, { hotels, total, page: Number(page), pages: Math.ceil(total / size) });
  } catch (error) { return next(error); }
}

export async function getHotel(req, res, next) {
  try {
    const hotel = await Hotel.findById(req.params.id).lean();
    if (!hotel) throw new ApiError(404, 'Hotel not found');
    const rooms = await Room.find({ hotel: hotel._id, active: true }).lean();
    return sendResponse(res, 200, { hotel: { ...hotel, rooms } });
  } catch (error) { return next(error); }
}

export async function createHotel(req, res, next) {
  try {
    const hotel = await Hotel.create({ ...req.body, owner: req.user._id });
    return sendResponse(res, 201, { hotel }, 'Hotel created');
  } catch (error) { return next(error); }
}

export async function updateHotel(req, res, next) {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) throw new ApiError(404, 'Hotel not found');
    return sendResponse(res, 200, { hotel }, 'Hotel updated');
  } catch (error) { return next(error); }
}

export async function deleteHotel(req, res, next) {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) throw new ApiError(404, 'Hotel not found');
    await Room.deleteMany({ hotel: hotel._id });
    return sendResponse(res, 200, null, 'Hotel deleted');
  } catch (error) { return next(error); }
}
