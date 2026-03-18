import { pgTable, serial, integer, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { courses } from './courses.js';

export const courseCompletions = pgTable('course_completions', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  teacherId: integer('teacher_id').references(() => users.id).notNull(),
  completedAt: timestamp('completed_at').defaultNow(),
  notes: text('notes'),
  status: varchar('status', { length: 20 }).default('pending'), // pending/certified
}, (table) => ({
  studentIdx: index('comp_student_idx').on(table.studentId),
  courseIdx: index('comp_course_idx').on(table.courseId),
  teacherIdx: index('comp_teacher_idx').on(table.teacherId),
}));
