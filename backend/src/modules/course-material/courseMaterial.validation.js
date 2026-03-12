import { z } from 'zod';

export const createMaterialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['PDF', 'Video', 'Audio', 'Link'], { required_error: 'Type is required' }),
  courseId: z.coerce.number().optional(),
  url: z.string().optional(),
  visibleToStudents: z.boolean().optional(),
});

export const updateMaterialSchema = createMaterialSchema.partial();
