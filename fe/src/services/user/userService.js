import api from '../../api/axios';
import { handleApiError } from '../../utils/errorHandle';

class UserService {
  async getCurrentUser() {
    try {
      const response = await api.get('/api/users/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Không thể lấy thông tin người dùng');
    }
  }

  async updateProfile(userData) {
    try {
      const response = await api.put('/api/users/profile', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Cập nhật thông tin thất bại');
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await api.put('/api/users/change-password', passwordData);
      return {
        success: true,
        message: 'Đổi mật khẩu thành công'
      };
    } catch (error) {
      return handleApiError(error, 'Đổi mật khẩu thất bại');
    }
  }

  async getUserProfile(userId) {
    try {
      const response = await api.get(`/api/users/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Không thể lấy thông tin người dùng');
    }
  }

  async updateAvatar(formData) {
    try {
      const response = await api.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        success: true,
        data: response.data.avatarUrl
      };
    } catch (error) {
      return handleApiError(error, 'Cập nhật ảnh đại diện thất bại');
    }
  }

  async updateUserSettings(settings) {
    try {
      const response = await api.put('/api/users/settings', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error, 'Cập nhật cài đặt thất bại');
    }
  }

  async deactivateAccount() {
    try {
      await api.post('/api/users/deactivate');
      return {
        success: true,
        message: 'Tài khoản đã được vô hiệu hóa'
      };
    } catch (error) {
      return handleApiError(error, 'Không thể vô hiệu hóa tài khoản');
    }
  }
}

const userService = new UserService();
export default userService;