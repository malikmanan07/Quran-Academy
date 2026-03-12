import { pgTable, serial, integer, text, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const progress = pgTable('progress', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id),
  teacherId: integer('teacher_id').references(() => users.id),
  lesson: varchar('lesson', { length: 255 }),
  lessonCovered: text('lesson_covered'),
  tajweedNotes: text('tajweed_notes'),
  homework: text('homework'),
  rating: integer('rating'),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    studentIdx: index('progress_student_idx').on(table.studentId),
    teacherIdx: index('progress_teacher_idx').on(table.teacherId),
  };
});
