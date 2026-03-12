import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getProgressByStudent = () => http.get(API.PROGRESS_BY_STUDENT());
export const getAllProgress = (params) => http.get(API.PROGRESS, { params });
export const createProgress = (data) => http.post(API.PROGRESS, data);
export const updateProgress = (id, data) => http.put(API.PROGRESS_BY_ID(id), data);
export const deleteProgress = (id) => http.delete(API.PROGRESS_BY_ID(id));
