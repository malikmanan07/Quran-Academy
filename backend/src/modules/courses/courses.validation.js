import { z } from 'zod';

export const createCourseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  duration: z.string().optional(),
  level: z.string().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();
