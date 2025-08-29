// import axios from 'axios';
// import jwtDecode from 'jwt-decode';

// const API_URL = '/api/auth';

// // Register a new user (security guard)
// const register = async (userData) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, userData);
    
//     if (response.data && response.data.token) {
//       localStorage.setItem('user', JSON.stringify(response.data));
//     }
    
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Server error' };
//   }
// };

// // Login user (security guard)
// const login = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, { email, password });
    
//     if (response.data && response.data.token) {
//       localStorage.setItem('user', JSON.stringify(response.data));
//     }
    
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Server error' };
//   }
// };

// // Logout user
// const logout = () => {
//   localStorage.removeItem('user');
// };

// // Get current user from local storage
// const getCurrentUser = () => {
//   return JSON.parse(localStorage.getItem('user'));
// };

// // Get auth token
// const getToken = () => {
//   const user = getCurrentUser();
//   return user ? user.token : null;
// };

// // Set auth token in axios headers
// const setAuthHeader = () => {
//   const token = getToken();
//   if (token) {
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete axios.defaults.headers.common['Authorization'];
//   }
// };

// // Export individual functions for direct importing
// export { register, login, logout, getCurrentUser, getToken, setAuthHeader };

// // Default export for backward compatibility
// const authService = {
//   register,
//   login,
//   logout,
//   getCurrentUser,
//   getToken,
//   setAuthHeader
// };

// export default authService;



import axios from 'axios';
// import jwtDecode from 'jwt-decode';

const API_URL = '/api/auth';

// Helper function to handle localStorage
const setUser = (userData) => {
  if (userData?.token) {
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthHeader(); // Update axios headers immediately
  }
};

// Register a new user (security guard)
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    setUser(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Login user (security guard)
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    setUser(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

// Get current user from local storage
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get auth token
const getToken = () => {
  const user = getCurrentUser();
  return user?.token || null;
};

// Set auth token in axios headers
const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize auth header when module loads
setAuthHeader();

// Export individual functions for direct importing
export {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  setAuthHeader
};

// Default export for backward compatibility
const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  setAuthHeader
};

export default authService;