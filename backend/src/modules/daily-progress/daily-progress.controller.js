import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './daily-progress.service.js';
import { sendNotification } from '../../services/socketService.js';

export const createDailyProgress = asyncHandler(async (req, res) => {
  const data = { ...req.body, teacherId: req.user.id };
  const progress = await service.createDailyProgress(data);
  
  // Real-time notification
  sendNotification(data.studentId, `Your teacher logged your sabaq progress for ${data.date}`, 'success');
  
  sendCreated(res, 'Daily progress logged successfully', { progress });
});

export const getDailyProgressByStudent = asyncHandler(async (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : parseInt(req.params.id);
  const progress = await service.getDailyProgressByStudent(studentId);
  sendSuccess(res, 'Daily progress fetched', { progress });
});

export const getMyDailyProgress = asyncHandler(async (req, res) => {
  const progress = await service.getDailyProgressByStudent(req.user.id);
  sendSuccess(res, 'My daily progress fetched', { progress });
});

export const updateDailyProgress = asyncHandler(async (req, res) => {
  const progress = await service.updateDailyProgress(parseInt(req.params.id), req.body);
  sendSuccess(res, 'Daily progress updated', { progress });
});

export const deleteDailyProgress = asyncHandler(async (req, res) => {
  await service.deleteDailyProgress(parseInt(req.params.id));
  sendSuccess(res, 'Daily progress deleted successfully');
});
