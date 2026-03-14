import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './courseMaterial.service.js';
import { parsePaginationParams, buildPaginatedResponse } from '../../utils/pagination.js';

export const getAll = asyncHandler(async (req, res) => {
  const { page, pageSize } = parsePaginationParams(req.query);
  const result = await service.getAll({ ...req.query, page, limit: pageSize });
  const { data, meta } = buildPaginatedResponse(result.materials, result.total, page, pageSize);
  sendSuccess(res, 'Materials fetched', { materials: data }, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const material = await service.getById(parseInt(req.params.id));
  sendSuccess(res, 'Material fetched', { material });
});

export const create = asyncHandler(async (req, res) => {
  try {
    console.log('Creating Material. Body keys:', Object.keys(req.body));
    const material = await service.create({ ...req.body, uploadedBy: req.user.id });
    sendCreated(res, 'Material created', { material });
  } catch (error) {
    console.error('Create Material Error:', error);
    res.status(422).json({ success: false, message: error.message, errors: error.errors });
  }
});

export const update = asyncHandler(async (req, res) => {
  try {
    console.log('Updating Material ID:', req.params.id, 'Body keys:', Object.keys(req.body));
    const material = await service.update(parseInt(req.params.id), req.body);
    sendSuccess(res, 'Material updated', { material });
  } catch (error) {
    console.error('Update Material Error:', error);
    res.status(422).json({ success: false, message: error.message, errors: error.errors });
  }
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(parseInt(req.params.id));
  sendSuccess(res, 'Material deleted');
});

export const getMyMaterials = asyncHandler(async (req, res) => {
  const materials = await service.getVisibleToStudents();
  sendSuccess(res, 'Materials fetched', { materials });
});
