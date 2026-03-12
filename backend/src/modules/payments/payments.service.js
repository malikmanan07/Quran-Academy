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

export const updateStatus = async (id, status) => {
  await getById(id);
  return repo.updateStatus(id, status);
};
