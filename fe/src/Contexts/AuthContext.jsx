import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const updateAuthState = (updates) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  };

  const checkAuthStatus = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const userData = await userService.getCurrentUser();
      updateAuthState({
        isAuthenticated: true,
        user: userData,
        loading: false
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      handleLogout();
    } finally {
      updateAuthState({ loading: false });
    }
  };

  const handleLogin = async (credentials) => {
    updateAuthState({ loading: true, error: null });
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        updateAuthState({
          isAuthenticated: true,
          user: result.user,
          error: null
        });
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      updateAuthState({ error: error.message });
      return { 
        success: false, 
        error: error.message
      };
    } finally {
      updateAuthState({ loading: false });
    }
  };

  const handleLogout = async () => {
    updateAuthState({ loading: true });
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      updateAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  };

  const updateUserProfile = async (userData) => {
    updateAuthState({ loading: true, error: null });
    try {
      const updatedUser = await userService.updateProfile(userData);
      updateAuthState({
        user: updatedUser,
        error: null
      });
      return { success: true };
    } catch (error) {
      updateAuthState({ error: error.message });
      return {
        success: false,
        error: error.message
      };
    } finally {
      updateAuthState({ loading: false });
    }
  };

  const value = {
    ...authState,
    handleLogin,
    handleLogout,
    updateUserProfile
  };

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};