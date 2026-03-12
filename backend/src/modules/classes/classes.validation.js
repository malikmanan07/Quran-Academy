import { z } from 'zod';

export const createClassSchema = z.object({
  studentId: z.coerce.number().min(1, 'Student is required'),
  teacherId: z.coerce.number().min(1, 'Teacher is required'),
  courseId: z.coerce.number().min(1, 'Course is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().optional(),
  meetingLink: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
});

export const updateClassSchema = createClassSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled']),
});
