import API from './axios.js';

export const getClassesByTeacher = (id) => API.get(`/classes/teacher/${id}`);
export const getClassesByStudent = (id) => API.get(`/classes/student/${id}`);
export const addClass = (data) => API.post('/classes', data);
export const updateClassStatus = (id, data) => API.put(`/classes/${id}/status`, data);
export const updateMeetingLink = (id, data) => API.put(`/classes/${id}/meeting`, data);
export const deleteClass = (id) => API.delete(`/classes/${id}`);