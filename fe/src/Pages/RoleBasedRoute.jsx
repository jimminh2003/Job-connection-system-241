import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import TokenManager from '../utils/tokenManager';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;