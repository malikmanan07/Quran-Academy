import db from '../../config/db.js';
import { trialRequests, courses } from '../../db/schema/index.js';
import { eq, desc, sql } from 'drizzle-orm';

export const findAll = async ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  return db.select({
    id: trialRequests.id,
    fullName: trialRequests.fullName,
    email: trialRequests.email,
    phone: trialRequests.phone,
    country: trialRequests.country,
    timezone: trialRequests.timezone,
    courseId: trialRequests.courseId,
    preferredTime: trialRequests.preferredTime,
    message: trialRequests.message,
    status: trialRequests.status,
    createdAt: trialRequests.createdAt,
    courseName: courses.name,
  }).from(trialRequests)
    .leftJoin(courses, eq(trialRequests.courseId, courses.id))
    .orderBy(desc(trialRequests.createdAt))
    .limit(limit).offset(offset);
};

export const findById = async (id) => {
  const result = await db.select({
    id: trialRequests.id, fullName: trialRequests.fullName, email: trialRequests.email,
    phone: trialRequests.phone, country: trialRequests.country, timezone: trialRequests.timezone,
    courseId: trialRequests.courseId, preferredTime: trialRequests.preferredTime,
    message: trialRequests.message, status: trialRequests.status, createdAt: trialRequests.createdAt
  }).from(trialRequests).where(eq(trialRequests.id, id));
  return result[0] || null;
};

export const create = async (data) => {
  const result = await db.insert(trialRequests).values(data).returning();
  return result[0];
};

export const updateStatus = async (id, status) => {
  const result = await db.update(trialRequests)
    .set({ status }).where(eq(trialRequests.id, id)).returning();
  return result[0];
};

export const countPending = async () => {
  const [{ count }] = await db.select({ count: sql`count(*)` })
    .from(trialRequests).where(eq(trialRequests.status, 'pending'));
  return Number(count);
};
