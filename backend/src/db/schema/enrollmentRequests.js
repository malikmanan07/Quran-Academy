import { pgTable, serial, integer, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { courses } from './courses.js';

export const enrollmentRequests = pgTable('enrollment_requests', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  preferredTime: varchar('preferred_time', { length: 30 }),
  preferredDays: varchar('preferred_days', { length: 100 }),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('pending'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  studentIdIdx: index('enrollment_student_idx').on(table.studentId),
  courseIdIdx: index('enrollment_course_idx').on(table.courseId),
  statusIdx: index('enrollment_status_idx').on(table.status),
}));
