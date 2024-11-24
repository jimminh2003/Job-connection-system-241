import authService from '../services/authService';
  
  export const setupAxiosInterceptors = (axiosInstance) => {
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const result = await authService.refreshToken();
            if (result.success) {
              originalRequest.headers.Authorization = `Bearer ${result.token}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // Nếu refresh token thất bại, logout user
            await authService.logout();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  };