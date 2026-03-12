import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getAllCourses = (params) => http.get(API.COURSES, { params });
export const getCourse = (id) => http.get(API.COURSE_BY_ID(id));
export const addCourse = (data) => http.post(API.COURSES, data);
export const updateCourse = (id, data) => http.put(API.COURSE_BY_ID(id), data);
export const deleteCourse = (id) => http.delete(API.COURSE_BY_ID(id));
