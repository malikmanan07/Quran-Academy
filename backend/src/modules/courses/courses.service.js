import AppError from '../../utils/appError.js';
import * as repo from './courses.repository.js';

export const getAll = async (filters) => {
  const { data, total } = await repo.findAll(filters);
  return { courses: data, total };
};

export const getById = async (id) => {
  const course = await repo.findById(id);
  if (!course) throw new AppError('Course not found', 404);
  return course;
};

export const create = async (data) => repo.create(data);

export const update = async (id, data) => {
  await getById(id);
  return repo.update(id, data);
};

export const remove = async (id) => {
  await getById(id);
  return repo.remove(id);
};
