import AppError from '../../utils/appError.js';
import * as repo from './trial.repository.js';
import * as usersRepo from '../users/users.repository.js';

export const getAll = async () => repo.findAll();

export const book = async (data) => {
  const {
    fullName,
    email,
    phone,
    country,
    timezone,
    courseId,
    preferredTime,
    preferredDays,
    message,
  } = data;

  if (!fullName || !email || !phone || !country || !timezone || !courseId) {
    throw new AppError('Missing required fields for trial booking', 400);
  }

  const normalizedCourseId = Number.parseInt(courseId, 10);
  if (Number.isNaN(normalizedCourseId)) {
    throw new AppError('Invalid courseId', 400);
  }

  const normalizedPreferredDays = Array.isArray(preferredDays)
    ? preferredDays.join(', ')
    : preferredDays || null;

  const payload = {
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    country,
    timezone,
    courseId: normalizedCourseId,
    preferredTime: preferredTime || null,
    preferredDays: normalizedPreferredDays,
    message: message || null,
  };

  try {
    const trial = await repo.create(payload);
    return trial;
  } catch (error) {
    // Extra logging for debugging 500s
    // (global error handler will still format the response)
    console.error('Trial booking error:', error);
    throw error;
  }
};

export const updateStatus = async (id, status) => {
  const trial = await repo.findById(id);
  if (!trial) throw new AppError('Trial request not found', 404);

  const updatedTrial = await repo.updateStatus(id, status);

  if (status === 'approved') {
    try {
      const user = await usersRepo.findByEmail(trial.email);
      if (user && user.status === 'pending') {
        await usersRepo.updateStatus(user.id, 'active');
      }
    } catch (error) {
      console.error('Failed to sync user status with trial approval', error);
    }
  }

  return updatedTrial;
};

export const getById = async (id) => {
  const trial = await repo.findById(id);
  if (!trial) throw new AppError('Trial request not found', 404);
  return trial;
};

export const getPendingCount = async () => repo.countPending();
