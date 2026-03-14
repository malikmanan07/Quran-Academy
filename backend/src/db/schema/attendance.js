import { pgTable, serial, integer, varchar, text, date, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { classes } from './classes.js';

export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id),
  studentId: integer('student_id').references(() => users.id),
  teacherId: integer('teacher_id').references(() => users.id),
  status: varchar('status', { length: 20 }).default('present'),
  date: date('date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  studentIdx: index('att_student_idx').on(table.studentId),
  classIdx: index('att_class_idx').on(table.classId),
  dateIdx: index('att_date_idx').on(table.date),
}));
