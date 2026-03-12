import API from './axios.js';

export const getAllPayments = () => API.get('/payments');
export const getPaymentsByStudent = (id) => API.get(`/payments/student/${id}`);
export const addPayment = (data) => API.post('/payments', data);
export const updatePaymentStatus = (id, data) => API.put(`/payments/${id}`, data);