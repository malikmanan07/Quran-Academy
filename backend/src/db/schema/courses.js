import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  price: integer('price'),
  duration: varchar('duration', { length: 50 }),
  level: varchar('level', { length: 30 }),
  isActive: timestamp('is_active').default(null),
  createdAt: timestamp('created_at').defaultNow(),
});
