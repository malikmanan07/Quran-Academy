import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './courseMaterial.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.query);
  sendSuccess(res, 'Materials fetched', { materials: result.materials }, { total: result.total });
});

export const getById = asyncHandler(async (req, res) => {
  const material = await service.getById(parseInt(req.params.id));
  sendSuccess(res, 'Material fetched', { material });
});

export const create = asyncHandler(async (req, res) => {
  const material = await service.create({ ...req.body, uploadedBy: req.user.id });
  sendCreated(res, 'Material created', { material });
});

export const update = asyncHandler(async (req, res) => {
  const material = await service.update(parseInt(req.params.id), req.body);
  sendSuccess(res, 'Material updated', { material });
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(parseInt(req.params.id));
  sendSuccess(res, 'Material deleted');
});

export const getMyMaterials = asyncHandler(async (req, res) => {
  const materials = await service.getVisibleToStudents();
  sendSuccess(res, 'Materials fetched', { materials });
});
