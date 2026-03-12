import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './payments.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.query);
  sendSuccess(res, 'Payments fetched', { payments: result.payments }, { total: result.total });
});

export const getById = asyncHandler(async (req, res) => {
  const payment = await service.getById(parseInt(req.params.id));
  sendSuccess(res, 'Payment fetched', { payment });
});

export const create = asyncHandler(async (req, res) => {
  const payment = await service.create(req.body);
  sendCreated(res, 'Payment created', { payment });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const payment = await service.updateStatus(parseInt(req.params.id), req.body.status);
  sendSuccess(res, 'Payment status updated', { payment });
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await service.getByStudentId(req.user.id);
  sendSuccess(res, 'Payments fetched', { payments });
});
