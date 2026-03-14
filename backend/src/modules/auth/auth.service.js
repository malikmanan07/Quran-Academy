import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import AppError from '../../utils/appError.js';
import * as authRepo from './auth.repository.js';

export const registerUser = async (data) => {
  const existing = await authRepo.findByEmail(data.email);
  if (existing) throw new AppError('Email already exists', 400);

  const hash = await bcrypt.hash(data.password, 10);
  const user = await authRepo.createUser({ ...data, password: hash });

  const token = generateToken(user);
  const { password, ...safe } = user;
  return { token, user: safe };
};

export const loginUser = async ({ email, password }) => {
  const user = await authRepo.findByEmail(email);

  if (env.NODE_ENV !== 'production') {
    console.log('[Auth Debug] Login attempt for:', email);
    console.log('[Auth Debug] User found:', user ? `Yes (id=${user.id}, role=${user.role}, status=${user.status})` : 'No');
  }

  if (!user) throw new AppError('Invalid email or password', 401);

  const match = await bcrypt.compare(password, user.password);

  if (env.NODE_ENV !== 'production') {
    console.log('[Auth Debug] Password match:', match);
  }

  if (!match) throw new AppError('Invalid email or password', 401);

  if (user.status === 'pending') throw new AppError('Your account is pending approval', 403);
  if (user.status === 'rejected') throw new AppError('Your account has been rejected. Contact support.', 403);

    await authRepo.updateUser(user.id, { lastLoginAt: new Date() });

  const token = generateToken(user);
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, status: user.status },
  };
};

export const getMe = async (userId) => {
  const user = await authRepo.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  const { password, ...safe } = user;
  return safe;
};

export const forgotPassword = async (email) => {
  const user = await authRepo.findByEmail(email);
  if (!user) throw new AppError('No account found with this email', 404);
  return { message: 'Password reset instructions sent to your email' };
};

export const updateProfile = async (userId, data) => {
  const user = await authRepo.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const updatedUser = await authRepo.updateUser(userId, data);
  const { password, ...safe } = updatedUser;
  return safe;
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await authRepo.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw new AppError('Incorrect current password', 400);

  const hash = await bcrypt.hash(newPassword, 10);
  await authRepo.updateUser(userId, { password: hash });

  return { message: 'Password updated successfully' };
};

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, name: user.name, status: user.status }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
