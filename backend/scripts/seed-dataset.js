import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from '../src/database/connectDB.js';
import { hotels } from '../data/hotels.js';
import { User } from '../src/models/User.model.js';
import { Hotel } from '../src/models/Hotel.model.js';
import { Room } from '../src/models/Room.model.js';

const roomTypeMap = {
  standard: 'single',
  premium: 'double',
  deluxe: 'double',
  executive: 'double',
  'ocean view': 'double',
  'sea view': 'double',
  'mountain view': 'double',
  'lake view': 'double',
  waterfront: 'double',
  family: 'family',
  suite: 'suite',
  presidential: 'suite',
  'royal suite': 'suite',
  'executive suite': 'suite',
  'luxury suite': 'suite',
  'luxury villa': 'suite'
};

async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  await connectDB();
  let owner;
  if (email && password) {
    if (password.length < 8) throw new Error('SEED_ADMIN_PASSWORD must be at least 8 characters.');
    owner = await User.findOneAndUpdate(
      { email },
      { $set: { name: 'Dataset Admin', password: await bcrypt.hash(password, 12), role: 'admin' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else {
    const ownerEmail = process.env.SEED_OWNER_EMAIL?.trim().toLowerCase();
    owner = await User.findOne(ownerEmail ? { email: ownerEmail } : {});
    if (!owner) throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD, or set SEED_OWNER_EMAIL to an existing user email.');
  }

  for (const data of hotels) {
    const hotel = await Hotel.findOneAndUpdate(
      { name: data.name, owner: owner._id },
      {
        $set: {
          description: data.description,
          location: `${data.city}, ${data.country}`,
          address: data.address,
          category: data.category,
          amenities: data.amenities,
          images: [data.image],
          rating: data.rating
        }
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    for (const [index, roomName] of data.roomTypes.entries()) {
      const type = roomTypeMap[roomName.toLowerCase()] || 'double';
      await Room.findOneAndUpdate(
        { hotel: hotel._id, name: roomName },
        { $set: { hotel: hotel._id, name: roomName, type, pricePerNight: Math.round(data.pricePerNight * (1 + index * 0.2)), capacity: type === 'family' ? 4 : type === 'suite' ? 3 : 2, quantity: Math.max(1, Math.ceil(data.availableRooms / data.roomTypes.length)), amenities: data.amenities, images: [data.image], active: true } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      );
    }
  }
  console.log(`Seeded ${hotels.length} hotels and their room types.`);
}

seed().catch((error) => {
  console.error(`Dataset seeding failed: ${error.message}`);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
