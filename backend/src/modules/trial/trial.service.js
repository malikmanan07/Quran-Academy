import AppError from '../../utils/appError.js';
import * as repo from './trial.repository.js';

export const getAll = async () => repo.findAll();

export const book = async (data) => repo.create(data);

export const updateStatus = async (id, status) => {
  const trial = await repo.findById(id);
  if (!trial) throw new AppError('Trial request not found', 404);
  if (!['approved', 'rejected'].includes(status))
    throw new AppError('Invalid status', 400);
  return repo.updateStatus(id, status);
};

export const getById = async (id) => {
  const trial = await repo.findById(id);
  if (!trial) throw new AppError('Trial request not found', 404);
  return trial;
};

export const getPendingCount = async () => repo.countPending();
