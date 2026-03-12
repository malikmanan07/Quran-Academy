import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './exams.service.js';
import { parsePaginationParams, buildPaginatedResponse } from '../../utils/pagination.js';

export const getAll = asyncHandler(async (req, res) => {
  const { page, pageSize } = parsePaginationParams(req.query);
  const result = await service.getAll({ ...req.query, page, limit: pageSize });
  const { data, meta } = buildPaginatedResponse(result.exams, result.total, page, pageSize);
  sendSuccess(res, 'Exams fetched', { exams: data }, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const exam = await service.getById(parseInt(req.params.id));
  sendSuccess(res, 'Exam fetched', { exam });
});

export const create = asyncHandler(async (req, res) => {
  const exam = await service.create({ ...req.body, teacherId: req.user.id });
  sendCreated(res, 'Exam created', { exam });
});

export const update = asyncHandler(async (req, res) => {
  const exam = await service.update(parseInt(req.params.id), req.body);
  sendSuccess(res, 'Exam updated', { exam });
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(parseInt(req.params.id));
  sendSuccess(res, 'Exam deleted');
});

export const getMyExams = asyncHandler(async (req, res) => {
  const data = await service.getByStudentId(req.user.id);
  sendSuccess(res, 'Exams fetched', { exams: data });
});
