import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  type: { type: String, enum: ['single', 'double', 'suite', 'family'], required: true },
  pricePerNight: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1, max: 20 },
  quantity: { type: Number, required: true, min: 1, max: 100, default: 1 },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] },
  active: { type: Boolean, default: true }
}, { timestamps: true });

roomSchema.index({ hotel: 1, active: 1 });

export const Room = mongoose.model('Room', roomSchema);
