import db from '../../config/db.js';
import { certificates, courseCompletions, users, courses } from '../../db/schema/index.js';
import { eq, and, desc, isNull, sql } from 'drizzle-orm';

export const findCompletions = async () => {
  return db.select({
    id: courseCompletions.id,
    studentId: courseCompletions.studentId,
    courseId: courseCompletions.courseId,
    teacherId: courseCompletions.teacherId,
    notes: courseCompletions.notes,
    completedAt: courseCompletions.completedAt,
    studentName: users.name,
    courseName: courses.name,
    teacherName: sql`(SELECT name FROM users WHERE id = ${courseCompletions.teacherId})`
  })
  .from(courseCompletions)
  .innerJoin(users, eq(courseCompletions.studentId, users.id))
  .innerJoin(courses, eq(courseCompletions.courseId, courses.id))
  .where(eq(courseCompletions.status, 'pending'))
  .orderBy(desc(courseCompletions.completedAt));
};

export const createCertificate = async (data) => {
  return db.transaction(async (tx) => {
    const [result] = await tx.insert(certificates).values(data).returning();
    
    // Update completion status
    await tx.update(courseCompletions)
      .set({ status: 'certified' })
      .where(and(
        eq(courseCompletions.studentId, data.studentId),
        eq(courseCompletions.courseId, data.courseId)
      ));
      
    return result;
  });
};

export const findByStudent = async (studentId) => {
  return db.select().from(certificates).where(eq(certificates.studentId, studentId)).orderBy(desc(certificates.generatedAt));
};

export const findById = async (id) => {
  const [result] = await db.select().from(certificates).where(eq(certificates.id, id));
  return result;
};

export const findAllGenerated = async () => {
  return db.select().from(certificates).orderBy(desc(certificates.generatedAt));
};
