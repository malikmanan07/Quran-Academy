import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const feedbackReports = pgTable('feedback_reports', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').references(() => users.id).notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  month: integer('month').notNull(),
  year: integer('year').notNull(),
  overallGrade: text('overall_grade').notNull().default('good'),
  sabaqProgress: text('sabaq_progress'),
  tajweedProgress: text('tajweed_progress'),
  behavior: text('behavior'),
  recommendations: text('recommendations'),
  createdAt: timestamp('created_at').defaultNow(),
});
