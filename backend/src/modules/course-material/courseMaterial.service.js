import AppError from '../../utils/appError.js';
import * as repo from './courseMaterial.repository.js';

export const getAll = async (filters) => {
  const { data, total } = await repo.findAll(filters);
  return { materials: data, total };
};

export const getById = async (id) => {
  const m = await repo.findById(id);
  if (!m) throw new AppError('Material not found', 404);
  return m;
};

export const getVisibleToStudents = async (params) => {
  const { data, total } = await repo.findVisibleToStudents(params);
  return { materials: data, total };
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
