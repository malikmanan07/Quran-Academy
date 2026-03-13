import AppError from '../../utils/appError.js';
import * as repo from './parent.repository.js';

export const getMyChildren = async (parentId) =>
  repo.findChildrenByParent(parentId);

export const getChildProgress = async (parentId, studentId) => {
  const children = await repo.findChildrenByParent(parentId);
  if (!children.find(c => c.studentId === studentId))
    throw new AppError('Not your child', 403);
  return repo.findChildProgress(studentId);
};

export const getChildPayments = async (parentId, studentId) => {
  const children = await repo.findChildrenByParent(parentId);
  if (!children.find(c => c.studentId === studentId))
    throw new AppError('Not your child', 403);
  return repo.findChildPayments(studentId);
};

export const getChildClasses = async (parentId, studentId) => {
  const children = await repo.findChildrenByParent(parentId);
  if (!children.find(c => c.studentId === studentId))
    throw new AppError('Not your child', 403);
  return repo.findChildClasses(studentId);
};

export const getChildAttendance = async (parentId, studentId) => {
  const children = await repo.findChildrenByParent(parentId);
  if (!children.find(c => c.studentId === studentId))
    throw new AppError('Not your child', 403);
  return repo.findChildAttendance(studentId);
};

export const linkParent = async (parentId, studentId) =>
  repo.linkParent(parentId, studentId);

export const getAllParents = async () => repo.findAllParents();
