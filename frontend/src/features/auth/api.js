import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';
import * as authStorage from '../../services/authStorage';

export const loginUser = (data) => http.post(API.LOGIN, data);

export const registerUser = (data) => http.post(API.REGISTER, data);

export const getMe = () => http.get(API.ME);

export const forgotPassword = (email) =>
  http.post('/api/auth/forgot-password', { email });

export const logoutUser = () => {
  authStorage.clear();
};
