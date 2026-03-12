import { z } from 'zod';

export const createPaymentSchema = z.object({
  studentId: z.coerce.number().min(1, 'Student is required'),
  courseId: z.coerce.number().optional(),
  amount: z.coerce.number().min(1, 'Amount is required'),
  month: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['Paid', 'Unpaid', 'Pending']).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['Paid', 'Unpaid', 'Pending', 'Refunded']),
});
