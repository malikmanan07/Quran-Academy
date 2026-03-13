import { pgTable, serial, integer, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { courses } from './courses.js';

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  url: text('url'),
  generatedAt: timestamp('generated_at').defaultNow(),
}, (table) => {
  return {
    studentIdx: index('cert_student_idx').on(table.studentId),
    courseIdx: index('cert_course_idx').on(table.courseId),
  };
});
