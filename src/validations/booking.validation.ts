// Install: npm install zod
import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z
    .string()
    .min(1, 'Please select a service'),

  scheduledDate: z
    .string()
    .min(1, 'Please select a date')
    .refine((d) => new Date(d) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Date cannot be in the past',
    }),

  timeSlot: z
    .string()
    .min(1, 'Please select a time slot'),

  addressId: z
    .string()
    .min(1, 'Please select an address'),

  paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'WALLET'] as const),

  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
});

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),

  comment: z
    .string()
    .max(500, 'Comment must not exceed 500 characters')
    .optional(),

  tags: z.array(z.string()).max(5, 'Select up to 5 tags').optional(),
});

export const addressSchema = z.object({
  label:   z.string().trim().min(1, 'Label is required'),
  street:  z.string().trim().min(5, 'Street must be at least 5 characters'),
  city:    z.string().trim().min(2, 'City is required'),
  state:   z.string().trim().min(2, 'State is required'),
  pincode: z
    .string()
    .regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type ReviewFormValues  = z.infer<typeof reviewSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;

