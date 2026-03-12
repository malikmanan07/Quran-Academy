import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import * as service from './users.service.js';

export const getPendingUsers = asyncHandler(async (req, res) => {
  const users = await service.getPendingUsers();
  sendSuccess(res, 'Pending users fetched', { users });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await service.getAllUsers(req.query);
  sendSuccess(res, 'All users fetched', { users: result.users }, { total: result.total });
});

export const approveUser = asyncHandler(async (req, res) => {
  const user = await service.approveUser(parseInt(req.params.id));
  sendSuccess(res, 'User approved successfully', { user });
});

export const rejectUser = asyncHandler(async (req, res) => {
  const user = await service.rejectUser(parseInt(req.params.id));
  sendSuccess(res, 'User rejected', { user });
});
