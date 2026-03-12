import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './progress.service.js';
import { parsePaginationParams, buildPaginatedResponse } from '../../utils/pagination.js';

export const getAll = asyncHandler(async (req, res) => {
  const { page, pageSize } = parsePaginationParams(req.query);
  const result = await service.getAll({ ...req.query, page, limit: pageSize });
  const { data, meta } = buildPaginatedResponse(result.progress, result.total, page, pageSize);
  sendSuccess(res, 'Progress fetched', { progress: data }, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const p = await service.getById(parseInt(req.params.id));
  sendSuccess(res, 'Progress fetched', { progress: p });
});

export const create = asyncHandler(async (req, res) => {
  const p = await service.create({ ...req.body, teacherId: req.user.id });
  sendCreated(res, 'Progress report created', { progress: p });
});

export const update = asyncHandler(async (req, res) => {
  const p = await service.update(parseInt(req.params.id), req.body);
  sendSuccess(res, 'Progress updated', { progress: p });
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(parseInt(req.params.id));
  sendSuccess(res, 'Progress deleted');
});

export const getMyProgress = asyncHandler(async (req, res) => {
  const data = await service.getByStudentId(req.user.id);
  sendSuccess(res, 'Progress fetched', { progress: data });
});
