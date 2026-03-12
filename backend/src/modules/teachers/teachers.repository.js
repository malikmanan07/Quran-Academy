import db from '../../config/db.js';
import { users } from '../../db/schema/index.js';
import { eq, and, like, isNull, desc, sql } from 'drizzle-orm';

const teacherWhere = and(eq(users.role, 'teacher'), isNull(users.deletedAt));

export const findAll = async ({ search, status, page = 1, limit = 20 } = {}) => {
  const conditions = [teacherWhere];
  if (search) conditions.push(like(users.name, `%${search}%`));
  if (status === 'active') conditions.push(eq(users.isActive, true));
  if (status === 'inactive') conditions.push(eq(users.isActive, false));

  const offset = (page - 1) * limit;
  const data = await db.select({
    id: users.id, name: users.name, email: users.email, phone: users.phone,
    isActive: users.isActive, createdAt: users.createdAt,
  }).from(users).where(and(...conditions)).orderBy(desc(users.createdAt)).limit(limit).offset(offset);

  const [{ count }] = await db.select({ count: sql`count(*)` }).from(users).where(and(...conditions));
  return { data, total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select({
    id: users.id, name: users.name, email: users.email, phone: users.phone,
    isActive: users.isActive, createdAt: users.createdAt,
  }).from(users).where(and(eq(users.id, id), isNull(users.deletedAt)));
  return result[0] || null;
};

export const create = async (data) => {
  const result = await db.insert(users).values({ ...data, role: 'teacher' }).returning();
  const { password, ...safe } = result[0];
  return safe;
};

export const update = async (id, data) => {
  const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
  const { password, ...safe } = result[0];
  return safe;
};

export const softDelete = async (id) => {
  return db.update(users).set({ deletedAt: new Date(), isActive: false }).where(eq(users.id, id));
};
