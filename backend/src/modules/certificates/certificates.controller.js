import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './certificates.service.js';

export const getMyCertificates = asyncHandler(async (req, res) => {
  const certs = await service.getMyCertificates(req.user.id);
  sendSuccess(res, 'Certificates fetched', { certificates: certs });
});

export const generate = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.body;
  const cert = await service.generate({ studentId, courseId });
  sendCreated(res, 'Certificate generated', { certificate: cert });
});
