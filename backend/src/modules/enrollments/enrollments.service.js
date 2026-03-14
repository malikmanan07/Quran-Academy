import AppError from '../../utils/appError.js';
import * as repo from './enrollments.repository.js';

export const createRequest = async (data) => repo.create(data);

export const getMyRequests = async (studentId) => repo.findByStudent(studentId);

export const getAllRequests = async () => repo.findAll();

export const getPendingCount = async () => repo.getPendingCount();

export const approve = async (id) => {
  const req = await repo.findById(id);
  if (!req) throw new AppError('Enrollment request not found', 404);
  if (req.status !== 'pending') throw new AppError('Request already processed', 400);
  return repo.updateStatus(id, 'approved');
};

export const reject = async (id, reason) => {
  const req = await repo.findById(id);
  if (!req) throw new AppError('Enrollment request not found', 404);
  if (req.status !== 'pending') throw new AppError('Request already processed', 400);
  return repo.updateStatus(id, 'rejected', reason);
};
