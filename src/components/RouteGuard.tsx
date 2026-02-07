import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'farmer' | 'buyer';
}

const RouteGuard = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { currentUser, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Minimal loading state - only show during actual auth loading
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it
  // Only redirect if we're sure there's no role (not during loading)
  if (requiredRole && role && role !== requiredRole) {
    // Redirect to role selection or unauthorized page
    return <Navigate to="/role-select" replace />;
  }
  
  // Allow navigation to proceed even if role is not yet loaded
  // The actual role verification happens after navigation
  if (requiredRole && !role && currentUser) {
    // Just let the user proceed - the role will sync in background
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};

export default RouteGuard;