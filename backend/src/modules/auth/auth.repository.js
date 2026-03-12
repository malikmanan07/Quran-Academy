import db from '../../config/db.js';
import { users } from '../../db/schema/index.js';
import { eq, isNull } from 'drizzle-orm';

export const findByEmail = async (email) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
};

export const findById = async (id) => {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] || null;
};

export const createUser = async (data) => {
  const result = await db.insert(users).values(data).returning();
  return result[0];
};

export const updateUser = async (id, data) => {
  const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return result[0];
};
