import { pgTable, serial, integer, varchar, text, timestamp, date } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const dailyProgress = pgTable('daily_progress', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  teacherId: integer('teacher_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  date: date('date').notNull(),
  sabaqSurah: varchar('sabaq_surah', { length: 255 }),
  sabaqAyatFrom: varchar('sabaq_ayat_from', { length: 50 }),
  sabaqAyatTo: varchar('sabaq_ayat_to', { length: 50 }),
  sabaqGrade: varchar('sabaq_grade', { length: 50 }),
  sabqiGrade: varchar('sabqi_grade', { length: 50 }),
  manzilGrade: varchar('manzil_grade', { length: 50 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
});
