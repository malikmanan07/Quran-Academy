import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const createEnrollmentRequest = (data) => http.post(API.ENROLLMENT_REQUEST, data);
export const getMyEnrollmentRequests = () => http.get(API.MY_ENROLLMENT_REQUESTS);
export const getAllEnrollmentRequests = () => http.get(API.ALL_ENROLLMENT_REQUESTS);
export const approveEnrollment = (id) => http.put(API.APPROVE_ENROLLMENT(id));
export const rejectEnrollment = (id, reason) => http.put(API.REJECT_ENROLLMENT(id), { reason });
