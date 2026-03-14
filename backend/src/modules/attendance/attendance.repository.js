import db from '../../config/db.js';
import { attendance, users, classes } from '../../db/schema/index.js';
import { eq, and, desc, sql, between } from 'drizzle-orm';

export const markAttendance = async (data) => {
  const [result] = await db.insert(attendance).values(data).returning();
  return result;
};

export const findByStudent = async (studentId) => {
  return db.select({
    id: attendance.id, classId: attendance.classId,
    status: attendance.status, date: attendance.date,
    notes: attendance.notes, createdAt: attendance.createdAt,
    teacherName: users.name,
  }).from(attendance)
    .leftJoin(users, eq(attendance.teacherId, users.id))
    .where(eq(attendance.studentId, studentId))
    .orderBy(desc(attendance.date));
};

export const findByClass = async (classId) => {
  return db.select({
    id: attendance.id, studentId: attendance.studentId,
    status: attendance.status, date: attendance.date,
    notes: attendance.notes, studentName: users.name,
  }).from(attendance)
    .leftJoin(users, eq(attendance.studentId, users.id))
    .where(eq(attendance.classId, classId))
    .orderBy(desc(attendance.date));
};

export const getStats = async (studentId) => {
  const records = await db.select({ status: attendance.status })
    .from(attendance).where(eq(attendance.studentId, studentId));
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  return { total, present, absent, late, percentage };
};
