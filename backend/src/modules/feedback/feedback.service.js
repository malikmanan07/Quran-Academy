import * as repo from './feedback.repository.js';
export const create = (data) => repo.create(data);
export const getByStudent = (studentId) => repo.getByStudent(studentId);
export const getByTeacher = (teacherId) => repo.getByTeacher(teacherId);
