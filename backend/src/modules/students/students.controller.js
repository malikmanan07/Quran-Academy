import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './students.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.query);
  sendSuccess(res, 'Students fetched', { students: result.students }, { total: result.total });
});

export const getById = asyncHandler(async (req, res) => {
  const student = await service.getById(parseInt(req.params.id));
  sendSuccess(res, 'Student fetched', { student });
});

export const create = asyncHandler(async (req, res) => {
  const student = await service.create(req.body);
  sendCreated(res, 'Student created', { student });
});

export const update = asyncHandler(async (req, res) => {
  const student = await service.update(parseInt(req.params.id), req.body);
  sendSuccess(res, 'Student updated', { student });
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(parseInt(req.params.id));
  sendSuccess(res, 'Student deleted');
});
