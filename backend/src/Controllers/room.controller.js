import { Room } from '../models/Room.model.js';
import { Hotel } from '../models/Hotel.model.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/ApiResponse.js';

export async function listRooms(req, res, next) {
  try {
    const filter = { active: true };
    if (req.query.hotel) filter.hotel = req.query.hotel;
    const rooms = await Room.find(filter).populate('hotel', 'name location').sort({ pricePerNight: 1 });
    return sendResponse(res, 200, { rooms });
  } catch (error) { return next(error); }
}

export async function createRoom(req, res, next) {
  try {
    if (!(await Hotel.exists({ _id: req.params.hotelId }))) throw new ApiError(404, 'Hotel not found');
    const room = await Room.create({ ...req.body, hotel: req.params.hotelId });
    return sendResponse(res, 201, { room }, 'Room created');
  } catch (error) { return next(error); }
}

export async function updateRoom(req, res, next) {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) throw new ApiError(404, 'Room not found');
    return sendResponse(res, 200, { room }, 'Room updated');
  } catch (error) { return next(error); }
}

export async function deleteRoom(req, res, next) {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!room) throw new ApiError(404, 'Room not found');
    return sendResponse(res, 200, null, 'Room removed');
  } catch (error) { return next(error); }
}
