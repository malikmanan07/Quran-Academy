import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './enrollments.service.js';
import { sendNotification } from '../../services/socketService.js';

export const createRequest = asyncHandler(async (req, res) => {
  const data = { ...req.body, studentId: req.user.id };
  const request = await service.createRequest(data);
  sendCreated(res, 'Enrollment request submitted', { request });
});

export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await service.getMyRequests(req.user.id);
  sendSuccess(res, 'Requests fetched', { requests });
});

export const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await service.getAllRequests();
  const pendingCount = await service.getPendingCount();
  sendSuccess(res, 'All requests fetched', { requests, pendingCount });
});

export const approve = asyncHandler(async (req, res) => {
  const result = await service.approve(parseInt(req.params.id));
  sendNotification(result.studentId, 'Your enrollment request has been approved! 🎉', 'success');
  sendSuccess(res, 'Enrollment approved', { request: result });
});

export const reject = asyncHandler(async (req, res) => {
  const result = await service.reject(parseInt(req.params.id), req.body.reason);
  sendNotification(result.studentId, 'Your enrollment request was rejected', 'warning');
  sendSuccess(res, 'Enrollment rejected', { request: result });
});
