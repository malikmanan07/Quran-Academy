import db from '../config/db.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Get All Students
export const getAllStudents = async (req, res) => {
  try {
    const students = await db.select().from(users).where(eq(users.role, 'student'));
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Student
export const getStudent = async (req, res) => {
  try {
    const result = await db.select().from(users).where(eq(users.id, parseInt(req.params.id)));
    if (result.length === 0) {
      return res.status(404).json({ message: 'Student not found ❌' });
    }
    res.json({ success: true, student: result[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Student
export const addStudent = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const newStudent = await db.insert(users).values({
      name, email, password: hash, role: 'student', phone
    }).returning();

    res.status(201).json({ success: true, student: newStudent[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const updated = await db.update(users)
      .set({ name, email, phone })
      .where(eq(users.id, parseInt(req.params.id)))
      .returning();

    res.json({ success: true, student: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    await db.delete(users).where(eq(users.id, parseInt(req.params.id)));
    res.json({ success: true, message: 'Student deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};