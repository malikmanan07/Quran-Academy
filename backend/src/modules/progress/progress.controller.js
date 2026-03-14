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
  try {
    const allowedFields = ['studentId', 'lesson', 'lessonCovered', 'tajweedNotes', 'homework', 'rating', 'remarks'];
    const data = { teacherId: parseInt(req.user.id) };
    allowedFields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
    
    data.studentId = parseInt(data.studentId);
    data.rating = parseInt(data.rating);

    console.log('Creating Progress Report:', data);
    const p = await service.create(data);
    sendCreated(res, 'Progress report created', { progress: p });
  } catch (err) {
    console.error('Create Progress error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export const update = asyncHandler(async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const allowedFields = ['studentId', 'lesson', 'lessonCovered', 'tajweedNotes', 'homework', 'rating', 'remarks'];
    const data = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });

    if (data.studentId) data.studentId = parseInt(data.studentId);
    if (data.rating) data.rating = parseInt(data.rating);

    console.log('Updating Progress Report ID:', id, 'Data:', data);
    const p = await service.update(id, data);
    sendSuccess(res, 'Progress updated', { progress: p });
  } catch (err) {
    console.error('Update Progress error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export const remove = asyncHandler(async (req, res) => {
  try {
    await service.remove(parseInt(req.params.id));
    sendSuccess(res, 'Progress deleted');
  } catch (err) {
    console.error('Delete Progress error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export const getMyProgress = asyncHandler(async (req, res) => {
  const data = await service.getByStudentId(req.user.id);
  sendSuccess(res, 'Progress fetched', { progress: data });
});
