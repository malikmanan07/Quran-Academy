import * as repo from './quran-progress.repository.js';

export const getByStudentId = async (studentId) => {
  let data = await repo.findByStudentId(studentId);
  if (data.length === 0) data = await repo.initStudent(studentId);
  return data;
};

export const updatePara = async (studentId, paraNumber, status) =>
  repo.upsertPara(studentId, paraNumber, status);
