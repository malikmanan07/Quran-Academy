import { pgTable, serial, integer, varchar, text, date, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { courses } from './courses.js';

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id),
  teacherId: integer('teacher_id').references(() => users.id),
  courseId: integer('course_id').references(() => courses.id),
  title: varchar('title', { length: 255 }),
  totalMarks: integer('total_marks'),
  obtainedMarks: integer('obtained_marks'),
  date: date('date'),
  duration: varchar('duration', { length: 50 }),
  status: varchar('status', { length: 30 }).default('upcoming'),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow(),
});
