import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';
import { cachedRequest, invalidateCache } from '../../services/apiCache';

export const getAllCourses = (params) => {
  const qs = new URLSearchParams(params || {}).toString();
  return cachedRequest(`courses:${qs}`, () => http.get(API.COURSES, { params }), 300);
};

export const getCourse = (id) => cachedRequest(`course:${id}`, () => http.get(API.COURSE_BY_ID(id)), 300);

export const addCourse = async (data) => {
  const result = await http.post(API.COURSES, data);
  invalidateCache('course');
  return result;
};

export const updateCourse = async (id, data) => {
  const result = await http.put(API.COURSE_BY_ID(id), data);
  invalidateCache('course');
  return result;
};

export const deleteCourse = async (id) => {
  const result = await http.delete(API.COURSE_BY_ID(id));
  invalidateCache('course');
  return result;
};
