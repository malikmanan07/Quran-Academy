import API from './axios.js';

export const getExamsByStudent = (id) => API.get(`/exams/student/${id}`);
export const addExam = (data) => API.post('/exams', data);
export const updateExam = (id, data) => API.put(`/exams/${id}`, data);
export const deleteExam = (id) => API.delete(`/exams/${id}`);