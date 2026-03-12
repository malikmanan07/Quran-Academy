import db from '../../config/db.js';
import { progress } from '../../db/schema/index.js';
import { eq, and, desc, sql } from 'drizzle-orm';

export const findAll = async ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const data = await db.select().from(progress).orderBy(desc(progress.createdAt)).limit(limit).offset(offset);
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(progress);
  return { data, total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select().from(progress).where(eq(progress.id, id));
  return result[0] || null;
};

export const findByStudentId = async (studentId) =>
  db.select().from(progress).where(eq(progress.studentId, studentId)).orderBy(desc(progress.createdAt));

export const findByTeacherId = async (teacherId) =>
  db.select().from(progress).where(eq(progress.teacherId, teacherId)).orderBy(desc(progress.createdAt));

export const create = async (data) => {
  const result = await db.insert(progress).values(data).returning();
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(progress).set(data).where(eq(progress.id, id)).returning();
  return result[0];
};

export const remove = async (id) => db.delete(progress).where(eq(progress.id, id));
