import db from '../../config/db.js';
import { feedbackReports, users } from '../../db/schema/index.js';
import { eq, and, desc } from 'drizzle-orm';

export const create = async (data) => {
  const [result] = await db.insert(feedbackReports).values(data).returning();
  return result;
};

export const getByStudent = async (studentId) => {
  return db.select({
    id: feedbackReports.id, teacherId: feedbackReports.teacherId,
    studentId: feedbackReports.studentId, month: feedbackReports.month,
    year: feedbackReports.year, overallGrade: feedbackReports.overallGrade,
    sabaqProgress: feedbackReports.sabaqProgress, tajweedProgress: feedbackReports.tajweedProgress,
    behavior: feedbackReports.behavior, recommendations: feedbackReports.recommendations,
    createdAt: feedbackReports.createdAt, teacherName: users.name,
  }).from(feedbackReports)
    .leftJoin(users, eq(feedbackReports.teacherId, users.id))
    .where(eq(feedbackReports.studentId, studentId))
    .orderBy(desc(feedbackReports.createdAt));
};

export const getByTeacher = async (teacherId) => {
  return db.select({
    id: feedbackReports.id, teacherId: feedbackReports.teacherId,
    studentId: feedbackReports.studentId, month: feedbackReports.month,
    year: feedbackReports.year, overallGrade: feedbackReports.overallGrade,
    createdAt: feedbackReports.createdAt, studentName: users.name,
  }).from(feedbackReports)
    .leftJoin(users, eq(feedbackReports.studentId, users.id))
    .where(eq(feedbackReports.teacherId, teacherId))
    .orderBy(desc(feedbackReports.createdAt));
};
