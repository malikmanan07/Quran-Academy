import { z } from 'zod';

export const createMaterialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  type: z.enum(['pdf', 'video', 'audio', 'link', 'image', 'doc']),
  courseId: z.coerce.number().optional().nullable(),
  url: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
  visibleToStudents: z.coerce.boolean().default(true),
});

export const updateMaterialSchema = createMaterialSchema.partial();
