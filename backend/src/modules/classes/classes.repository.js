import db from '../../config/db.js';
import { classes, users, courses } from '../../db/schema/index.js';
import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { cache } from '../../services/cache.js';
import { getPagination } from '../../utils/pagination.js';

const teacher = alias(users, 'teacher');
const student = alias(users, 'student');

const baseSelect = {
  id: classes.id, teacherId: classes.teacherId, studentId: classes.studentId,
  courseId: classes.courseId, date: classes.date, time: classes.time,
  duration: classes.duration, status: classes.status, meetingLink: classes.meetingLink,
  notes: classes.notes, createdAt: classes.createdAt,
  teacherName: teacher.name,
  studentName: student.name,
  courseName: courses.name
};

export const findAll = async (query = {}) => {
  const { status, search } = query;
  const { page, limit, offset } = getPagination(query);
  const cacheKey = `classes:all:${status || ''}:${search || ''}:${page}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const conditions = [];
  if (status) conditions.push(eq(classes.status, status));
  if (search) {
    conditions.push(or(
      ilike(student.name, `%${search}%`),
      ilike(teacher.name, `%${search}%`),
      ilike(courses.name, `%${search}%`)
    ));
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const data = await db.select(baseSelect).from(classes)
    .leftJoin(teacher, eq(classes.teacherId, teacher.id))
    .leftJoin(student, eq(classes.studentId, student.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(where).orderBy(desc(classes.date)).limit(limit).offset(offset);

  const [{ count }] = await db.select({ count: sql`count(*)` })
    .from(classes)
    .leftJoin(teacher, eq(classes.teacherId, teacher.id))
    .leftJoin(student, eq(classes.studentId, student.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(where);

  const result = { data, total: Number(count) };
  cache.set(cacheKey, result, 120);
  return result;
};

export const findById = async (id) => {
  const cacheKey = `classes:id:${id}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = await db.select(baseSelect).from(classes)
    .leftJoin(teacher, eq(classes.teacherId, teacher.id))
    .leftJoin(student, eq(classes.studentId, student.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(eq(classes.id, id));
  const cls = result[0] || null;
  if (cls) cache.set(cacheKey, cls, 120);
  return cls;
};

export const findByTeacherId = async (teacherId) => {
  const cacheKey = `classes:teacher:${teacherId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await db.selectDistinct(baseSelect).from(classes)
    .leftJoin(teacher, eq(classes.teacherId, teacher.id))
    .leftJoin(student, eq(classes.studentId, student.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(eq(classes.teacherId, teacherId)).orderBy(desc(classes.date));
  cache.set(cacheKey, data, 120);
  return data;
};

export const findByStudentId = async (studentId) => {
  const cacheKey = `classes:student:${studentId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await db.selectDistinct(baseSelect).from(classes)
    .leftJoin(teacher, eq(classes.teacherId, teacher.id))
    .leftJoin(student, eq(classes.studentId, student.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(eq(classes.studentId, studentId)).orderBy(desc(classes.date));
  cache.set(cacheKey, data, 120);
  return data;
};

export const create = async (data) => {
  const result = await db.insert(classes).values(data).returning();
  cache.delPattern('classes:');
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(classes).set(data).where(eq(classes.id, id)).returning();
  cache.delPattern('classes:');
  return result[0];
};

export const updateStatus = async (id, status) => {
  const result = await db.update(classes).set({ status }).where(eq(classes.id, id)).returning();
  cache.delPattern('classes:');
  return result[0];
};

export const remove = async (id) => {
  const result = await db.delete(classes).where(eq(classes.id, id));
  cache.delPattern('classes:');
  return result;
};