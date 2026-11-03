import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from '../src/database/connectDB.js';
import { Hotel } from '../src/models/Hotel.model.js';
import { Room } from '../src/models/Room.model.js';
import { User } from '../src/models/User.model.js';

const hotels = [
  {
    name: 'The Harbor Grand',
    description: 'A refined waterfront hotel with panoramic harbor views, thoughtful service, and easy access to the city promenade.',
    location: 'Mumbai, Maharashtra',
    address: 'Apollo Bunder, Colaba, Mumbai 400001',
    amenities: ['Free Wi-Fi', 'Infinity pool', 'Rooftop restaurant', 'Spa', 'Fitness center', 'Airport shuttle', '24-hour front desk', 'Room service', 'Business center'],
    rating: 4.8,
    reviewCount: 126,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    rooms: [
      { name: 'Sea View Deluxe', type: 'double', description: 'A bright king room with a private balcony overlooking the harbor.', pricePerNight: 15400, capacity: 2, quantity: 8, amenities: ['King bed', 'Balcony', 'Harbor view', 'Breakfast included'] },
      { name: 'Harbor Grand Suite', type: 'suite', description: 'Spacious suite with a separate living room and premium bath.', pricePerNight: 26600, capacity: 4, quantity: 3, amenities: ['King bed', 'Living room', 'Bathtub', 'Butler service', 'Breakfast included'] }
    ]
  },
  {
    name: 'Misty Pines Retreat',
    description: 'A peaceful mountain retreat surrounded by pine forests, offering warm hospitality and scenic trails near the property.',
    location: 'Manali, Himachal Pradesh',
    address: 'Log Huts Road, Old Manali, Himachal Pradesh 175131',
    amenities: ['Free Wi-Fi', 'Mountain views', 'Bonfire area', 'Restaurant', 'Indoor games', 'Bicycle rental', 'Parking', 'Heating', 'Laundry service'],
    rating: 4.6,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    rooms: [
      { name: 'Pine View Double', type: 'double', description: 'Comfortable room with a private sitting area and forest views.', pricePerNight: 9130, capacity: 2, quantity: 10, amenities: ['Queen bed', 'Forest view', 'Heating', 'Tea maker'] },
      { name: 'Family Chalet', type: 'family', description: 'A two-bedroom chalet designed for families and small groups.', pricePerNight: 17400, capacity: 5, quantity: 4, amenities: ['Two bedrooms', 'Fireplace', 'Kitchenette', 'Private deck'] }
    ]
  },
  {
    name: 'Saffron Courtyard Palace',
    description: 'A heritage stay in a restored palace courtyard, combining traditional architecture with modern comforts in the Pink City.',
    location: 'Jaipur, Rajasthan',
    address: 'Gangapole, Jaipur, Rajasthan 302002',
    amenities: ['Free Wi-Fi', 'Courtyard garden', 'Heritage restaurant', 'Outdoor pool', 'Cultural performances', 'Tour desk', 'Parking', 'Yoga classes', 'Concierge'],
    rating: 4.9,
    reviewCount: 211,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    rooms: [
      { name: 'Heritage Courtyard Room', type: 'double', description: 'A restored room with handcrafted details and courtyard access.', pricePerNight: 12000, capacity: 2, quantity: 7, amenities: ['Queen bed', 'Courtyard access', 'Breakfast included', 'Rain shower'] },
      { name: 'Royal Palace Suite', type: 'suite', description: 'An elegant suite with a private terrace and palace-inspired interiors.', pricePerNight: 23700, capacity: 3, quantity: 4, amenities: ['King bed', 'Private terrace', 'Living room', 'Complimentary minibar'] }
    ]
  },
  {
    name: 'Backwater Breeze Resort',
    description: 'A relaxed lakeside resort with private cottages, local cuisine, and tranquil backwater experiences for couples and families.',
    location: 'Alappuzha, Kerala',
    address: 'Punnamada Road, Alappuzha, Kerala 688006',
    amenities: ['Free Wi-Fi', 'Lake access', 'Ayurvedic spa', 'Swimming pool', 'Houseboat tours', 'Restaurant', 'Kids club', 'Parking', 'Fishing activities'],
    rating: 4.7,
    reviewCount: 158,
    image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1200&q=80',
    rooms: [
      { name: 'Garden Cottage', type: 'double', description: 'A private cottage surrounded by tropical gardens, ideal for two guests.', pricePerNight: 10800, capacity: 2, quantity: 12, amenities: ['King bed', 'Garden patio', 'Outdoor shower', 'Breakfast included'] },
      { name: 'Lakefront Family Villa', type: 'family', description: 'A spacious villa with direct water views and a shaded veranda.', pricePerNight: 20800, capacity: 6, quantity: 5, amenities: ['Two bedrooms', 'Lake view', 'Veranda', 'Mini fridge', 'Breakfast included'] }
    ]
  },
  {
    name: 'Metro 21 Business Hotel',
    description: 'A modern city hotel built for productive stays, with fast connectivity and convenient access to offices, shopping, and transit.',
    location: 'Bengaluru, Karnataka',
    address: 'Outer Ring Road, Marathahalli, Bengaluru 560037',
    amenities: ['High-speed Wi-Fi', 'Co-working lounge', 'Meeting rooms', 'All-day cafe', 'Fitness center', 'Airport transfer', 'Laundry service', 'Parking', '24-hour reception'],
    rating: 4.4,
    reviewCount: 83,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    rooms: [
      { name: 'Smart Business Single', type: 'single', description: 'A compact, quiet room with an ergonomic work desk.', pricePerNight: 7050, capacity: 1, quantity: 15, amenities: ['Single bed', 'Work desk', 'Fast Wi-Fi', 'Coffee machine'] },
      { name: 'Executive King', type: 'double', description: 'A spacious work-friendly room with access to the executive lounge.', pricePerNight: 11600, capacity: 2, quantity: 10, amenities: ['King bed', 'Work desk', 'Lounge access', 'Breakfast included'] }
    ]
  }
];

async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be configured before seeding.');
  }
  if (password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 8 characters long.');
  }

  await connectDB();
  const passwordHash = await bcrypt.hash(password, 12);
  const owner = await User.findOneAndUpdate(
    { email },
    { $set: { name: 'StayWell Demo Admin', password: passwordHash, role: 'admin' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  let roomCount = 0;
  for (const hotelData of hotels) {
    const { rooms, image, ...hotelFields } = hotelData;
    const hotel = await Hotel.findOneAndUpdate(
      { name: hotelFields.name, owner: owner._id },
      { $set: { ...hotelFields, images: [image] } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    for (const room of rooms) {
      await Room.findOneAndUpdate(
        { hotel: hotel._id, name: room.name },
        { $set: { ...room, hotel: hotel._id, active: true } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      );
      roomCount += 1;
    }
  }

  console.log(`Seeded ${hotels.length} hotels and ${roomCount} room types for ${email}.`);
}

seed()
  .catch((error) => {
    console.error(`Seeding failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
