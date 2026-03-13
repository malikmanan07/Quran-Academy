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
  db.select().from(progress)
    .where(eq(progress.studentId, studentId))
    .orderBy(desc(progress.createdAt));

export const findChildPayments = async (studentId) =>
  db.select().from(payments)
    .where(eq(payments.studentId, studentId))
    .orderBy(desc(payments.createdAt));

export const findChildClasses = async (studentId) =>
  db.select().from(classes)
    .where(eq(classes.studentId, studentId))
    .orderBy(desc(classes.createdAt));

export const findChildAttendance = async (studentId) =>
  db.select().from(attendance)
    .where(eq(attendance.studentId, studentId));

export const linkParent = async (parentId, studentId) => {
  const result = await db.insert(parentStudent)
    .values({ parentId, studentId }).returning();
  return result[0];
};

export const findAllParents = async () =>
  db.select({
    id: users.id, name: users.name, email: users.email, phone: users.phone,
  }).from(users).where(eq(users.role, 'parent'));
