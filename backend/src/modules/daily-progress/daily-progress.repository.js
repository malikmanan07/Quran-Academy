import db from '../../config/db.js';
import { dailyProgress } from '../../db/schema/index.js';
import { eq, and, desc } from 'drizzle-orm';
import { users } from '../../db/schema/index.js';

export const createDailyProgress = async (data) => {
  const [result] = await db.insert(dailyProgress).values(data).returning();
  return result;
};

export const getDailyProgressByStudent = async (studentId) => {
  return db
    .select({
      id: dailyProgress.id,
      studentId: dailyProgress.studentId,
      teacherId: dailyProgress.teacherId,
      date: dailyProgress.date,
      sabaqSurah: dailyProgress.sabaqSurah,
      sabaqAyatFrom: dailyProgress.sabaqAyatFrom,
      sabaqAyatTo: dailyProgress.sabaqAyatTo,
      sabaqGrade: dailyProgress.sabaqGrade,
      sabqiGrade: dailyProgress.sabqiGrade,
      manzilGrade: dailyProgress.manzilGrade,
      notes: dailyProgress.notes,
      createdAt: dailyProgress.createdAt,
      teacherName: users.name,
    })
    .from(dailyProgress)
    .leftJoin(users, eq(dailyProgress.teacherId, users.id))
    .where(eq(dailyProgress.studentId, studentId))
    .orderBy(desc(dailyProgress.date));
};

export const getDailyProgressById = async (id) => {
  const [result] = await db.select().from(dailyProgress).where(eq(dailyProgress.id, id));
  return result;
};

export const updateDailyProgress = async (id, data) => {
  const [result] = await db.update(dailyProgress).set(data).where(eq(dailyProgress.id, id)).returning();
  return result;
};

export const deleteDailyProgress = async (id) => {
  const [result] = await db.delete(dailyProgress).where(eq(dailyProgress.id, id)).returning();
  return result;
};
