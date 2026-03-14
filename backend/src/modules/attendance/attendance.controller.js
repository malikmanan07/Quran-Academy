import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './attendance.service.js';

export const mark = asyncHandler(async (req, res) => {
  const data = { ...req.body, teacherId: req.user.id };
  const record = await service.markAttendance(data);
  sendCreated(res, 'Attendance marked', { attendance: record });
});

export const getByStudent = asyncHandler(async (req, res) => {
  const studentId = parseInt(req.params.id);
  const records = await service.getByStudent(studentId);
  sendSuccess(res, 'Attendance fetched', { attendance: records });
});

export const getMyAttendance = asyncHandler(async (req, res) => {
  const records = await service.getByStudent(req.user.id);
  sendSuccess(res, 'My attendance fetched', { attendance: records });
});

export const getByClass = asyncHandler(async (req, res) => {
  const records = await service.getByClass(parseInt(req.params.id));
  sendSuccess(res, 'Class attendance fetched', { attendance: records });
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await service.getStats(parseInt(req.params.studentId));
  sendSuccess(res, 'Attendance stats fetched', { stats });
});
