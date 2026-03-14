import { pgTable, serial, integer, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { courses } from './courses.js';
import { users } from './users.js';

export const courseMaterial = pgTable('course_material', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  type: varchar('type', { length: 20 }),
  url: text('url'),
  fileName: varchar('file_name', { length: 255 }),
  visibleToStudents: boolean('visible_to_students').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
