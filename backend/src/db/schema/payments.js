import { pgTable, serial, integer, varchar, date, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id),
  courseId: integer('course_id'),
  amount: integer('amount'),
  month: varchar('month', { length: 20 }),
  status: varchar('status', { length: 20 }).default('Unpaid'),
  paymentMethod: varchar('payment_method', { length: 30 }),
  transactionId: varchar('transaction_id', { length: 100 }),
  dueDate: date('due_date'),
  paidAt: timestamp('paid_at'),
  submittedAt: timestamp('submitted_at'),
  verifiedAt: timestamp('verified_at'),
  receiptUrl: text('receipt_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    studentIdx: index('payment_student_idx').on(table.studentId),
    statusIdx: index('payment_status_idx').on(table.status),
  };
});
