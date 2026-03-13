import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './parent.service.js';

export const getMyChildren = asyncHandler(async (req, res) => {
  const data = await service.getMyChildren(req.user.id);
  sendSuccess(res, 'Children fetched', { children: data });
});

export const getChildProgress = asyncHandler(async (req, res) => {
  const data = await service.getChildProgress(req.user.id, parseInt(req.params.id));
  sendSuccess(res, 'Progress fetched', { progress: data });
});

export const getChildAttendance = asyncHandler(async (req, res) => {
  const data = await service.getChildAttendance(req.user.id, parseInt(req.params.id));
  sendSuccess(res, 'Attendance fetched', { attendance: data });
});

export const getChildPayments = asyncHandler(async (req, res) => {
  const data = await service.getChildPayments(req.user.id, parseInt(req.params.id));
  sendSuccess(res, 'Payments fetched', { payments: data });
});

export const getChildClasses = asyncHandler(async (req, res) => {
  const data = await service.getChildClasses(req.user.id, parseInt(req.params.id));
  sendSuccess(res, 'Classes fetched', { classes: data });
});

export const linkParent = asyncHandler(async (req, res) => {
  const { parentId, studentId } = req.body;
  const link = await service.linkParent(parentId, studentId);
  sendCreated(res, 'Parent linked to student', { link });
});

export const getAllParents = asyncHandler(async (req, res) => {
  const parents = await service.getAllParents();
  sendSuccess(res, 'Parents fetched', { parents });
});
