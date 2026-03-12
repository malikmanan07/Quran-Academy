import API from './axios.js';

export const getAllMaterials = () => API.get('/course-material');
export const addMaterial = (data) => API.post('/course-material', data);
export const deleteMaterial = (id) => API.delete(`/course-material/${id}`);