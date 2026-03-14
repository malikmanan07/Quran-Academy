import { pgTable, serial, varchar, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { courses } from './courses.js';

export const trialRequests = pgTable('trial_requests', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  country: varchar('country', { length: 60 }),
  timezone: varchar('timezone', { length: 60 }),
  courseId: integer('course_id').references(() => courses.id),
  preferredTime: varchar('preferred_time', { length: 30 }),
  preferredDays: text('preferred_days'),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    statusIdx: index('trial_status_idx').on(table.status),
    emailIdx: index('trial_email_idx').on(table.email),
  };
});
