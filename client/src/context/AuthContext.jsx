import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function to be used by Login component
  const login = useCallback(async (username, password) => {
    try {
       const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      
      if (response.data.success && response.data.token) {
        const userData = {
          username: response.data.guard.username,
          role: response.data.guard.role,
          id: response.data.guard.id,
          token: response.data.token
        };
        
        // Clear any old auth data that might be lingering
        localStorage.removeItem('userInfo');
        
        // Store in localStorage for API requests
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        
        setUser(userData);
        return userData;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data?.message 
        ? new Error(error.response.data.message) 
        : error;
    }
  }, []);

  const logout = useCallback(() => {
    // Remove all auth tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userInfo'); // Clear this too to avoid confusion
    
    // Clear auth header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    // Redirect to home page
    window.location.href = '/';
  }, []);

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return !!(token && userData);
  }, []);

  const isGuard = useCallback(() => {
    if (!user) return false;
    return user.role === 'guard';
  }, [user]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // If userInfo exists but not our auth data, clean it up to avoid conflicts
    if (localStorage.getItem('userInfo') && (!token || !userData)) {
      console.log('Clearing old userInfo data');
      localStorage.removeItem('userInfo');
    }
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        // Set auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Invalid user data in localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isGuard,
        isSecurityGuard: isGuard // Alias for backward compatibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
