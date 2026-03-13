import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const bookTrial = (data) => http.post(API.TRIAL_BOOK, data);
export const getTrialRequests = () => http.get(API.TRIAL_REQUESTS);
export const updateTrialStatus = (id, status) => http.put(API.TRIAL_STATUS(id), { status });
export const convertTrial = (id) => http.put(API.TRIAL_CONVERT(id));
