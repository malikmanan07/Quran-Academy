import { z } from 'zod';

export const createProgressSchema = z.object({
  studentId: z.coerce.number().min(1, 'Student is required'),
  teacherId: z.coerce.number().optional(),
  lesson: z.string().min(1, 'Lesson title is required'),
  lessonCovered: z.string().optional(),
  tajweedNotes: z.string().optional(),
  homework: z.string().optional(),
  rating: z.coerce.number().min(1).max(5, 'Rating must be 1-5'),
  remarks: z.string().optional(),
});

export const updateProgressSchema = createProgressSchema.partial();
