import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'farmer' | 'buyer';
}

const RouteGuard = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { currentUser, role, loading } = useAuth();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Wait for auth state to load
    if (!loading) {
      setChecked(true);
    }
  }, [loading]);

  if (loading || !checked) {
    // Show loading spinner while checking auth status
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && role !== requiredRole) {
    // Redirect to role selection or unauthorized page
    return <Navigate to="/role-select" replace />;
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};

export default RouteGuard;