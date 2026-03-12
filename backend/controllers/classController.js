import db from '../config/db.js';
import { classes, users, courses } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

// Get Classes By Teacher + Date
export const getClassesByTeacher = async (req, res) => {
  try {
    const { date } = req.query;
    const result = await db.select({
      id: classes.id,
      teacherTime: classes.teacherTime,
      studentTime: classes.studentTime,
      classDate: classes.classDate,
      status: classes.status,
      meetingPlatform: classes.meetingPlatform,
      meetingLink: classes.meetingLink,
      meetingId: classes.meetingId,
      meetingPassword: classes.meetingPassword,
      studentName: users.name,
      courseName: courses.name,
    })
    .from(classes)
    .leftJoin(users, eq(classes.studentId, users.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(eq(classes.teacherId, parseInt(req.params.id)));

    res.json({ success: true, classes: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Classes By Student
export const getClassesByStudent = async (req, res) => {
  try {
    const result = await db.select({
      id: classes.id,
      teacherTime: classes.teacherTime,
      studentTime: classes.studentTime,
      classDate: classes.classDate,
      status: classes.status,
      meetingPlatform: classes.meetingPlatform,
      meetingLink: classes.meetingLink,
      teacherName: users.name,
      courseName: courses.name,
    })
    .from(classes)
    .leftJoin(users, eq(classes.teacherId, users.id))
    .leftJoin(courses, eq(classes.courseId, courses.id))
    .where(eq(classes.studentId, parseInt(req.params.id)));

    res.json({ success: true, classes: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Class
export const addClass = async (req, res) => {
  try {
    const { teacherId, studentId, courseId, teacherTime, 
            studentTime, classDate, meetingPlatform, 
            meetingLink, meetingId, meetingPassword } = req.body;

    const newClass = await db.insert(classes).values({
      teacherId, studentId, courseId, teacherTime,
      studentTime, classDate, meetingPlatform,
      meetingLink, meetingId, meetingPassword
    }).returning();

    res.status(201).json({ success: true, class: newClass[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Class Status
export const updateClassStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await db.update(classes)
      .set({ status })
      .where(eq(classes.id, parseInt(req.params.id)))
      .returning();
    res.json({ success: true, class: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Meeting Link (Teacher/Admin)
export const updateMeetingLink = async (req, res) => {
  try {
    const { meetingPlatform, meetingLink, meetingId, meetingPassword } = req.body;
    const updated = await db.update(classes)
      .set({ meetingPlatform, meetingLink, meetingId, meetingPassword })
      .where(eq(classes.id, parseInt(req.params.id)))
      .returning();
    res.json({ success: true, class: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Class
export const deleteClass = async (req, res) => {
  try {
    await db.delete(classes).where(eq(classes.id, parseInt(req.params.id)));
    res.json({ success: true, message: 'Class deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};