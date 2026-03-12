import API from './axios.js';

export const getAllTeachers = () => API.get('/teachers');
export const getTeacher = (id) => API.get(`/teachers/${id}`);
export const addTeacher = (data) => API.post('/teachers', data);
export const updateTeacher = (id, data) => API.put(`/teachers/${id}`, data);
export const deleteTeacher = (id) => API.delete(`/teachers/${id}`);