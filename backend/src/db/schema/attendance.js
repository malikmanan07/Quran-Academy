import { pgTable, serial, integer, varchar, date, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { classes } from './classes.js';

export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id),
  studentId: integer('student_id').references(() => users.id),
  status: varchar('status', { length: 20 }).default('Present'),
  date: date('date'),
  createdAt: timestamp('created_at').defaultNow(),
});
