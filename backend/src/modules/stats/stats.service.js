import db from '../../config/db.js';
import { users, courses, classes, payments } from '../../db/schema/index.js';
import { eq, and, isNull, sql, desc } from 'drizzle-orm';

export const getStats = async () => {
  const [{ studentCount }] = await db.select({ studentCount: sql`count(*)` })
    .from(users).where(and(eq(users.role, 'student'), isNull(users.deletedAt)));

  const [{ teacherCount }] = await db.select({ teacherCount: sql`count(*)` })
    .from(users).where(and(eq(users.role, 'teacher'), isNull(users.deletedAt)));

  const [{ courseCount }] = await db.select({ courseCount: sql`count(*)` }).from(courses);

  const [{ pendingApprovals }] = await db.select({ pendingApprovals: sql`count(*)` })
    .from(users).where(eq(users.status, 'pending'));

  const [{ revenue }] = await db.select({ revenue: sql`coalesce(sum(amount), 0)` })
    .from(payments).where(eq(payments.status, 'Paid'));

  const recentStudents = await db.select({
    id: users.id, name: users.name, email: users.email, createdAt: users.createdAt,
  }).from(users).where(and(eq(users.role, 'student'), isNull(users.deletedAt)))
    .orderBy(desc(users.createdAt)).limit(5);

  const recentPayments = await db.select().from(payments)
    .orderBy(desc(payments.createdAt)).limit(5);

  const today = new Date().toISOString().split('T')[0];
  const todayClasses = await db.select().from(classes)
    .where(eq(classes.date, today));

  return {
    totalStudents: Number(studentCount),
    totalTeachers: Number(teacherCount),
    totalCourses: Number(courseCount),
    pendingApprovals: Number(pendingApprovals),
    monthlyRevenue: Number(revenue),
    recentStudents,
    recentPayments,
    todayClasses,
  };
};
