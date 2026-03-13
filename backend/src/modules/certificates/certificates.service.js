import AppError from '../../utils/appError.js';
import * as repo from './certificates.repository.js';

export const getMyCertificates = async (studentId) =>
  repo.findByStudentId(studentId);

export const generate = async ({ studentId, courseId }) => {
  const existing = await repo.findByStudentAndCourse(studentId, courseId);
  if (existing) throw new AppError('Certificate already exists for this course', 409);
  return repo.create({ studentId, courseId });
};
