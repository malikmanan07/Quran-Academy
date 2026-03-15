import db from '../../config/db.js';
import { courseMaterial } from '../../db/schema/index.js';
import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';

import { courses } from '../../db/schema/index.js';

export const findAll = async ({ courseId, type, search, page = 1, limit = 20, visibleOnly = false } = {}) => {
  const conditions = [];
  if (courseId) conditions.push(eq(courseMaterial.courseId, Number(courseId)));
  if (type) conditions.push(eq(courseMaterial.type, type));
  if (visibleOnly) conditions.push(eq(courseMaterial.visibleToStudents, true));
  if (search) {
    conditions.push(or(
      ilike(courseMaterial.title, `%${search}%`),
      ilike(courseMaterial.description, `%${search}%`)
    ));
  }
  const where = conditions.length ? and(...conditions) : undefined;
  const offset = (page - 1) * limit;

  const data = await db.select({
    id: courseMaterial.id,
    courseId: courseMaterial.courseId,
    uploadedBy: courseMaterial.uploadedBy,
    title: courseMaterial.title,
    description: courseMaterial.description,
    type: courseMaterial.type,
    url: courseMaterial.url,
    fileName: courseMaterial.fileName,
    visibleToStudents: courseMaterial.visibleToStudents,
    createdAt: courseMaterial.createdAt,
    courseName: courses.name
  })
    .from(courseMaterial)
    .leftJoin(courses, eq(courseMaterial.courseId, courses.id))
    .where(where)
    .orderBy(desc(courseMaterial.createdAt)).limit(limit).offset(offset);
    
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(courseMaterial).where(where);
  return { data, total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select({
    id: courseMaterial.id, courseId: courseMaterial.courseId,
    uploadedBy: courseMaterial.uploadedBy, title: courseMaterial.title,
    description: courseMaterial.description, type: courseMaterial.type,
    url: courseMaterial.url, fileName: courseMaterial.fileName,
    visibleToStudents: courseMaterial.visibleToStudents, createdAt: courseMaterial.createdAt
  }).from(courseMaterial).where(eq(courseMaterial.id, id));
  return result[0] || null;
};

export const findVisibleToStudents = async (params = {}) => findAll({ ...params, visibleOnly: true });

export const create = async (data) => {
  const result = await db.insert(courseMaterial).values(data).returning();
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(courseMaterial).set(data).where(eq(courseMaterial.id, id)).returning();
  return result[0];
};

export const remove = async (id) => db.delete(courseMaterial).where(eq(courseMaterial.id, id));
