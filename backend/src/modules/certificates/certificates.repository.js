import db from '../../config/db.js';
import { certificates, users, courses } from '../../db/schema/index.js';
import { eq, and, desc } from 'drizzle-orm';

export const findByStudentId = async (studentId) =>
  db.select({
    id: certificates.id,
    studentId: certificates.studentId,
    courseId: certificates.courseId,
    url: certificates.url,
    generatedAt: certificates.generatedAt,
    courseName: courses.name,
    studentName: users.name,
  }).from(certificates)
    .leftJoin(users, eq(certificates.studentId, users.id))
    .leftJoin(courses, eq(certificates.courseId, courses.id))
    .where(eq(certificates.studentId, studentId))
    .orderBy(desc(certificates.generatedAt));

export const findByStudentAndCourse = async (studentId, courseId) => {
  const result = await db.select().from(certificates)
    .where(and(eq(certificates.studentId, studentId), eq(certificates.courseId, courseId)));
  return result[0] || null;
};

export const create = async (data) => {
  const result = await db.insert(certificates).values(data).returning();
  return result[0];
};
