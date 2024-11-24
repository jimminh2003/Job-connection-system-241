import { useState } from 'react';
import { userService } from '../services';
import { useAuth } from '../Contexts/AuthContext';

export const useUser = () => {
  const { user, updateAuthState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.updateProfile(userData);
      if (result.success) {
        updateAuthState({ user: result.data });
        return { success: true };
      }
      throw new Error(result.error);
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.changePassword(passwordData);
      return { success: true, message: result.message };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const result = await userService.updateAvatar(formData);
      if (result.success) {
        updateAuthState({
          user: { ...user, avatarUrl: result.data }
        });
        return { success: true, avatarUrl: result.data };
      }
      throw new Error(result.error);
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settings) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.updateUserSettings(settings);
      if (result.success) {
        updateAuthState({
          user: { ...user, settings: result.data }
        });
        return { success: true };
      }
      throw new Error(result.error);
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    updateProfile,
    changePassword,
    updateAvatar,
    updateSettings
  };
};