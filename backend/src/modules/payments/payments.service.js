import AppError from '../../utils/appError.js';
import * as repo from './payments.repository.js';

export const getAll = async (filters) => {
  const { data, total } = await repo.findAll(filters);
  return { payments: data, total };
};

export const getById = async (id) => {
  const payment = await repo.findById(id);
  if (!payment) throw new AppError('Payment not found', 404);
  return payment;
};

export const getByStudentId = async (studentId) => repo.findByStudentId(studentId);

export const create = async (data) => repo.create(data);

export const updateStatus = async (id, status, extra = {}) => {
  await getById(id);
  return repo.updateStatus(id, status, extra);
};

export const studentSubmit = async (studentId, data) => {
  const { month } = data;
  let payment = await repo.findByStudentAndMonth(studentId, month);
  
  if (!payment) {
    // If no existing payment record for this month, create one as submitted
    // Usually admin generates these, but we allow student to initiate if missing
    return repo.create({ ...data, studentId, status: 'submitted', submittedAt: new Date() });
  }

  return repo.submitPayment(payment.id, data);
};

export const getPendingVerification = async () => repo.findPendingVerification();

export const verify = async (id) => {
  return repo.updateStatus(id, 'verified');
};

export const reject = async (id, reason) => {
  return repo.updateStatus(id, 'rejected', { notes: reason });
};
