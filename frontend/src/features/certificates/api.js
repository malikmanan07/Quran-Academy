import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getMyCertificates = () => http.get(API.MY_CERTIFICATES);
export const generateCertificate = (data) => http.post(API.GENERATE_CERTIFICATE, data);
