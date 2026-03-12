import { pgTable, serial, varchar, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';

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
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    emailIdx: index('email_idx').on(table.email),
    roleIdx: index('role_idx').on(table.role),
    statusIdx: index('status_idx').on(table.status),
  };
});
