import { pgTable, serial, varchar, text, timestamp, boolean, index, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  specialization: varchar('specialization', { length: 100 }),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true),
  status: varchar('status', { length: 20 }).default('pending'),
  lastLoginAt: timestamp('last_login_at'),
  deletedAt: timestamp('deleted_at'),
  courseCompleted: boolean('course_completed').default(false),
  courseCompletedAt: timestamp('course_completed_at'),
  courseCompletedBy: integer('course_completed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
  statusIdx: index('users_status_idx').on(table.status),
  createdAtIdx: index('users_created_at_idx').on(table.createdAt),
  roleStatusIdx: index('users_role_status_idx')
    .on(table.role, table.status),
}));
