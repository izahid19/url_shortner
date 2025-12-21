// API configuration for custom backend
import appConfig from '../config/config';

const API_URL = appConfig.API_URL;

/**
 * Get auth token from localStorage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Set auth token in localStorage
 */
export const setToken = (token) => localStorage.setItem('token', token);

/**
 * Remove auth token from localStorage
 */
export const removeToken = () => localStorage.removeItem('token');

/**
 * API request helper with auth header
 */
export const api = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
    }
  };

  // Add auth header if token exists
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to JSON if not FormData
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export default API_URL;