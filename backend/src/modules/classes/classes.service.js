import AppError from '../../utils/appError.js';
import * as repo from './classes.repository.js';

export const getAll = async (filters) => {
  const { data, total } = await repo.findAll(filters);
  return { classes: data, total };
};

export const getById = async (id) => {
  const cls = await repo.findById(id);
  if (!cls) throw new AppError('Class not found', 404);
  return cls;
};

export const getByTeacherId = async (teacherId) => repo.findByTeacherId(teacherId);
export const getByStudentId = async (studentId) => repo.findByStudentId(studentId);

export const create = async (data) => repo.create(data);

export const update = async (id, data) => {
  await getById(id);
  return repo.update(id, data);
};

export const updateStatus = async (id, status) => {
  await getById(id);
  return repo.updateStatus(id, status);
};

export const remove = async (id) => {
  await getById(id);
  return repo.remove(id);
};
