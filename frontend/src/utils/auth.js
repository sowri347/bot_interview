/**
 * Authentication utility functions for JWT token management
 */

const TOKEN_KEY = 'auth_token';
const ADMIN_TOKEN_KEY = 'admin_token';
const CANDIDATE_TOKEN_KEY = 'candidate_token';

/**
 * Store admin token in localStorage
 */
export const setAdminToken = (token) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(TOKEN_KEY, token); // Also store in generic key for backward compatibility
};

/**
 * Get admin token from localStorage
 */
export const getAdminToken = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
};

/**
 * Store candidate token in localStorage
 */
export const setCandidateToken = (token) => {
  localStorage.setItem(CANDIDATE_TOKEN_KEY, token);
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get candidate token from localStorage
 */
export const getCandidateToken = () => {
  return localStorage.getItem(CANDIDATE_TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove all tokens from localStorage
 */
export const clearTokens = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(CANDIDATE_TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated (has token)
 */
export const isAuthenticated = () => {
  return !!getAdminToken() || !!getCandidateToken();
};

/**
 * Get token based on user type
 */
export const getToken = (userType = 'admin') => {
  if (userType === 'candidate') {
    return getCandidateToken();
  }
  return getAdminToken();
};

