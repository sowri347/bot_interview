/**
 * Custom hook for API calls using Axios
 */
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getAdminToken, getCandidateToken } from '../utils/auth';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    
    // Determine which token to use based on the route
    let token = null;
    if (url.includes('/admin/')) {
      // Use admin token for admin routes
      token = getAdminToken();
    } else if (url.includes('/candidate/')) {
      // Use candidate token for candidate routes
      token = getCandidateToken();
    } else {
      // For other routes, try candidate first, then admin
      token = getCandidateToken() || getAdminToken();
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // Only auto-redirect for admin routes
      if (url.includes('/admin/')) {
        localStorage.clear();
        window.location.href = '/admin/login';
      } else if (url.includes('/candidate/')) {
        // For candidate routes, just clear tokens but don't redirect
        // Let the component handle the error (e.g., redirect to registration)
        const candidateToken = localStorage.getItem('candidate_token');
        if (candidateToken) {
          // Only clear candidate token, not admin token
          localStorage.removeItem('candidate_token');
          localStorage.removeItem('auth_token'); // Clear generic token too
        }
        // Don't redirect - let the component handle it
      } else {
        // For other routes, clear all and redirect to admin login
        localStorage.clear();
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

