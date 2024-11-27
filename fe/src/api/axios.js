import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import TokenManager from '../utils/tokenManager';
import AuthService from '../services/authService';
//const baseURL = 'http://your-api';
const baseURL = 'http://localhost:8080';
const REFRESH_TIMEOUT = 10000;
const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,//cookkieeeeeeeee
  headers: {
    'Content-Type': 'application/json'
  }
});
let isRefreshing = false;
let refreshSubscribers = [];
let refreshTokenPromise = null;
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => {
    if (typeof callback === 'function') {
      callback(token);
    }
  });
  refreshSubscribers = [];
};

const onRefreshFailed = () => {
  refreshSubscribers.forEach((callback) => callback(null));
  refreshSubscribers = [];
};
// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403) {
      console.error('Access denied: You do not have the necessary permissions.');
      alert('Bạn không có quyền truy cập vào tài nguyên này.');
      TokenManager.clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        try {
          const token = await refreshTokenPromise;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      else {
      isRefreshing = true;
      refreshTokenPromise = new Promise(async (resolve, reject) => {
        const timeoutPromise = new Promise((_, rejectTimeout) =>
          setTimeout(() => rejectTimeout(new Error('Refresh token timeout')), REFRESH_TIMEOUT)
        );
        const refreshPromise = AuthService.refreshToken();
      
        try {
          const result = await Promise.race([refreshPromise, timeoutPromise]);
          if (result.success) {
            onTokenRefreshed(result.token);
            resolve(result.token); // Gán token cho các yêu cầu đang chờ
          } else {
            reject(new Error('Refresh token failed'));
          }
        } catch (err) {
          onRefreshFailed();
          TokenManager.clearAuth();
          window.location.href = '/login';
        } 
      });
      refreshTokenPromise
      .then(() => (isRefreshing = false))
      .catch(() => (isRefreshing = false));
    
     
    return Promise.reject(error);
  }
}
return Promise.reject(error);
});
export default axiosInstance;