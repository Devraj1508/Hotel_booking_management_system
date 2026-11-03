import { z } from 'zod';

export const hotelSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  location: z.string().trim().min(2).max(160),
  address: z.string().trim().max(240).optional(),
  category: z.string().trim().max(60).optional(),
  amenities: z.array(z.string().trim().min(1).max(60)).max(30).optional(),
  images: z.array(z.string().url()).max(20).optional()
});

export const roomSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional(),
  type: z.enum(['single', 'double', 'suite', 'family']),
  pricePerNight: z.number().positive(),
  capacity: z.number().int().positive().max(20),
  quantity: z.number().int().positive().max(100),
  amenities: z.array(z.string().trim().min(1).max(60)).max(30).optional(),
  images: z.array(z.string().url()).max(20).optional()
});
