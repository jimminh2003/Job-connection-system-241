import api from '../api/axios';
import { handleApiError } from '../utils/errorHandle';

class AuthService {
  constructor() {
    this.tokenKey = 'token';
    this.refreshTokenKey = 'refreshToken';
  }

  // Token management
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setTokens(token, refreshToken) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  clearTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  // Auth API calls
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      const { token, refreshToken, user } = response.data;
      this.setTokens(token, refreshToken);
      return { success: true, user };
    } catch (error) {
      return handleApiError(error, 'Đăng nhập thất bại');
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error, 'Đăng ký thất bại');
    }
  }

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Không tìm thấy refresh token');
      }
      const response = await api.post('/api/auth/refresh', { refreshToken });
      const { token, newRefreshToken } = response.data;
      this.setTokens(token, newRefreshToken);
      return { success: true, token };
    } catch (error) {
      return handleApiError(error, 'Làm mới token thất bại');
    }
  }

  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await api.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async verifyToken() {
    try {
      const response = await api.get('/api/auth/verify');
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error, 'Token không hợp lệ');
    }
  }
}

export default new AuthService();