import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './teachers.service.js';
import { parsePaginationParams, buildPaginatedResponse } from '../../utils/pagination.js';

export const getAll = asyncHandler(async (req, res) => {
  const { page, pageSize } = parsePaginationParams(req.query);
  const result = await service.getAll({ ...req.query, page, limit: pageSize });
  const { data, meta } = buildPaginatedResponse(result.teachers, result.total, page, pageSize);
  sendSuccess(res, 'Teachers fetched', { teachers: data }, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const teacher = await service.getById(parseInt(req.params.id));
  sendSuccess(res, 'Teacher fetched', { teacher });
});

export const create = asyncHandler(async (req, res) => {
  const teacher = await service.create(req.body);
  sendCreated(res, 'Teacher created', { teacher });
});

export const update = asyncHandler(async (req, res) => {
  const teacher = await service.update(parseInt(req.params.id), req.body);
  sendSuccess(res, 'Teacher updated', { teacher });
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(parseInt(req.params.id));
  sendSuccess(res, 'Teacher deleted');
});
