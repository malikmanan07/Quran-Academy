import db from '../../config/db.js';
import { exams } from '../../db/schema/index.js';
import { eq, desc, sql } from 'drizzle-orm';

export const findAll = async ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const data = await db.select().from(exams).orderBy(desc(exams.createdAt)).limit(limit).offset(offset);
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(exams);
  return { data, total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select().from(exams).where(eq(exams.id, id));
  return result[0] || null;
};

export const findByStudentId = async (studentId) =>
  db.select().from(exams).where(eq(exams.studentId, studentId)).orderBy(desc(exams.date));

export const create = async (data) => {
  const result = await db.insert(exams).values(data).returning();
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(exams).set(data).where(eq(exams.id, id)).returning();
  return result[0];
};

export const remove = async (id) => db.delete(exams).where(eq(exams.id, id));
