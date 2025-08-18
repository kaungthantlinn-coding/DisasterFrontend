import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { isTokenExpired, getTokenExpirationDate } from '../utils/jwtUtils';

// Refresh token 5 minutes before expiration
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useTokenRefresh = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { accessToken, isAuthenticated, refreshToken } = useAuthStore();

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only set up auto-refresh if user is authenticated and has a token
    if (!isAuthenticated || !accessToken) {
      console.log('🔄 Token refresh: Not authenticated or no token, skipping auto-refresh');
      return;
    }

    const setupAutoRefresh = () => {
      try {
        const expirationDate = getTokenExpirationDate(accessToken);
        
        if (!expirationDate) {
          console.warn('🔄 Token refresh: Could not parse token expiration, skipping auto-refresh');
          return;
        }

        const now = new Date();
        const timeUntilExpiry = expirationDate.getTime() - now.getTime();
        const timeUntilRefresh = timeUntilExpiry - REFRESH_BUFFER_MS;

        console.log('🔄 Token refresh setup:', {
          expirationDate: expirationDate.toISOString(),
          timeUntilExpiry: Math.round(timeUntilExpiry / 1000 / 60), // minutes
          timeUntilRefresh: Math.round(timeUntilRefresh / 1000 / 60), // minutes
          bufferMinutes: REFRESH_BUFFER_MS / 1000 / 60
        });

        // If token is already expired or will expire very soon, refresh immediately
        if (timeUntilRefresh <= 0) {
          console.log('🔄 Token refresh: Token expires soon, refreshing immediately');
          refreshToken();
          return;
        }

        // Set up automatic refresh
        intervalRef.current = setTimeout(async () => {
          console.log('🔄 Token refresh: Auto-refresh triggered');
          const success = await refreshToken();
          
          if (success) {
            console.log('🔄 Token refresh: Auto-refresh successful, setting up next refresh');
            // Set up the next refresh cycle
            setupAutoRefresh();
          } else {
            console.warn('🔄 Token refresh: Auto-refresh failed');
          }
        }, timeUntilRefresh);

        console.log(`🔄 Token refresh: Auto-refresh scheduled in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`);
      } catch (error) {
        console.error('🔄 Token refresh: Error setting up auto-refresh:', error);
      }
    };

    setupAutoRefresh();

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
        console.log('🔄 Token refresh: Auto-refresh cleanup');
      }
    };
  }, [accessToken, isAuthenticated, refreshToken]);

  // Manual refresh function that can be called by components
  const manualRefresh = async () => {
    console.log('🔄 Token refresh: Manual refresh triggered');
    const success = await refreshToken();
    
    if (success) {
      console.log('🔄 Token refresh: Manual refresh successful');
      // The useEffect will automatically set up the next auto-refresh
    } else {
      console.warn('🔄 Token refresh: Manual refresh failed');
    }
    
    return success;
  };

  return {
    manualRefresh,
    isTokenExpired: accessToken ? isTokenExpired(accessToken) : false,
  };
};