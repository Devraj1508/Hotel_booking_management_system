import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true, index: true },
  checkOut: { type: Date, required: true, index: true },
  guests: { type: Number, required: true, min: 1 },
  nights: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed', index: true }
}, { timestamps: true });

bookingSchema.index({ room: 1, status: 1, checkIn: 1, checkOut: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
