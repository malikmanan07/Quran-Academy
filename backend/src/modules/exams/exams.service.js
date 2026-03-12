import AppError from '../../utils/appError.js';
import * as repo from './exams.repository.js';

export const getAll = async (filters) => {
  const { data, total } = await repo.findAll(filters);
  return { exams: data, total };
};

export const getById = async (id) => {
  const exam = await repo.findById(id);
  if (!exam) throw new AppError('Exam not found', 404);
  return exam;
};

export const getByStudentId = async (studentId) => repo.findByStudentId(studentId);
export const create = async (data) => repo.create(data);

export const update = async (id, data) => {
  await getById(id);
  return repo.update(id, data);
};

export const remove = async (id) => {
  await getById(id);
  return repo.remove(id);
};
