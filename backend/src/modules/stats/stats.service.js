import db from '../../config/db.js';
import { users, courses, classes, payments, enrollmentRequests, trialRequests, attendance } from '../../db/schema/index.js';
import { eq, and, isNull, sql, desc, gte } from 'drizzle-orm';

export const getStats = async () => {
  const [{ studentCount }] = await db.select({ studentCount: sql`count(*)` })
    .from(users).where(and(eq(users.role, 'student'), isNull(users.deletedAt)));

  const [{ teacherCount }] = await db.select({ teacherCount: sql`count(*)` })
    .from(users).where(and(eq(users.role, 'teacher'), isNull(users.deletedAt)));

  const [{ courseCount }] = await db.select({ courseCount: sql`count(*)` }).from(courses);

  const [{ pendingApprovals }] = await db.select({ pendingApprovals: sql`count(*)` })
    .from(users).where(eq(users.status, 'pending'));

  const [{ pendingEnrollments }] = await db.select({ count: sql`count(*)` })
    .from(enrollmentRequests).where(eq(enrollmentRequests.status, 'pending'));

  const [{ pendingTrials }] = await db.select({ count: sql`count(*)` })
    .from(trialRequests).where(eq(trialRequests.status, 'pending'));

  const [{ pendingPayments }] = await db.select({ count: sql`count(*)` })
    .from(payments).where(sql`${payments.status} IN ('Unpaid', 'submitted')`);

  const [{ pendingPaymentsAmount }] = await db.select({ amount: sql`coalesce(sum(amount), 0)` })
    .from(payments).where(sql`${payments.status} IN ('Unpaid', 'submitted')`);

  const [{ totalRevenue }] = await db.select({ revenue: sql`coalesce(sum(amount), 0)` })
    .from(payments).where(eq(payments.status, 'verified'));

  // Monthly Revenue (Last 6 Months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const monthlyRevenue = await db.select({
    month: sql`to_char(paid_at, 'Mon')`,
    total: sql`coalesce(sum(amount), 0)`
  }).from(payments)
    .where(and(eq(payments.status, 'verified'), gte(payments.paidAt, sixMonthsAgo)))
    .groupBy(sql`to_char(paid_at, 'Mon')`, sql`extract(month from paid_at)`)
    .orderBy(sql`extract(month from paid_at)`);

  // Student Growth (Total over time)
  const studentGrowth = await db.select({
    month: sql`to_char(created_at, 'Mon')`,
    count: sql`count(*)`
  }).from(users)
    .where(and(eq(users.role, 'student'), gte(users.createdAt, sixMonthsAgo)))
    .groupBy(sql`to_char(created_at, 'Mon')`, sql`extract(month from created_at)`)
    .orderBy(sql`extract(month from created_at)`);

  // Attendance Stats
  const attendanceBreakdown = await db.select({
    status: attendance.status,
    count: sql`count(*)`
  }).from(attendance)
    .groupBy(attendance.status);

  const attendanceStats = {
    present: Number(attendanceBreakdown.find(a => a.status === 'present')?.count || 0),
    absent: Number(attendanceBreakdown.find(a => a.status === 'absent')?.count || 0),
    late: Number(attendanceBreakdown.find(a => a.status === 'late')?.count || 0),
  };

  const recentStudents = await db.select({
    id: users.id, name: users.name, email: users.email, createdAt: users.createdAt,
  }).from(users).where(and(eq(users.role, 'student'), isNull(users.deletedAt)))
    .orderBy(desc(users.createdAt)).limit(5);

  const recentPayments = await db.select({
    id: payments.id,
    amount: payments.amount,
    status: payments.status,
    month: payments.month,
    createdAt: payments.createdAt,
    studentName: users.name
  }).from(payments)
    .leftJoin(users, eq(payments.studentId, users.id))
    .orderBy(desc(payments.createdAt)).limit(5);

  const today = new Date().toISOString().split('T')[0];
  const todayClasses = await db.select().from(classes)
    .where(eq(classes.date, today));

  return {
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
    todayClasses,
  };
};
