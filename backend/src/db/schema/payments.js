import { pgTable, serial, integer, varchar, date, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id),
  courseId: integer('course_id'),
  amount: integer('amount'),
  month: varchar('month', { length: 20 }),
  status: varchar('status', { length: 20 }).default('Unpaid'),
  dueDate: date('due_date'),
  paidAt: timestamp('paid_at'),
  receiptUrl: text('receipt_url'),
  createdAt: timestamp('created_at').defaultNow(),
});
