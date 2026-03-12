import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getAllStudents = (params) => http.get(API.STUDENTS, { params });
export const getStudent = (id) => http.get(API.STUDENT_BY_ID(id));
export const addStudent = (data) => http.post(API.STUDENTS, data);
export const updateStudent = (id, data) => http.put(API.STUDENT_BY_ID(id), data);
export const deleteStudent = (id) => http.delete(API.STUDENT_BY_ID(id));
