import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  location: { type: String, required: true, trim: true, maxlength: 160, index: true },
  address: { type: String, trim: true, maxlength: 240, default: '' },
  category: { type: String, trim: true, maxlength: 60, default: '' },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

hotelSchema.index({ name: 'text', location: 'text', category: 'text', description: 'text', amenities: 'text' });

export const Hotel = mongoose.model('Hotel', hotelSchema);
