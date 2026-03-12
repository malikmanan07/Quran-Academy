import AppError from '../../utils/appError.js';
import * as repo from './users.repository.js';

export const getPendingUsers = async () => {
  const { data } = await repo.findAll({ status: 'pending', limit: 1000 }); // all pending
  return data;
};

export const getAllUsers = async (filters) => {
  const { data, total } = await repo.findAll(filters);
  return { users: data, total };
};

export const approveUser = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return repo.updateStatus(id, 'active');
};

export const rejectUser = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return repo.updateStatus(id, 'rejected');
};
