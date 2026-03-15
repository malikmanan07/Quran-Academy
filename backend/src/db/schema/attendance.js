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
  classIdIdx: index('attendance_class_id_idx').on(table.classId),
  studentIdIdx: index('attendance_student_id_idx').on(table.studentId),
  dateIdx: index('attendance_date_idx').on(table.date),
  studentDateIdx: index('attendance_student_date_idx')
    .on(table.studentId, table.date),
}));
