import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getMyCertificates = () => http.get(API.MY_CERTIFICATES);
export const getGeneratedCertificates = () => http.get(API.ALL_CERTIFICATES);
export const getCompletionRequests = () => http.get(API.ADMIN_COURSE_COMPLETIONS);
export const generateCertificate = (data) => http.post(API.GENERATE_CERTIFICATE, data);
export const getCertificateData = (id) => http.get(`certificates/${id}/download`);
