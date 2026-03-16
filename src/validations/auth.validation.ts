import { z } from 'zod';
import { REGEX } from '../utils/common';

export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .length(10, 'Phone number must be 10 digits')
    .regex(REGEX.PHONE, 'Enter a valid Indian mobile number'),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(REGEX.OTP, 'OTP must contain only digits'),
});

export const completeProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const d = new Date(val);
      const now = new Date();
      if (isNaN(d.getTime())) return false;
      // Must be at least 13 years old
      const age = now.getFullYear() - d.getFullYear();
      return age >= 13 && age <= 120;
    }, 'Enter a valid date of birth'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),
});

export type PhoneFormValues          = z.infer<typeof phoneSchema>;
export type OtpFormValues            = z.infer<typeof otpSchema>;
export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
export type UpdateProfileFormValues  = z.infer<typeof updateProfileSchema>;

