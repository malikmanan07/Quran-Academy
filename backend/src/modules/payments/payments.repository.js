import db from '../../config/db.js';
import { payments } from '../../db/schema/index.js';
import { eq, and, desc, sql } from 'drizzle-orm';

export const findAll = async ({ status, page = 1, limit = 20 } = {}) => {
  const conditions = [];
  if (status) conditions.push(eq(payments.status, status));
  const where = conditions.length ? and(...conditions) : undefined;
  const offset = (page - 1) * limit;

  const data = await db.select().from(payments).where(where)
    .orderBy(desc(payments.createdAt)).limit(limit).offset(offset);
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(payments).where(where);
  return { data, total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select().from(payments).where(eq(payments.id, id));
  return result[0] || null;
};

export const findByStudentId = async (studentId) => {
  return db.select().from(payments).where(eq(payments.studentId, studentId))
    .orderBy(desc(payments.createdAt));
};

export const create = async (data) => {
  const result = await db.insert(payments).values(data).returning();
  return result[0];
};

export const updateStatus = async (id, status) => {
  const update = { status };
  if (status === 'Paid') update.paidAt = new Date();
  const result = await db.update(payments).set(update).where(eq(payments.id, id)).returning();
  return result[0];
};

export const remove = async (id) => db.delete(payments).where(eq(payments.id, id));
