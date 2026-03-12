import { z } from 'zod';

export const createTeacherSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  specialization: z.string().optional(),
});

export const updateTeacherSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  isActive: z.boolean().optional(),
});
