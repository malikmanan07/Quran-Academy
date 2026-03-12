import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getAllClasses = (params) => http.get(API.CLASSES, { params });
export const getClassesByTeacher = () => http.get(API.CLASSES_BY_TEACHER());
export const getClassesByStudent = () => http.get(API.CLASSES_BY_STUDENT());
export const addClass = (data) => http.post(API.CLASSES, data);
export const updateClass = (id, data) => http.put(API.CLASS_BY_ID(id), data);
export const updateClassStatus = (id, data) => http.put(API.CLASS_STATUS(id), data);
export const deleteClass = (id) => http.delete(API.CLASS_BY_ID(id));
