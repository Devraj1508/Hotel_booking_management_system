import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './Router/auth.routes.js';
import hotelRoutes from './Router/hotel.routes.js';
import roomRoutes from './Router/room.routes.js';
import bookingRoutes from './Router/booking.routes.js';
import reviewRoutes from './Router/review.routes.js';
import adminRoutes from './Router/admin.routes.js';
import userRoutes from './Router/user.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

export function createApp() {
  const app = express();
  const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = new Set(configuredOrigins);
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:5173');
    allowedOrigins.add('http://localhost:5174');
  }
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.get('/api/health', (_req, res) => res.json({ success: true, message: 'Hotel booking API is healthy' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/hotels', hotelRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/admin', adminRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
