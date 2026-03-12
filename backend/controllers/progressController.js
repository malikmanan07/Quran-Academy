import db from '../config/db.js';
import { progress, users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

// Get Progress By Student
export const getProgressByStudent = async (req, res) => {
  try {
    const result = await db.select({
      id: progress.id,
      notes: progress.notes,
      lessonCovered: progress.lessonCovered,
      date: progress.date,
      teacherName: users.name,
    })
    .from(progress)
    .leftJoin(users, eq(progress.teacherId, users.id))
    .where(eq(progress.studentId, parseInt(req.params.id)));

    res.json({ success: true, progress: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Progress
export const addProgress = async (req, res) => {
  try {
    const { studentId, teacherId, classId, notes, lessonCovered, date } = req.body;

    const newProgress = await db.insert(progress).values({
      studentId, teacherId, classId, notes, lessonCovered, date
    }).returning();

    res.status(201).json({ success: true, progress: newProgress[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Progress
export const updateProgress = async (req, res) => {
  try {
    const { notes, lessonCovered } = req.body;

    const updated = await db.update(progress)
      .set({ notes, lessonCovered })
      .where(eq(progress.id, parseInt(req.params.id)))
      .returning();

    res.json({ success: true, progress: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Progress
export const deleteProgress = async (req, res) => {
  try {
    await db.delete(progress).where(eq(progress.id, parseInt(req.params.id)));
    res.json({ success: true, message: 'Progress deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};