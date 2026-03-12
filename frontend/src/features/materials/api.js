import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getAllMaterials = (params) => http.get(API.COURSE_MATERIAL, { params });
export const getMaterial = (id) => http.get(API.COURSE_MATERIAL_BY_ID(id));
export const createMaterial = (data) => http.post(API.COURSE_MATERIAL, data);
export const updateMaterial = (id, data) => http.put(API.COURSE_MATERIAL_BY_ID(id), data);
export const deleteMaterial = (id) => http.delete(API.COURSE_MATERIAL_BY_ID(id));
