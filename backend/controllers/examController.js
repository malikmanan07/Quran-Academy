import db from '../config/db.js';
import { exams, users, courses } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

// Get Exams By Student
export const getExamsByStudent = async (req, res) => {
  try {
    const result = await db.select({
      id: exams.id,
      title: exams.title,
      marks: exams.marks,
      totalMarks: exams.totalMarks,
      date: exams.date,
      courseName: courses.name,
      teacherName: users.name,
    })
    .from(exams)
    .leftJoin(users, eq(exams.teacherId, users.id))
    .leftJoin(courses, eq(exams.courseId, courses.id))
    .where(eq(exams.studentId, parseInt(req.params.id)));

    res.json({ success: true, exams: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Exam
export const addExam = async (req, res) => {
  try {
    const { studentId, teacherId, courseId, title, marks, totalMarks, date } = req.body;

    const newExam = await db.insert(exams).values({
      studentId, teacherId, courseId, title, marks, totalMarks, date
    }).returning();

    res.status(201).json({ success: true, exam: newExam[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Exam
export const updateExam = async (req, res) => {
  try {
    const { marks, totalMarks, title } = req.body;

    const updated = await db.update(exams)
      .set({ marks, totalMarks, title })
      .where(eq(exams.id, parseInt(req.params.id)))
      .returning();

    res.json({ success: true, exam: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Exam
export const deleteExam = async (req, res) => {
  try {
    await db.delete(exams).where(eq(exams.id, parseInt(req.params.id)));
    res.json({ success: true, message: 'Exam deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};