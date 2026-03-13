import db from '../../config/db.js';
import { quranProgress } from '../../db/schema/index.js';
import { eq, and } from 'drizzle-orm';

export const findByStudentId = async (studentId) =>
  db.select().from(quranProgress)
    .where(eq(quranProgress.studentId, studentId))
    .orderBy(quranProgress.paraNumber);

export const upsertPara = async (studentId, paraNumber, status) => {
  const existing = await db.select().from(quranProgress)
    .where(and(
      eq(quranProgress.studentId, studentId),
      eq(quranProgress.paraNumber, paraNumber)
    ));

  if (existing.length > 0) {
    const result = await db.update(quranProgress)
      .set({ status, updatedAt: new Date() })
      .where(eq(quranProgress.id, existing[0].id))
      .returning();
    return result[0];
  }
  const result = await db.insert(quranProgress)
    .values({ studentId, paraNumber, status }).returning();
  return result[0];
};

export const initStudent = async (studentId) => {
  const existing = await findByStudentId(studentId);
  if (existing.length > 0) return existing;
  const rows = Array.from({ length: 30 }, (_, i) => ({
    studentId, paraNumber: i + 1, status: 'not-started',
  }));
  return db.insert(quranProgress).values(rows).returning();
};
