import AppError from '../../utils/appError.js';
import * as repo from './certificates.repository.js';
import { sendNotification } from '../../services/socketService.js';

export const getCompletions = async () => repo.findCompletions();

export const generate = async (adminId, { studentId, courseId }) => {
  // Check if completion exists
  const completions = await repo.findCompletions();
  const completion = completions.find(c => c.studentId === studentId && c.courseId === courseId);
  
  if (!completion) {
    throw new AppError('No pending completion request found for this student and course', 404);
  }

  // Generate unique number QA-2025-XXXXX
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  const certNumber = `QA-${year}-${random}`;

  const certData = {
    studentId,
    courseId,
    studentName: completion.studentName,
    courseName: completion.courseName,
    teacherName: completion.teacherName,
    completionDate: completion.completedAt,
    certificateNumber: certNumber,
    generatedBy: adminId,
    status: 'active'
  };

  const certificate = await repo.createCertificate(certData);
  
  // Notify student
  sendNotification(studentId, `Congratulations! Your certificate for ${completion.courseName} has been generated. 🏆`, 'success');
  
  return certificate;
};

export const getMyCertificates = async (studentId) => repo.findByStudent(studentId);

export const getById = async (id) => {
  const cert = await repo.findById(id);
  if (!cert) throw new AppError('Certificate not found', 404);
  return cert;
};

export const getAllGenerated = async () => repo.findAllGenerated();
