import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services';
import { useNavigate , useLocation } from 'react-router-dom';
import TokenManager from '../utils/tokenManager';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
    role:null
  });
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const publicRoutes = ['/login', '/register', '/alljob', '/alljob/:id', '/allcompany', '/allcompany/:id'];
    
    // Chỉ kiểm tra khi chưa xác thực và không ở public route
    if (!authState.isAuthenticated && !publicRoutes.some(route => {
      if (route.includes(':')) {
        const baseRoute = route.split('/:')[0];
        return location.pathname.startsWith(baseRoute);
      }
      return location.pathname === route;
    })) {
      checkAuthStatus();
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false,
      }));
    }
  }, [location.pathname, authState.isAuthenticated]);

  const updateAuthState = (updates) => {
    setAuthState((prev) => ({
      ...prev,
      user: updates.user,
      role: updates.role,
      isAuthenticated: true
    }));
  };

  const checkAuthStatus = async () => {
    try {
      const token = TokenManager.getToken();
      if (!token) {
        // Thay vì throw error, chỉ cần cập nhật state
        updateAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
          role: null
        });
        return;
      }
      const userInfo = TokenManager.getUserInfo();
      const role = TokenManager.getUserRole();
      // Kiểm tra token hợp lệ với backend nếu cần
      // const user = await authService.validateToken(token);
      updateAuthState({
        isAuthenticated: true,
        loading: false,
        user: userInfo,
        role: role
      });
    } catch (error) {
      updateAuthState({
        isAuthenticated: false,
        loading: false,
        user: null,
        role:null,
        error: error.message
      });
    }
  };

  const handleLogin = async (credentials) => {
    updateAuthState({ loading: true, error: null });
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        const { token, user } = result;
        const role = user.role; // Đảm bảo role luôn tồn tại
        if (!role) {
          throw new Error('Vai trò của người dùng không xác định');
        }
  
        TokenManager.setToken(token, role, result.expiresIn);
        TokenManager.setUserInfo(user);
  
        updateAuthState({
          isAuthenticated: true,
          user,
          role,
          error: null
        });
        switch (role) {
          case 'admin':
            navigate('/dashboard'); // Thay vì /admin
            break;
          case 'applicant':
            navigate('/ApplicantProfile'); // Thay vì /applicants
            break;
          case 'company':
            navigate('/CompanyProfile'); // Thay vì /companies
            break;
          default:
            navigate('/');
        }
        
        return { success: true };
      }
    } catch (error) {
      updateAuthState({ error: error.message });
      return { 
        success: false, 
        error: error.message || 'Đăng nhập thất bại'
      };
    } finally {
      updateAuthState({ loading: false });
    }
  };

  const handleLogout = async (shouldRedirect = true) => {
    updateAuthState({ loading: true });
    try {
      await authService.logout();
      TokenManager.clearAuth();
      updateAuthState({
        isAuthenticated: false,
        user: null,
        role: null,
        error: null
      });
     
        navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      updateAuthState({
       
        loading: false
        
      });
    }
  };
  const hasRole = (requiredRole) => {
    return authState.role === requiredRole;
  };
  const canAccess = (path) => {
    if (!authState.isAuthenticated || !authState.role) return false;

    
    if (path.startsWith('/admin') && authState.role === 'admin') return true;
    if (path.startsWith('/applicants') && authState.role === 'applicant') return true;
    if (path.startsWith('/companies') && authState.role === 'company') return true;
    
    return false;
  };

  const value = {
    ...authState,
    handleLogin,
    handleLogout,
    hasRole,
    canAccess
  };

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang kiểm tra trạng thái đăng nhập...</p>
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