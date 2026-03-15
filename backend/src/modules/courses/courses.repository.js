import db from '../../config/db.js';
import { courses } from '../../db/schema/index.js';
import { eq, desc, sql, ilike, or } from 'drizzle-orm';
import { cache } from '../../services/cache.js';

export const findAll = async ({ search, page = 1, limit = 20 } = {}) => {
  const cacheKey = `courses:all:${search || ''}:${page}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const conditions = [];
  if (search) {
    conditions.push(or(
      ilike(courses.name, `%${search}%`),
      ilike(courses.description, `%${search}%`)
    ));
  }
  const where = conditions.length ? or(...conditions) : undefined;
  const offset = (page - 1) * limit;

  const data = await db.select({
    id: courses.id, name: courses.name, description: courses.description,
    price: courses.price, duration: courses.duration, level: courses.level,
    isActive: courses.isActive, createdAt: courses.createdAt
  }).from(courses).where(where)
    .orderBy(desc(courses.createdAt)).limit(limit).offset(offset);
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(courses).where(where);
  const result = { data, total: Number(count) };
  cache.set(cacheKey, result, 3600);
  return result;
};

export const findById = async (id) => {
  const cacheKey = `courses:id:${id}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = await db.select({
    id: courses.id, name: courses.name, description: courses.description,
    price: courses.price, duration: courses.duration, level: courses.level,
    isActive: courses.isActive, createdAt: courses.createdAt
  }).from(courses).where(eq(courses.id, id));
  const course = result[0] || null;
  if (course) cache.set(cacheKey, course, 3600);
  return course;
};

export const create = async (data) => {
  const result = await db.insert(courses).values(data).returning();
  cache.delPattern('courses:');
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(courses).set(data).where(eq(courses.id, id)).returning();
  cache.delPattern('courses:');
  return result[0];
};

export const remove = async (id) => {
  const result = await db.delete(courses).where(eq(courses.id, id));
  cache.delPattern('courses:');
  return result;
};
