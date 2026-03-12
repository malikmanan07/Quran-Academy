import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './courses.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.query);
  sendSuccess(res, 'Courses fetched', { courses: result.courses }, { total: result.total });
});

export const getById = asyncHandler(async (req, res) => {
  const course = await service.getById(parseInt(req.params.id));
  sendSuccess(res, 'Course fetched', { course });
});

export const create = asyncHandler(async (req, res) => {
  const course = await service.create(req.body);
  sendCreated(res, 'Course created', { course });
});

export const update = asyncHandler(async (req, res) => {
  const course = await service.update(parseInt(req.params.id), req.body);
  sendSuccess(res, 'Course updated', { course });
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(parseInt(req.params.id));
  sendSuccess(res, 'Course deleted');
});
