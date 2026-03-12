import bcrypt from 'bcryptjs';
import AppError from '../../utils/appError.js';
import * as repo from './students.repository.js';

export const getAll = async (filters) => {
  const { data, total } = await repo.findAll(filters);
  return { students: data, total };
};

export const getById = async (id) => {
  const student = await repo.findById(id);
  if (!student) throw new AppError('Student not found', 404);
  return student;
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
