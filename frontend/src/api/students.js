import API from './axios.js';

export const getAllStudents = () => API.get('/students');
export const getStudent = (id) => API.get(`/students/${id}`);
export const addStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);