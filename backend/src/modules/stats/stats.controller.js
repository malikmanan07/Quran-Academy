import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import * as statsService from './stats.service.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getStats();
  sendSuccess(res, 'Dashboard stats fetched', stats);
});
