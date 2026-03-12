import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getAllTeachers = (params) => http.get(API.TEACHERS, { params });
export const getTeacher = (id) => http.get(API.TEACHER_BY_ID(id));
export const addTeacher = (data) => http.post(API.TEACHERS, data);
export const updateTeacher = (id, data) => http.put(API.TEACHER_BY_ID(id), data);
export const deleteTeacher = (id) => http.delete(API.TEACHER_BY_ID(id));
