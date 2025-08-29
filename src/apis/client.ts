import axios, { AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { isTokenExpired } from '../utils/jwtUtils';
import { showErrorToast } from '../utils/notifications';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5057/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Helper function to check if current page is public
const isPublicPage = () => {
  const publicPaths = ['/', '/login', '/signup', '/about', '/contact', '/terms', '/privacy', '/what-we-do', '/get-involved', '/donate', '/partnership'];
  return publicPaths.includes(window.location.pathname);
};

// Request interceptor to add auth token and check expiration
apiClient.interceptors.request.use(
  (config) => {
    const authState = useAuthStore.getState();
    const { accessToken, isAuthenticated, isInitialized } = authState;

    // Skip auth checks for auth endpoints
    const isAuthEndpoint = config.url?.includes('/Auth/');
    
    if (!isAuthEndpoint) {
      // Check if authentication is required but not available
      if (!isAuthenticated || !accessToken) {
        console.warn('🔒 No authentication - rejecting request');
        return Promise.reject(new Error('Authentication required'));
      }

      // Check if authentication is still initializing
      if (!isInitialized) {
        console.warn('🔒 Authentication not initialized - rejecting request');
        return Promise.reject(new Error('Authentication initializing'));
      }

      // Check if token is expired
      if (isTokenExpired(accessToken)) {
        console.warn('🔒 Token expired - rejecting request and logging out');

        // Log out user immediately
        authState.logout();

        // Only redirect to login if not on a public page
        if (!isPublicPage()) {
          // Show error message
          showErrorToast(
            'Your session has expired. Please log in again.',
            'Session Expired'
          );

          // Redirect to login
          window.location.href = '/login';
        }

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

// Response interceptor with automatic token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized responses (token expired/invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const authState = useAuthStore.getState();
      const errorMessage = error.response?.data?.message || error.response?.data?.error || '';
      const requestUrl = originalRequest?.url || '';

      console.warn('🔒 Received 401 Unauthorized:', {
        url: requestUrl,
        message: errorMessage,
        data: error.response?.data
      });

      // Check if this is actually an authentication issue vs authorization issue
      // Don't auto-logout for authorization issues (insufficient permissions)
      // Also skip auto-logout for auth endpoints to let auth hooks handle blacklist errors
      const isAuthEndpoint = requestUrl.includes('/Auth/');
      const isRefreshTokenInvalid = errorMessage.toLowerCase().includes('invalid or expired refresh token');

      if (isRefreshTokenInvalid) {
        console.warn('🔒 Invalid refresh token detected - logging out user immediately');
        authState.logout();
        // Only redirect to login if not on a public page
        if (!isPublicPage()) {
          window.location.href = '/login';
        }
        return Promise.reject(new Error('Invalid refresh token'));
      }

      const isAuthenticationIssue = 
        errorMessage.toLowerCase().includes('token') ||
        errorMessage.toLowerCase().includes('expired') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('unauthorized') ||
        !errorMessage;

      if (isAuthenticationIssue && !isAuthEndpoint) {
        console.warn('🔒 Authentication issue detected - attempting token refresh');
        
        // Mark request as retried to prevent infinite loops
        originalRequest._retry = true;
        
        // Try to refresh the token
        const refreshed = await authState.refreshToken();
        
        if (refreshed) {
          console.log('🔒 Token refreshed successfully - retrying original request');
          
          // Update the authorization header with new token
          const newToken = useAuthStore.getState().accessToken;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          
          // Retry the original request
          return apiClient(originalRequest);
        } else {
          console.warn('🔒 Token refresh failed - logging out user');
          
          // Refresh failed, log out user
          authState.logout();

          // Only redirect to login if not on a public page
          if (!isPublicPage()) {
            // Show error message
            showErrorToast(
              'Your session has expired. Please log in again.',
              'Session Expired'
            );

            // Redirect to login page
            window.location.href = '/login';
          }

          // Return a more descriptive error
          return Promise.reject(new Error('Authentication failed - session expired'));
        }
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

// Extend AxiosRequestConfig to include _retry flag
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

export default apiClient;