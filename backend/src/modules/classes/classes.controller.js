import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './classes.service.js';
import { parsePaginationParams, buildPaginatedResponse } from '../../utils/pagination.js';

export const getAll = asyncHandler(async (req, res) => {
  const { page, pageSize } = parsePaginationParams(req.query);
  const result = await service.getAll({ ...req.query, page, limit: pageSize });
  const { data, meta } = buildPaginatedResponse(result.classes, result.total, page, pageSize);
  sendSuccess(res, 'Classes fetched', { classes: data }, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const cls = await service.getById(parseInt(req.params.id));
  sendSuccess(res, 'Class fetched', { class: cls });
});

export const create = asyncHandler(async (req, res) => {
  const cls = await service.create(req.body);
  sendCreated(res, 'Class created', { class: cls });
});

export const update = asyncHandler(async (req, res) => {
  const cls = await service.update(parseInt(req.params.id), req.body);
  sendSuccess(res, 'Class updated', { class: cls });
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(parseInt(req.params.id));
  sendSuccess(res, 'Class deleted');
});

export const updateStatus = asyncHandler(async (req, res) => {
  const cls = await service.updateStatus(parseInt(req.params.id), req.body.status);
  sendSuccess(res, 'Class status updated', { class: cls });
});

export const getByTeacher = asyncHandler(async (req, res) => {
  const data = await service.getByTeacherId(req.user.id);
  sendSuccess(res, 'Classes fetched', { classes: data });
});

export const getByStudent = asyncHandler(async (req, res) => {
  const data = await service.getByStudentId(req.user.id);
  sendSuccess(res, 'Classes fetched', { classes: data });
});
