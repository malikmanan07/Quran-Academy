import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const createDailyProgress = (data) => http.post(API.DAILY_PROGRESS, data);
export const getMyDailyProgress = () => http.get(API.MY_DAILY_PROGRESS);
export const getDailyProgressByStudent = (studentId) => http.get(API.DAILY_PROGRESS_BY_STUDENT(studentId));
export const updateDailyProgress = (id, data) => http.put(API.DAILY_PROGRESS_BY_ID(id), data);
export const deleteDailyProgress = (id) => http.delete(API.DAILY_PROGRESS_BY_ID(id));
