import API from './axios.js';

export const getAllCourses = () => API.get('/courses');
export const addCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);