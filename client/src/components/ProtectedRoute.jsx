import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiresGuard = false }) => {
  const { user, loading, isAuthenticated, isGuard } = useContext(AuthContext);
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  // Check if authenticated
  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // Check for guard role if required
  if (requiresGuard) {
    // First check if user object is loaded
    if (!user) {
      console.log("User object not loaded, redirecting to login");
      return <Navigate to="/login" replace />;
    }
    
    // Then check if user has guard role
    if (!isGuard()) {
      console.log("Not a guard, redirecting to home");
      return <Navigate to="/" replace />;
    }
  }
  
  // User is authenticated and has required role if needed
  return children;
};

export default ProtectedRoute;