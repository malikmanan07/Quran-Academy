import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import * as service from './quran-progress.service.js';

export const getByStudentId = asyncHandler(async (req, res) => {
  const data = await service.getByStudentId(parseInt(req.params.studentId));
  sendSuccess(res, 'Quran progress fetched', { progress: data });
});

export const updatePara = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const studentId = parseInt(req.params.studentId);
  const paraNumber = parseInt(req.params.paraNumber);
  const result = await service.updatePara(studentId, paraNumber, status);
  sendSuccess(res, 'Para status updated', { progress: result });
});

export const getMyProgress = asyncHandler(async (req, res) => {
  const data = await service.getByStudentId(req.user.id);
  sendSuccess(res, 'My Quran progress', { progress: data });
});
