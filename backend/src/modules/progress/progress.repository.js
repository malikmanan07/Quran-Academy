import db from '../../config/db.js';
import { progress } from '../../db/schema/index.js';
import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';
import { users } from '../../db/schema/index.js';

export const findAll = async ({ search, page = 1, limit = 20 } = {}) => {
  const conditions = [];
  if (search) {
    conditions.push(or(
      ilike(progress.lesson, `%${search}%`),
      ilike(users.name, `%${search}%`)
    ));
  }
  const where = conditions.length ? and(...conditions) : undefined;
  const offset = (page - 1) * limit;
  
  const data = await db.select({
    id: progress.id,
    studentId: progress.studentId,
    teacherId: progress.teacherId,
    lesson: progress.lesson,
    lessonCovered: progress.lessonCovered,
    tajweedNotes: progress.tajweedNotes,
    homework: progress.homework,
    rating: progress.rating,
    remarks: progress.remarks,
    createdAt: progress.createdAt,
    studentName: users.name
  }).from(progress)
    .leftJoin(users, eq(progress.studentId, users.id))
    .where(where).orderBy(desc(progress.createdAt)).limit(limit).offset(offset);

  const [{ count }] = await db.select({ count: sql`count(*)` })
    .from(progress)
    .leftJoin(users, eq(progress.studentId, users.id))
    .where(where);

  return { data: data || [], total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select().from(progress).where(eq(progress.id, id));
  return result[0] || null;
};

export const findByStudentId = async (studentId) =>
  db.select({
    id: progress.id,
    studentId: progress.studentId,
    teacherId: progress.teacherId,
    lesson: progress.lesson,
    lessonCovered: progress.lessonCovered,
    tajweedNotes: progress.tajweedNotes,
    homework: progress.homework,
    rating: progress.rating,
    remarks: progress.remarks,
    createdAt: progress.createdAt,
    studentName: users.name
  }).from(progress)
    .leftJoin(users, eq(progress.studentId, users.id))
    .where(eq(progress.studentId, studentId)).orderBy(desc(progress.createdAt));

export const findByTeacherId = async (teacherId) =>
  db.select({
    id: progress.id,
    studentId: progress.studentId,
    teacherId: progress.teacherId,
    lesson: progress.lesson,
    lessonCovered: progress.lessonCovered,
    tajweedNotes: progress.tajweedNotes,
    homework: progress.homework,
    rating: progress.rating,
    remarks: progress.remarks,
    createdAt: progress.createdAt,
    studentName: users.name
  }).from(progress)
    .leftJoin(users, eq(progress.studentId, users.id))
    .where(eq(progress.teacherId, teacherId)).orderBy(desc(progress.createdAt));

export const create = async (data) => {
  const result = await db.insert(progress).values(data).returning();
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(progress).set(data).where(eq(progress.id, id)).returning();
  return result[0];
};

export const remove = async (id) => db.delete(progress).where(eq(progress.id, id));
