import { ApiError } from '../utils/ApiError.js';

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  const status = error instanceof ApiError ? error.statusCode : error.name === 'ValidationError' ? 400 : 500;
  const body = { success: false, message: status === 500 ? 'Internal server error' : error.message };
  if (error.details) body.details = error.details;
  if (error.name === 'MongoServerError' && error.code === 11000) {
    body.message = 'A record with that unique value already exists';
    return res.status(409).json(body);
  }
  return res.status(status).json(body);
}
