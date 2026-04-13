import { z } from 'zod';

// Login form schema
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration form schemas - broken by step for multi-step form

export const step1Schema = z.object({
  schoolName: z
    .string()
    .min(1, 'School name is required')
    .min(2, 'School name must be at least 2 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9-()+ ]+$/, 'Please enter a valid phone number'),
  address: z
    .string()
    .min(5, 'Address is required')
    .min(10, 'Address must be at least 10 characters'),
});

export type Step1Data = z.infer<typeof step1Schema>;

export const step2Schema = z.object({
  micName: z
    .string()
    .min(1, 'Master In Charge name is required')
    .min(2, 'Name must be at least 2 characters'),
  micContact: z
    .string()
    .min(10, 'Contact must be at least 10 digits')
    .regex(/^[0-9-()+ ]+$/, 'Please enter a valid phone number'),
  coordinatorName: z
    .string()
    .min(1, 'Coordinator name is required')
    .min(2, 'Name must be at least 2 characters'),
  coordinatorContact: z
    .string()
    .min(10, 'Contact must be at least 10 digits')
    .regex(/^[0-9-()+ ]+$/, 'Please enter a valid phone number'),
});

export type Step2Data = z.infer<typeof step2Schema>;

export const step3Schema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type Step3Data = z.infer<typeof step3Schema>;

// Full registration schema
export const registrationSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

export type RegistrationData = z.infer<typeof registrationSchema>;
