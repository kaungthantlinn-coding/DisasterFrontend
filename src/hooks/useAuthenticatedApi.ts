import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * Custom hook for making authenticated API calls
 * Ensures API calls are only made when user is properly authenticated
 */
export const useAuthenticatedApi = () => {
  const { isAuthenticated, isInitialized, user, accessToken } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // API is ready when authentication is initialized and user is authenticated
    const ready = isInitialized && isAuthenticated && !!user && !!accessToken;
    setIsReady(ready);
  }, [isInitialized, isAuthenticated, user, accessToken]);

  /**
   * Execute an API call only when authentication is ready
   * @param apiCall - Function that returns a Promise
   * @param fallback - Optional fallback value if not authenticated
   */
  const executeWhenReady = useCallback(async <T>(
    apiCall: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> => {
    if (!isReady) {
      console.warn('🔒 API call skipped - authentication not ready');
      return fallback;
    }

    try {
      return await apiCall();
    } catch (error) {
      console.error('🔒 Authenticated API call failed:', error);
      throw error;
    }
  }, [isReady]);

  /**
   * Check if user has specific role
   */
  const hasRole = (roleName: string): boolean => {
    return user?.roles?.includes(roleName) || false;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roleNames: string[]): boolean => {
    return roleNames.some(role => hasRole(role));
  };

  return {
    isReady,
    isAuthenticated,
    isInitialized,
    user,
    executeWhenReady,
    hasRole,
    hasAnyRole,
  };
};

/**
 * Hook specifically for components that need to wait for authentication
 * before rendering or making API calls
 */
export const useAuthGuard = () => {
  const { isAuthenticated, isInitialized, isLoading } = useAuthStore();
  
  const isAuthReady = isInitialized && !isLoading;
  const shouldShowContent = isAuthReady && isAuthenticated;
  const shouldRedirectToLogin = isAuthReady && !isAuthenticated;

  return {
    isAuthReady,
    shouldShowContent,
    shouldRedirectToLogin,
    isLoading: !isInitialized || isLoading,
  };
};
