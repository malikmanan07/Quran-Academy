import { pgTable, serial, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const parentStudent = pgTable('parent_student', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id').references(() => users.id).notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    parentIdx: index('ps_parent_idx').on(table.parentId),
    studentIdx: index('ps_student_idx').on(table.studentId),
  };
});
