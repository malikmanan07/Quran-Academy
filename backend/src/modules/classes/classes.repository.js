import db from '../../config/db.js';
import { classes, users, courses } from '../../db/schema/index.js';
import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

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

export const findAll = async ({ status, search, page = 1, limit = 20 } = {}) => {
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
  const offset = (page - 1) * limit;

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

  return { data, total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select(baseSelect).from(classes)
    .leftJoin(teacher, eq(classes.teacherId, teacher.id))
    .leftJoin(student, eq(classes.studentId, student.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(eq(classes.id, id));
  return result[0] || null;
};

export const findByTeacherId = async (teacherId) => {
  return db.select(baseSelect).from(classes)
    .leftJoin(teacher, eq(classes.teacherId, teacher.id))
    .leftJoin(student, eq(classes.studentId, student.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(eq(classes.teacherId, teacherId)).orderBy(desc(classes.date));
};

export const findByStudentId = async (studentId) => {
  return db.select(baseSelect).from(classes)
    .leftJoin(teacher, eq(classes.teacherId, teacher.id))
    .leftJoin(student, eq(classes.studentId, student.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(eq(classes.studentId, studentId)).orderBy(desc(classes.date));
};

export const create = async (data) => {
  const result = await db.insert(classes).values(data).returning();
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(classes).set(data).where(eq(classes.id, id)).returning();
  return result[0];
};

export const updateStatus = async (id, status) => {
  const result = await db.update(classes).set({ status }).where(eq(classes.id, id)).returning();
  return result[0];
};

export const remove = async (id) => db.delete(classes).where(eq(classes.id, id));