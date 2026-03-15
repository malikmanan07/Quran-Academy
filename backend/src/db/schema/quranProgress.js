import { pgTable, serial, integer, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const quranProgress = pgTable('quran_progress', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  paraNumber: integer('para_number').notNull(),
  status: varchar('status', { length: 20 }).default('not-started'),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  studentIdIdx: index('quran_progress_student_idx')
    .on(table.studentId),
  paraIdx: index('quran_progress_para_idx').on(table.paraNumber),
}));
