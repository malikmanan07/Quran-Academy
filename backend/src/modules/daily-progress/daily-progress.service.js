import * as repository from './daily-progress.repository.js';

export const createDailyProgress = async (data) => {
  return repository.createDailyProgress(data);
};

export const getDailyProgressByStudent = async (studentId) => {
  return repository.getDailyProgressByStudent(studentId);
};

export const updateDailyProgress = async (id, data) => {
  const existing = await repository.getDailyProgressById(id);
  if (!existing) {
    const error = new Error('Daily progress report not found');
    error.statusCode = 404;
    throw error;
  }
  return repository.updateDailyProgress(id, data);
};

export const deleteDailyProgress = async (id) => {
  const existing = await repository.getDailyProgressById(id);
  if (!existing) {
    const error = new Error('Daily progress report not found');
    error.statusCode = 404;
    throw error;
  }
  return repository.deleteDailyProgress(id);
};
