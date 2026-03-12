import db from '../../config/db.js';
import { courses } from '../../db/schema/index.js';
import { eq, desc, sql, like } from 'drizzle-orm';

export const findAll = async ({ search, page = 1, limit = 20 } = {}) => {
  const conditions = [];
  if (search) conditions.push(like(courses.name, `%${search}%`));
  const where = conditions.length ? conditions[0] : undefined;
  const offset = (page - 1) * limit;

  const data = await db.select().from(courses).where(where)
    .orderBy(desc(courses.createdAt)).limit(limit).offset(offset);
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(courses).where(where);
  return { data, total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select().from(courses).where(eq(courses.id, id));
  return result[0] || null;
};

export const create = async (data) => {
  const result = await db.insert(courses).values(data).returning();
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(courses).set(data).where(eq(courses.id, id)).returning();
  return result[0];
};

export const remove = async (id) => db.delete(courses).where(eq(courses.id, id));
