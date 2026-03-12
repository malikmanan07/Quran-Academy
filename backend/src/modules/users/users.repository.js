import db from '../../config/db.js';
import { users } from '../../db/schema/index.js';
import { eq, and, sql, desc, or, ilike, ne } from 'drizzle-orm';

export const findAll = async ({ search, status, role, page = 1, limit = 20 } = {}) => {
  const conditions = [ne(users.role, 'admin')]; // Exclude admins
  
  if (status) conditions.push(eq(users.status, status));
  if (role) conditions.push(eq(users.role, role));
  if (search) {
    conditions.push(
      or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`)
      )
    );
  }

  const offset = (page - 1) * limit;
  const where = and(...conditions);

  const data = await db.select({
    id: users.id, name: users.name, email: users.email, phone: users.phone,
    role: users.role, status: users.status, createdAt: users.createdAt, avatar: users.avatar
  }).from(users).where(where).orderBy(desc(users.createdAt)).limit(limit).offset(offset);

  const [{ count }] = await db.select({ count: sql`count(*)` }).from(users).where(where);

  return { data, total: Number(count) };
};

export const updateStatus = async (id, status) => {
  const result = await db.update(users).set({ status }).where(eq(users.id, id)).returning({
    id: users.id, name: users.name, email: users.email, status: users.status, role: users.role
  });
  return result[0];
};

export const findById = async (id) => {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] || null;
};
