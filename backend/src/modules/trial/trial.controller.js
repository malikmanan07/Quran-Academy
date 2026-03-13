import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './trial.service.js';

export const book = asyncHandler(async (req, res) => {
  const trial = await service.book(req.body);
  sendCreated(res, 'Trial class booked successfully', { trial });
});

export const getAll = asyncHandler(async (req, res) => {
  const trials = await service.getAll();
  const pendingCount = await service.getPendingCount();
  sendSuccess(res, 'Trial requests fetched', { trials, pendingCount });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const trial = await service.updateStatus(parseInt(req.params.id), req.body.status);
  sendSuccess(res, `Trial ${req.body.status}`, { trial });
});

export const convert = asyncHandler(async (req, res) => {
  const trial = await service.getById(parseInt(req.params.id));
  await service.updateStatus(trial.id, 'approved');
  sendSuccess(res, 'Trial converted to student', { trial });
});
