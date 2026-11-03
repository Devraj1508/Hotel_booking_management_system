import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/ApiResponse.js';

export function getProfile(req, res) {
  return sendResponse(res, 200, { user: req.user });
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = {};
    if (typeof req.body.name === 'string') allowed.name = req.body.name;
    if (typeof req.body.avatar === 'string') allowed.avatar = req.body.avatar;
    if (!Object.keys(allowed).length) throw new ApiError(400, 'No profile fields were provided');
    const user = await User.findByIdAndUpdate(req.user._id, allowed, { new: true, runValidators: true });
    return sendResponse(res, 200, { user }, 'Profile updated');
  } catch (error) { return next(error); }
}
