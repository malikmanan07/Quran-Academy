import db from '../config/db.js';
import { courses } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

// Get All Courses
export const getAllCourses = async (req, res) => {
  try {
    const result = await db.select().from(courses);
    res.json({ success: true, courses: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Course
export const addCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCourse = await db.insert(courses).values({ name, description }).returning();
    res.status(201).json({ success: true, course: newCourse[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Course
export const updateCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updated = await db.update(courses)
      .set({ name, description })
      .where(eq(courses.id, parseInt(req.params.id)))
      .returning();
    res.json({ success: true, course: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    await db.delete(courses).where(eq(courses.id, parseInt(req.params.id)));
    res.json({ success: true, message: 'Course deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};