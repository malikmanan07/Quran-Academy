import API from './axios.js';

export const getProgressByStudent = (id) => API.get(`/progress/student/${id}`);
export const addProgress = (data) => API.post('/progress', data);
export const updateProgress = (id, data) => API.put(`/progress/${id}`, data);
export const deleteProgress = (id) => API.delete(`/progress/${id}`);