import db from '../../config/db.js';
import { enrollmentRequests, users, courses } from '../../db/schema/index.js';
import { eq, desc, sql } from 'drizzle-orm';

export const create = async (data) => {
  const [result] = await db.insert(enrollmentRequests).values(data).returning();
  return result;
};

export const findByStudent = async (studentId) => {
  return db.select({
    id: enrollmentRequests.id, courseId: enrollmentRequests.courseId,
    preferredTime: enrollmentRequests.preferredTime,
    preferredDays: enrollmentRequests.preferredDays,
    message: enrollmentRequests.message, status: enrollmentRequests.status,
    rejectionReason: enrollmentRequests.rejectionReason,
    createdAt: enrollmentRequests.createdAt, courseName: courses.name,
  }).from(enrollmentRequests)
    .leftJoin(courses, eq(enrollmentRequests.courseId, courses.id))
    .where(eq(enrollmentRequests.studentId, studentId))
    .orderBy(desc(enrollmentRequests.createdAt));
};

export const findAll = async () => {
  return db.select({
    id: enrollmentRequests.id, studentId: enrollmentRequests.studentId,
    courseId: enrollmentRequests.courseId,
    preferredTime: enrollmentRequests.preferredTime,
    preferredDays: enrollmentRequests.preferredDays,
    message: enrollmentRequests.message, status: enrollmentRequests.status,
    createdAt: enrollmentRequests.createdAt,
    studentName: users.name, studentEmail: users.email, courseName: courses.name,
  }).from(enrollmentRequests)
    .leftJoin(users, eq(enrollmentRequests.studentId, users.id))
    .leftJoin(courses, eq(enrollmentRequests.courseId, courses.id))
    .orderBy(desc(enrollmentRequests.createdAt));
};

export const findById = async (id) => {
  const [result] = await db.select().from(enrollmentRequests).where(eq(enrollmentRequests.id, id));
  return result;
};

export const updateStatus = async (id, status, rejectionReason) => {
  const [result] = await db.update(enrollmentRequests)
    .set({ status, ...(rejectionReason && { rejectionReason }) })
    .where(eq(enrollmentRequests.id, id)).returning();
  return result;
};

export const getPendingCount = async () => {
  const [{ count }] = await db.select({ count: sql`count(*)` })
    .from(enrollmentRequests).where(eq(enrollmentRequests.status, 'pending'));
  return Number(count);
};
