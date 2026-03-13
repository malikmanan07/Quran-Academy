import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getQuranProgress = (studentId) => http.get(API.QURAN_PROGRESS(studentId));
export const getMyQuranProgress = () => http.get(API.QURAN_PROGRESS_MY);
export const updateQuranPara = (studentId, paraNumber, status) =>
  http.put(API.QURAN_PROGRESS_UPDATE(studentId, paraNumber), { status });
