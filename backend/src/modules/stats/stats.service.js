import db from '../../config/db.js';
import { users, courses, classes, payments, enrollmentRequests, trialRequests, attendance } from '../../db/schema/index.js';
import { eq, and, isNull, sql, desc, gte } from 'drizzle-orm';
import { cache } from '../../services/cache.js';

export const getStats = async () => {
  const cached = cache.get('stats:dashboard');
  if (cached) return cached;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  const today = new Date().toISOString().split('T')[0];

  // Run ALL count/aggregate queries in parallel
  const [
    [{ studentCount }],
    [{ teacherCount }],
    [{ courseCount }],
    [{ pendingApprovals }],
    [{ pendingEnrollments }],
    [{ pendingTrials }],
    [{ pendingPayments }],
    [{ pendingPaymentsAmount }],
    [{ totalRevenue }],
    monthlyRevenue,
    studentGrowth,
    attendanceBreakdown,
    recentStudents,
    recentPayments,
    todayClasses,
  ] = await Promise.all([
    db.select({ studentCount: sql`count(*)` })
      .from(users).where(and(eq(users.role, 'student'), isNull(users.deletedAt))),
    db.select({ teacherCount: sql`count(*)` })
      .from(users).where(and(eq(users.role, 'teacher'), isNull(users.deletedAt))),
    db.select({ courseCount: sql`count(*)` }).from(courses),
    db.select({ pendingApprovals: sql`count(*)` })
      .from(users).where(eq(users.status, 'pending')),
    db.select({ count: sql`count(*)` })
      .from(enrollmentRequests).where(eq(enrollmentRequests.status, 'pending')),
    db.select({ count: sql`count(*)` })
      .from(trialRequests).where(eq(trialRequests.status, 'pending')),
    db.select({ count: sql`count(*)` })
      .from(payments).where(sql`${payments.status} IN ('Unpaid', 'submitted')`),
    db.select({ amount: sql`coalesce(sum(amount), 0)` })
      .from(payments).where(sql`${payments.status} IN ('Unpaid', 'submitted')`),
    db.select({ revenue: sql`coalesce(sum(amount), 0)` })
      .from(payments).where(eq(payments.status, 'verified')),
    db.select({
      month: sql`to_char(paid_at, 'Mon')`,
      total: sql`coalesce(sum(amount), 0)`
    }).from(payments)
      .where(and(eq(payments.status, 'verified'), gte(payments.paidAt, sixMonthsAgo)))
      .groupBy(sql`to_char(paid_at, 'Mon')`, sql`extract(month from paid_at)`)
      .orderBy(sql`extract(month from paid_at)`),
    db.select({
      month: sql`to_char(created_at, 'Mon')`,
      count: sql`count(*)`
    }).from(users)
      .where(and(eq(users.role, 'student'), gte(users.createdAt, sixMonthsAgo)))
      .groupBy(sql`to_char(created_at, 'Mon')`, sql`extract(month from created_at)`)
      .orderBy(sql`extract(month from created_at)`),
    db.select({ status: attendance.status, count: sql`count(*)` })
      .from(attendance).groupBy(attendance.status),
    db.select({
      id: users.id, name: users.name, email: users.email, createdAt: users.createdAt,
    }).from(users).where(and(eq(users.role, 'student'), isNull(users.deletedAt)))
      .orderBy(desc(users.createdAt)).limit(5),
    db.select({
      id: payments.id, amount: payments.amount, status: payments.status,
      month: payments.month, createdAt: payments.createdAt, studentName: users.name
    }).from(payments)
      .leftJoin(users, eq(payments.studentId, users.id))
      .orderBy(desc(payments.createdAt)).limit(5),
    db.select({ count: sql`count(*)` })
      .from(classes)
      .where(and(eq(classes.date, today), eq(classes.status, 'scheduled'))),
  ]);

  const attendanceStats = {
    present: Number(attendanceBreakdown.find(a => a.status === 'present')?.count || 0),
    absent: Number(attendanceBreakdown.find(a => a.status === 'absent')?.count || 0),
    late: Number(attendanceBreakdown.find(a => a.status === 'late')?.count || 0),
  };

  const result = {
    totalStudents: Number(studentCount),
    totalTeachers: Number(teacherCount),
    totalCourses: Number(courseCount),
    pendingApprovals: Number(pendingApprovals),
    pendingEnrollments: Number(pendingEnrollments?.count || 0),
    pendingTrials: Number(pendingTrials?.count || 0),
    pendingPayments: Number(pendingPayments?.count || 0),
    pendingPaymentsAmount: Number(pendingPaymentsAmount?.amount || 0),
    totalRevenue: Number(totalRevenue),
    monthlyRevenue,
    studentGrowth,
    attendanceStats,
    recentStudents,
    recentPayments,
    todayClasses: Number(todayClasses?.count || 0),
  };

  cache.set('stats:dashboard', result, 300);
  return result;
};
