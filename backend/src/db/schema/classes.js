import { pgTable, serial, integer, varchar, text, time, date, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { courses } from './courses.js';

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').references(() => users.id),
  studentId: integer('student_id').references(() => users.id),
  courseId: integer('course_id').references(() => courses.id),
  date: date('class_date'),
  time: time('class_time'),
  duration: varchar('duration', { length: 20 }),
  status: varchar('status', { length: 30 }).default('scheduled'),
  meetingLink: varchar('meeting_link', { length: 255 }),
  notes: text('notes'),
  cancellationReason: text('cancellation_reason'),
  createdAt: timestamp('created_at').defaultNow(),
});
