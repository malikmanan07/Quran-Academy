import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './classes.service.js';
import { sendNotification } from '../../services/socketService.js';
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
  
  // Real-time notification
  sendNotification(cls.studentId, `Your class on ${cls.date} has been updated to: ${req.body.status}`, 'info');
  
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

export const teacherSchedule = asyncHandler(async (req, res) => {
  const data = { ...req.body, teacherId: req.user.id, scheduledBy: req.user.id };
  const cls = await service.create(data);
  sendNotification(data.studentId, `Your teacher scheduled a class on ${data.date} at ${data.time}`, 'info');
  sendCreated(res, 'Class scheduled', { class: cls });
});

export const teacherReschedule = asyncHandler(async (req, res) => {
  const cls = await service.update(parseInt(req.params.id), req.body);
  sendNotification(cls.studentId, `Your class has been rescheduled to ${req.body.date || cls.date}`, 'warning');
  sendSuccess(res, 'Class rescheduled', { class: cls });
});

export const teacherCancel = asyncHandler(async (req, res) => {
  const cls = await service.updateStatus(parseInt(req.params.id), 'cancelled');
  sendNotification(cls.studentId, `Your class on ${cls.date} has been cancelled`, 'error');
  sendSuccess(res, 'Class cancelled', { class: cls });
});
