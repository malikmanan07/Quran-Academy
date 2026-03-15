import db from '../../config/db.js';
import { parentStudent, users, progress, payments, classes, attendance } from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';

export const findChildrenByParent = async (parentId) =>
  db.select({
    id: parentStudent.id,
    studentId: parentStudent.studentId,
    studentName: users.name,
    studentEmail: users.email,
    studentPhone: users.phone,
  }).from(parentStudent)
    .innerJoin(users, eq(parentStudent.studentId, users.id))
    .where(eq(parentStudent.parentId, parentId));

export const findChildProgress = async (studentId) =>
  db.select({
    id: progress.id, studentId: progress.studentId, teacherId: progress.teacherId,
    lesson: progress.lesson, rating: progress.rating, remarks: progress.remarks,
    createdAt: progress.createdAt
  }).from(progress)
    .where(eq(progress.studentId, studentId))
    .orderBy(desc(progress.createdAt));

export const findChildPayments = async (studentId) =>
  db.select({
    id: payments.id, studentId: payments.studentId, amount: payments.amount,
    month: payments.month, status: payments.status, dueDate: payments.dueDate,
    paidAt: payments.paidAt, createdAt: payments.createdAt
  }).from(payments)
    .where(eq(payments.studentId, studentId))
    .orderBy(desc(payments.createdAt));

export const findChildClasses = async (studentId) =>
  db.select({
    id: classes.id, teacherId: classes.teacherId, studentId: classes.studentId,
    date: classes.date, time: classes.time, status: classes.status,
    duration: classes.duration, createdAt: classes.createdAt
  }).from(classes)
    .where(eq(classes.studentId, studentId))
    .orderBy(desc(classes.createdAt));

export const findChildAttendance = async (studentId) =>
  db.select({
    id: attendance.id, classId: attendance.classId,
    studentId: attendance.studentId, status: attendance.status,
    date: attendance.date, notes: attendance.notes
  }).from(attendance)
    .where(eq(attendance.studentId, studentId));

export const linkParent = async (parentId, studentId) => {
  const result = await db.insert(parentStudent)
    .values({ parentId, studentId }).returning();
  return result[0];
};

export const findAllParents = async ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  return db.select({
    id: users.id, name: users.name, email: users.email, phone: users.phone,
  }).from(users).where(eq(users.role, 'parent'))
    .limit(limit).offset(offset);
};
