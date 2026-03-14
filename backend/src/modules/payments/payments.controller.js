import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './payments.service.js';
import { sendNotification } from '../../services/socketService.js';
import { parsePaginationParams, buildPaginatedResponse } from '../../utils/pagination.js';

export const getAll = asyncHandler(async (req, res) => {
  const { page, pageSize } = parsePaginationParams(req.query);
  const result = await service.getAll({ ...req.query, page, limit: pageSize });
  const { data, meta } = buildPaginatedResponse(result.payments, result.total, page, pageSize);
  sendSuccess(res, 'Payments fetched', { payments: data }, meta);
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
  
  // Real-time notification
  sendNotification(payment.studentId, `Your payment of ${payment.amount} has been ${req.body.status}`, req.body.status === 'completed' ? 'success' : 'info');
  
  sendSuccess(res, 'Payment status updated', { payment });
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await service.getByStudentId(req.user.id);
  sendSuccess(res, 'Payments fetched', { payments });
});

export const studentSubmit = asyncHandler(async (req, res) => {
  const payment = await service.studentSubmit(req.user.id, req.body);
  sendSuccess(res, 'Payment proof submitted for verification', { payment });
});

export const parentSubmit = asyncHandler(async (req, res) => {
  const { studentId, ...data } = req.body;
  const payment = await service.studentSubmit(studentId, data);
  sendSuccess(res, 'Payment proof submitted on behalf of child', { payment });
});

export const getPendingVerification = asyncHandler(async (req, res) => {
  const payments = await service.getPendingVerification();
  sendSuccess(res, 'Pending verification payments fetched', { payments });
});

export const verify = asyncHandler(async (req, res) => {
  const payment = await service.verify(parseInt(req.params.id));
  sendNotification(payment.studentId, `Your payment for ${payment.month} has been verified!`, 'success');
  sendSuccess(res, 'Payment verified successfully', { payment });
});

export const reject = asyncHandler(async (req, res) => {
  const payment = await service.reject(parseInt(req.params.id), req.body.reason);
  sendNotification(payment.studentId, `Your payment for ${payment.month} was rejected. Reason: ${req.body.reason}`, 'error');
  sendSuccess(res, 'Payment rejected', { payment });
});
