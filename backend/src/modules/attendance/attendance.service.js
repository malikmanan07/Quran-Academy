import * as repo from './attendance.repository.js';

export const markAttendance = async (data) => repo.markAttendance(data);
export const getByStudent = async (studentId) => repo.findByStudent(studentId);
export const getByClass = async (classId) => repo.findByClass(classId);
export const getStats = async (studentId) => repo.getStats(studentId);
