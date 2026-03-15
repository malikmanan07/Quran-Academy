import db from '../../config/db.js';
import { users, classes, courses } from '../../db/schema/index.js';
import { eq, and, ilike, isNull, desc, sql, or } from 'drizzle-orm';
import { getPagination } from '../../utils/pagination.js';

const studentWhere = and(eq(users.role, 'student'), isNull(users.deletedAt));

export const findAll = async (queryParams = {}) => {
  const { search, status, teacherId } = queryParams;
  const { page, limit, offset } = getPagination(queryParams);
  const conditions = [studentWhere];
  if (search) {
    conditions.push(or(
      ilike(users.name, `%${search}%`),
      ilike(users.email, `%${search}%`)
    ));
  }
  if (status === 'active') conditions.push(eq(users.isActive, true));
  if (status === 'inactive') conditions.push(eq(users.isActive, false));

  // If teacherId is provided, only show students who have classes with this teacher
  const query = db.select({
    id: users.id, 
    name: users.name, 
    email: users.email, 
    phone: users.phone,
    isActive: users.isActive, 
    createdAt: users.createdAt, 
    status: users.status,
    courseName: sql`MAX(${courses.name})`, // Take one course name if multiple exist
    classCount: sql`count(${classes.id})::int`, // Count of classes for this student/teacher
  }).from(users);

  query.leftJoin(classes, eq(users.id, classes.studentId))
       .leftJoin(courses, eq(classes.courseId, courses.id));

  const finalConditions = [...conditions];
  if (teacherId) {
    finalConditions.push(eq(classes.teacherId, parseInt(teacherId)));
  }

  const where = and(...finalConditions);

  const data = await query.where(where)
    .groupBy(users.id, courses.id) // Grouping by both to avoid ambiguous SQL but practically we want per user
    // Actually, grouping just by users.id is enough if we use MAX/agg for other fields
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db.select({ count: sql`count(distinct ${users.id})` })
    .from(users)
    .leftJoin(classes, eq(users.id, classes.studentId))
    .where(where);

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
  const result = await db.insert(users).values({ ...data, role: 'student' }).returning();
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
