import AppError from '../../utils/appError.js';
import * as repo from './progress.repository.js';

export const getAll = async (filters) => {
  const { data, total } = await repo.findAll(filters);
  return { progress: data, total };
};

export const getById = async (id) => {
  const p = await repo.findById(id);
  if (!p) throw new AppError('Progress report not found', 404);
  return p;
};

export const getByStudentId = async (studentId) => repo.findByStudentId(studentId);
export const getByTeacherId = async (teacherId) => repo.findByTeacherId(teacherId);
export const create = async (data) => repo.create(data);

export const update = async (id, data) => {
  await getById(id);
  return repo.update(id, data);
};

export const remove = async (id) => {
  await getById(id);
  return repo.remove(id);
};
