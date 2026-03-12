import bcrypt from 'bcryptjs';
import AppError from '../../utils/appError.js';
import * as repo from './teachers.repository.js';

export const getAll = async (filters) => {
  const { data, total } = await repo.findAll(filters);
  return { teachers: data, total };
};

export const getById = async (id) => {
  const teacher = await repo.findById(id);
  if (!teacher) throw new AppError('Teacher not found', 404);
  return teacher;
};

export const create = async (data) => {
  const hash = await bcrypt.hash(data.password, 10);
  return repo.create({ ...data, password: hash });
};

export const update = async (id, data) => {
  await getById(id);
  return repo.update(id, data);
};

export const remove = async (id) => {
  await getById(id);
  return repo.softDelete(id);
};
