import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './courses.service.js';
import { parsePaginationParams, buildPaginatedResponse } from '../../utils/pagination.js';

export const getAll = asyncHandler(async (req, res) => {
  const { page, pageSize } = parsePaginationParams(req.query);
  const result = await service.getAll({ ...req.query, page, limit: pageSize });
  const { data, meta } = buildPaginatedResponse(result.courses, result.total, page, pageSize);
  sendSuccess(res, 'Courses fetched', { courses: data }, meta);
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
