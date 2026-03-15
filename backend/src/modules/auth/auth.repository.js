import db from '../../config/db.js';
import { users } from '../../db/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';

export const findByEmail = async (email) => {
  const result = await db.select({
    id: users.id, name: users.name, email: users.email, password: users.password,
    phone: users.phone, role: users.role, status: users.status, avatar: users.avatar,
    specialization: users.specialization, isActive: users.isActive, createdAt: users.createdAt
  }).from(users).where(
    and(eq(users.email, email), isNull(users.deletedAt))
  );
  return result[0] || null;
};

export const findById = async (id) => {
  const result = await db.select({
    id: users.id, name: users.name, email: users.email, phone: users.phone,
    role: users.role, status: users.status, avatar: users.avatar,
    specialization: users.specialization, isActive: users.isActive, createdAt: users.createdAt
  }).from(users).where(eq(users.id, id));
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
