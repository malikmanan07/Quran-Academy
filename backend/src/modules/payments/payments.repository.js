import db from '../../config/db.js';
import { payments } from '../../db/schema/index.js';
import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';
import { users, courses } from '../../db/schema/index.js';

export const findAll = async ({ status, search, page = 1, limit = 20 } = {}) => {
  const conditions = [];
  if (status) conditions.push(eq(payments.status, status));
  if (search) {
    conditions.push(or(
      ilike(users.name, `%${search}%`),
      ilike(courses.name, `%${search}%`)
    ));
  }
  const where = conditions.length ? and(...conditions) : undefined;
  const offset = (page - 1) * limit;

  const data = await db.select({
    id: payments.id, studentId: payments.studentId, studentName: users.name,
    courseName: courses.name, amount: payments.amount, status: payments.status,
    month: payments.month,
    dueDate: payments.dueDate, paidAt: payments.paidAt, createdAt: payments.createdAt
  }).from(payments)
    .leftJoin(users, eq(payments.studentId, users.id))
    .leftJoin(courses, eq(payments.courseId, courses.id))
    .where(where).orderBy(desc(payments.createdAt)).limit(limit).offset(offset);

  const [{ count }] = await db.select({ count: sql`count(*)` })
    .from(payments)
    .leftJoin(users, eq(payments.studentId, users.id))
    .leftJoin(courses, eq(payments.courseId, courses.id))
    .where(where);

  return { data, total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select().from(payments).where(eq(payments.id, id));
  return result[0] || null;
};

export const findByStudentId = async (studentId) => {
  return db.select({
    id: payments.id, studentId: payments.studentId, studentName: users.name,
    courseId: payments.courseId, courseName: courses.name, amount: payments.amount, 
    month: payments.month,
    status: payments.status, dueDate: payments.dueDate, paidAt: payments.paidAt, 
    createdAt: payments.createdAt
  }).from(payments)
    .leftJoin(users, eq(payments.studentId, users.id))
    .leftJoin(courses, eq(payments.courseId, courses.id))
    .where(eq(payments.studentId, studentId))
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
