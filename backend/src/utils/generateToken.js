import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

export function createToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ userId: user._id.toString(), role: user.role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    jwtid: crypto.randomUUID()
  });
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
