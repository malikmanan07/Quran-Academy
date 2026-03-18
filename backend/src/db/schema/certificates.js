import { pgTable, serial, integer, text, timestamp, index, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { courses } from './courses.js';

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  studentName: varchar('student_name', { length: 100 }),
  courseName: varchar('course_name', { length: 100 }),
  teacherName: varchar('teacher_name', { length: 100 }),
  completionDate: timestamp('completion_date'),
  certificateNumber: varchar('certificate_number', { length: 50 }).unique(),
  url: text('url'),
  generatedBy: integer('generated_by').references(() => users.id),
  generatedAt: timestamp('generated_at').defaultNow(),
  status: varchar('status', { length: 20 }).default('active'),
}, (table) => {
  return {
    studentIdx: index('cert_student_idx').on(table.studentId),
    courseIdx: index('cert_course_idx').on(table.courseId),
    certNumberIdx: index('cert_number_idx').on(table.certificateNumber),
  };
});
