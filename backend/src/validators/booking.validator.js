import { z } from 'zod';

const date = z.coerce.date();
export const bookingSchema = z.object({
  roomId: z.string().length(24),
  checkIn: date,
  checkOut: date,
  guests: z.coerce.number().int().positive().max(20)
}).superRefine((value, context) => {
  if (value.checkOut <= value.checkIn) context.addIssue({ code: z.ZodIssueCode.custom, path: ['checkOut'], message: 'Check-out must be after check-in' });
});

export const reviewSchema = z.object({
  bookingId: z.string().length(24),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(1000)
});
