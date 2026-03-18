import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import * as service from './certificates.service.js';

export const getCompletions = asyncHandler(async (req, res) => {
  const completions = await service.getCompletions();
  sendSuccess(res, 'Completion requests fetched', { completions });
});

export const generate = asyncHandler(async (req, res) => {
  const certificate = await service.generate(req.user.id, req.body);
  sendSuccess(res, 'Certificate generated successfully!', { certificate });
});

export const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await service.getMyCertificates(req.user.id);
  sendSuccess(res, 'Your certificates fetched', { certificates });
});

export const getAllGenerated = asyncHandler(async (req, res) => {
  const certificates = await service.getAllGenerated();
  sendSuccess(res, 'Generated certificates fetched', { certificates });
});

export const download = asyncHandler(async (req, res) => {
  const certificate = await service.getById(parseInt(req.params.id));
  // In a real app, we might serve a generated PDF or metadata
  // Here we just return the data so frontend can generate it via jsPDF
  sendSuccess(res, 'Certificate data for download', { certificate });
});
