import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import * as service from './users.service.js';
import { parsePaginationParams, buildPaginatedResponse } from '../../utils/pagination.js';

export const getPendingUsers = asyncHandler(async (req, res) => {
  const users = await service.getPendingUsers();
  sendSuccess(res, 'Pending users fetched', { users });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, pageSize } = parsePaginationParams(req.query);
  const result = await service.getAllUsers({ ...req.query, page, limit: pageSize });
  const { data, meta } = buildPaginatedResponse(result.users, result.total, page, pageSize);
  sendSuccess(res, 'All users fetched', { users: data }, meta);
});

export const approveUser = asyncHandler(async (req, res) => {
  const user = await service.approveUser(parseInt(req.params.id));
  sendSuccess(res, 'User approved successfully', { user });
});

export const rejectUser = asyncHandler(async (req, res) => {
  const user = await service.rejectUser(parseInt(req.params.id));
  sendSuccess(res, 'User rejected', { user });
});
