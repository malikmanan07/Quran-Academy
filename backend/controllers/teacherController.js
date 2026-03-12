import db from '../config/db.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Get All Teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await db.select().from(users).where(eq(users.role, 'teacher'));
    res.json({ success: true, teachers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Teacher
export const getTeacher = async (req, res) => {
  try {
    const result = await db.select().from(users).where(eq(users.id, parseInt(req.params.id)));
    if (result.length === 0) {
      return res.status(404).json({ message: 'Teacher not found ❌' });
    }
    res.json({ success: true, teacher: result[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Teacher
export const addTeacher = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const newTeacher = await db.insert(users).values({
      name, email, password: hash, role: 'teacher', phone
    }).returning();

    res.status(201).json({ success: true, teacher: newTeacher[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Teacher
export const updateTeacher = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const updated = await db.update(users)
      .set({ name, email, phone })
      .where(eq(users.id, parseInt(req.params.id)))
      .returning();

    res.json({ success: true, teacher: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    await db.delete(users).where(eq(users.id, parseInt(req.params.id)));
    res.json({ success: true, message: 'Teacher deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};