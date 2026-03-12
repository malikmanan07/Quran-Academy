import { pgTable, serial, varchar, timestamp, integer, text, time, date, boolean } from 'drizzle-orm/pg-core';

// USERS TABLE
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// COURSES TABLE
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// CLASSES TABLE
export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').references(() => users.id),
  studentId: integer('student_id').references(() => users.id),
  courseId: integer('course_id').references(() => courses.id),
  teacherTime: time('teacher_time'),
  studentTime: time('student_time'),
  classDate: date('class_date'),
  status: varchar('status', { length: 30 }).default('Regular'),
  meetingPlatform: varchar('meeting_platform', { length: 50 }),
  meetingLink: varchar('meeting_link', { length: 255 }),
  meetingId: varchar('meeting_id', { length: 100 }),
  meetingPassword: varchar('meeting_password', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// ATTENDANCE TABLE
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id),
  studentId: integer('student_id').references(() => users.id),
  status: varchar('status', { length: 20 }).default('Present'),
  date: date('date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// PROGRESS TABLE
export const progress = pgTable('progress', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id),
  teacherId: integer('teacher_id').references(() => users.id),
  classId: integer('class_id').references(() => classes.id),
  notes: text('notes'),
  lessonCovered: varchar('lesson_covered', { length: 255 }),
  date: date('date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// EXAMS TABLE
export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id),
  teacherId: integer('teacher_id').references(() => users.id),
  courseId: integer('course_id').references(() => courses.id),
  title: varchar('title', { length: 255 }),
  marks: integer('marks'),
  totalMarks: integer('total_marks'),
  date: date('date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// PAYMENTS TABLE
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id),
  amount: integer('amount'),
  month: varchar('month', { length: 20 }),
  status: varchar('status', { length: 20 }).default('Unpaid'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// COURSE MATERIAL TABLE
export const courseMaterial = pgTable('course_material', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  title: varchar('title', { length: 255 }),
  fileUrl: varchar('file_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});