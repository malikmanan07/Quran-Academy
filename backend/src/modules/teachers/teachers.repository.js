import db from '../../config/db.js';
import { users, classes, courses } from '../../db/schema/index.js';
import { eq, and, ilike, isNull, desc, sql, or } from 'drizzle-orm';

const teacherWhere = and(eq(users.role, 'teacher'), isNull(users.deletedAt));

export const findAll = async ({ search, status, page = 1, limit = 20 } = {}) => {
  const conditions = [teacherWhere];
  if (search) {
    conditions.push(or(
      ilike(users.name, `%${search}%`),
      ilike(users.email, `%${search}%`),
      ilike(users.specialization, `%${search}%`)
    ));
  }
  if (status === 'active') conditions.push(eq(users.isActive, true));
  if (status === 'inactive') conditions.push(eq(users.isActive, false));

  const offset = (page - 1) * limit;
  const where = and(...conditions);

  const data = await db.select({
    id: users.id, name: users.name, email: users.email, phone: users.phone,
    specialization: users.specialization, isActive: users.isActive, createdAt: users.createdAt
  }).from(users).where(where).orderBy(desc(users.createdAt)).limit(limit).offset(offset);

  const [{ count }] = await db.select({ count: sql`count(*)` }).from(users).where(where);
  return { data, total: Number(count) };
};

export const findById = async (id) => {
  const result = await db.select({
    id: users.id, name: users.name, email: users.email, phone: users.phone,
    isActive: users.isActive, createdAt: users.createdAt,
  }).from(users).where(and(eq(users.id, id), isNull(users.deletedAt)));
  return result[0] || null;
};

export const create = async (data) => {
  const result = await db.insert(users).values({ ...data, role: 'teacher' }).returning();
  const { password, ...safe } = result[0];
  return safe;
};

export const update = async (id, data) => {
  const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
  const { password, ...safe } = result[0];
  return safe;
};

export const softDelete = async (id) => {
  return db.update(users).set({ deletedAt: new Date(), isActive: false }).where(eq(users.id, id));
};

export const findMyStudents = async (teacherId) => {
  // Find students who have classes with this teacher
  const results = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      courseName: sql`MAX(${courses.name})`,
      classCount: sql`(SELECT count(*) FROM ${classes} WHERE ${classes.studentId} = ${users.id} AND ${classes.teacherId} = ${teacherId})::int`,
    })
    .from(users)
    .innerJoin(classes, eq(users.id, classes.studentId))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(eq(classes.teacherId, teacherId))
    .groupBy(users.id);
    
  return results;
};
