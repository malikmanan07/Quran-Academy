import { z } from 'zod';

export const createExamSchema = z.object({
  studentId: z.coerce.number().min(1, 'Student is required'),
  courseId: z.coerce.number().optional(),
  title: z.string().min(1, 'Title is required'),
  totalMarks: z.coerce.number().min(1, 'Total marks required'),
  obtainedMarks: z.coerce.number().optional(),
  date: z.string().min(1, 'Date is required'),
  duration: z.string().optional(),
  status: z.enum(['upcoming', 'completed']).optional(),
  remarks: z.string().optional(),
});

export const updateExamSchema = createExamSchema.partial();
