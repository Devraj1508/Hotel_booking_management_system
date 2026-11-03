import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { TokenBlacklist } from '../models/TokenBlacklist.model.js';
import { hashToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';

export async function requireAuth(req, _res, next) {
  try {
    const token = req.cookies[process.env.COOKIE_NAME || 'hotel_token'];
    if (!token) throw new ApiError(401, 'Authentication required');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const revoked = await TokenBlacklist.exists({ tokenHash: hashToken(token) });
    if (revoked) throw new ApiError(401, 'Authentication token has been revoked');
    const user = await User.findById(payload.userId).select('-password');
    if (!user) throw new ApiError(401, 'User account not found');
    req.user = user;
    req.authToken = token;
    req.authPayload = payload;
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(401, 'Invalid or expired authentication token'));
  }
}

export async function optionalAuth(req, _res, next) {
    const token = req.cookies[process.env.COOKIE_NAME || 'hotel_token'];
    if (!token) return next();

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const revoked = await TokenBlacklist.exists({ tokenHash: hashToken(token) });
      if (revoked) return next();
      const user = await User.findById(payload.userId).select('-password');
      if (user) {
        req.user = user;
        req.authToken = token;
        req.authPayload = payload;
      }
    } catch {
      // An invalid session is treated as anonymous; protected routes still use requireAuth.
    }
    return next();
}
