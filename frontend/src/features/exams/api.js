import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getExamsByStudent = () => http.get(API.EXAMS_BY_STUDENT());
export const getAllExams = (params) => http.get(API.EXAMS, { params });
export const createExam = (data) => http.post(API.EXAMS, data);
export const updateExam = (id, data) => http.put(API.EXAM_BY_ID(id), data);
export const deleteExam = (id) => http.delete(API.EXAM_BY_ID(id));
