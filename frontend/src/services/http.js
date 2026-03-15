import axios from 'axios';
import { getToken, clear } from './authStorage';

const http = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clear();
      // Don't violently redirect if we are already on login or trying to login
      const isPublicPath = window.location.pathname === '/login' || 
                           window.location.pathname === '/signup' || 
                           window.location.pathname === '/';
                           
      if (!isPublicPath) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default http;
