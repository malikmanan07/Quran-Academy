import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const getAllPayments = (params) => http.get(API.PAYMENTS, { params });
export const getPaymentsByStudent = () => http.get(API.PAYMENTS_BY_STUDENT());
export const updatePaymentStatus = (id, data) => http.put(API.PAYMENT_STATUS(id), data);
export const addPayment = (data) => http.post(API.PAYMENTS, data);
