import { pgTable, serial, integer, varchar, text, time, date, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { courses } from './courses.js';

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').references(() => users.id),
  studentId: integer('student_id').references(() => users.id),
  courseId: integer('course_id').references(() => courses.id),
  date: date('class_date'),
  time: time('class_time'),
  duration: varchar('duration', { length: 20 }),
  status: varchar('status', { length: 30 }).default('scheduled'),
  meetingLink: varchar('meeting_link', { length: 255 }),
  meetingPlatform: varchar('meeting_platform', { length: 30 }).default('other'),
  meetingId: varchar('meeting_id', { length: 100 }),
  scheduledBy: integer('scheduled_by').references(() => users.id),
  notes: text('notes'),
  cancellationReason: text('cancellation_reason'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  teacherIdIdx: index('classes_teacher_id_idx').on(table.teacherId),
  studentIdIdx: index('classes_student_id_idx').on(table.studentId),
  courseIdIdx: index('classes_course_id_idx').on(table.courseId),
  statusIdx: index('classes_status_idx').on(table.status),
  classTimeIdx: index('classes_time_idx').on(table.time),
  teacherStatusIdx: index('classes_teacher_status_idx')
    .on(table.teacherId, table.status),
  studentStatusIdx: index('classes_student_status_idx')
    .on(table.studentId, table.status),
  dateIdx: index('classes_date_idx').on(table.date),
}));
