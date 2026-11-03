import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { TokenBlacklist } from '../models/TokenBlacklist.model.js';
import { ApiError } from '../utils/ApiError.js';
import { createToken, hashToken } from '../utils/generateToken.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { comparePassword, hashPassword } from '../services/auth.service.js';

const cookieName = () => process.env.COOKIE_NAME || 'hotel_token';
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/'
});

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (await User.exists({ email })) throw new ApiError(409, 'An account with that email already exists');
    const user = await User.create({ name, email, password: await hashPassword(password) });
    const token = createToken(user);
    res.cookie(cookieName(), token, cookieOptions());
    return sendResponse(res, 201, { user: publicUser(user) }, 'Account created');
  } catch (error) { return next(error); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await comparePassword(password, user.password))) throw new ApiError(401, 'Invalid email or password');
    const token = createToken(user);
    res.cookie(cookieName(), token, cookieOptions());
    return sendResponse(res, 200, { user: publicUser(user) }, 'Logged in');
  } catch (error) { return next(error); }
}

export function me(req, res) {
  return sendResponse(res, 200, { user: req.user ? publicUser(req.user) : null });
}

export async function logout(req, res, next) {
  try {
    const decoded = jwt.decode(req.authToken);
    if (decoded?.exp) await TokenBlacklist.create({ tokenHash: hashToken(req.authToken), expiresAt: new Date(decoded.exp * 1000) });
    res.clearCookie(cookieName(), { ...cookieOptions(), maxAge: undefined });
    return sendResponse(res, 200, null, 'Logged out');
  } catch (error) { return next(error); }
}
