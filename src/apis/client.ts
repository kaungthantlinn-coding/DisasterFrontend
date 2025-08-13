import axios, { AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { isTokenExpired } from '../utils/jwtUtils';
import { showErrorToast } from '../utils/notifications';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5057/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and check expiration
apiClient.interceptors.request.use(
  (config) => {
    const authState = useAuthStore.getState();
    const { accessToken } = authState;

    if (accessToken) {
      // Check if token is expired before making the request
      if (isTokenExpired(accessToken)) {
        console.warn('🔒 Token expired - rejecting request and logging out');

        // Log out user immediately
        authState.logout();

        // Show error message
        showErrorToast(
          'Your session has expired. Please log in again.',
          'Session Expired'
        );

        // Redirect to login
        window.location.href = '/login';

        // Reject the request
        return Promise.reject(new Error('Token expired'));
      }

      // Add valid token to request
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling expired tokens (NO AUTOMATIC REFRESH)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    // Handle 401 Unauthorized responses (token expired/invalid)
    if (error.response?.status === 401) {
      const authState = useAuthStore.getState();
      const errorMessage = error.response?.data?.message || error.response?.data?.error || '';
      const requestUrl = error.config?.url || '';

      console.warn('🔒 Received 401 Unauthorized:', {
        url: requestUrl,
        message: errorMessage,
        data: error.response?.data
      });

      // Check if this is actually an authentication issue vs authorization issue
      // Don't auto-logout for authorization issues (insufficient permissions)
      const isAuthenticationIssue = 
        errorMessage.toLowerCase().includes('token') ||
        errorMessage.toLowerCase().includes('expired') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('unauthorized') ||
        requestUrl.includes('/Auth/') || // Auth endpoints
        !errorMessage; // No specific message usually means token issue

      if (isAuthenticationIssue) {
        console.warn('🔒 Authentication issue detected - logging out user');
        
        // Log out user immediately (no refresh attempt)
        authState.logout();

        // Show error message
        showErrorToast(
          'Your session has expired. Please log in again.',
          'Session Expired'
        );

        // Redirect to login page
        window.location.href = '/login';

        // Return a more descriptive error
        return Promise.reject(new Error('Authentication failed - session expired'));
      } else {
        console.warn('🔒 Authorization issue detected - not logging out user');
        // This is likely a permission/authorization issue, not authentication
        // Let the component handle the error without logging out
      }
    }

    // Handle other errors normally
    return Promise.reject(error);
  }
);

export default apiClient;