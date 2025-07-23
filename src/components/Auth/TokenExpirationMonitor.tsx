/**
 * Token Expiration Monitor Component
 * Initializes and manages JWT token expiration monitoring
 */

import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { tokenExpirationService } from '../../services/tokenExpirationService';

interface TokenExpirationMonitorProps {
  children?: React.ReactNode;
}

/**
 * Component that monitors JWT token expiration and automatically logs out users
 * when their tokens expire. Should be placed high in the component tree.
 */
const TokenExpirationMonitor: React.FC<TokenExpirationMonitorProps> = ({ children }) => {
  const { isAuthenticated, accessToken } = useAuthStore();

  useEffect(() => {
    // Start monitoring when user is authenticated
    if (isAuthenticated && accessToken) {
      console.log('🔒 TokenExpirationMonitor: Starting token expiration monitoring');
      console.log('🔒 Auth state:', { isAuthenticated, hasToken: !!accessToken });
      tokenExpirationService.startMonitoring();

      // Force an immediate check
      setTimeout(() => {
        console.log('🔒 Forcing initial token check');
        tokenExpirationService.forceCheck();
      }, 1000);
    } else {
      // Stop monitoring when user is not authenticated
      console.log('🔒 TokenExpirationMonitor: Stopping token expiration monitoring');
      console.log('🔒 Auth state:', { isAuthenticated, hasToken: !!accessToken });
      tokenExpirationService.stopMonitoring();
    }

    // Cleanup function
    return () => {
      // Don't stop monitoring on component unmount - let it run globally
      // The service will handle stopping when user logs out
    };
  }, [isAuthenticated, accessToken]);

  // Listen for visibility changes to check token when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        // Force check token when tab becomes visible
        tokenExpirationService.forceCheck();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  // Listen for focus events to check token when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        // Force check token when window gains focus
        tokenExpirationService.forceCheck();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated]);

  // This component doesn't render anything visible
  return <>{children}</>;
};

export default TokenExpirationMonitor;

/**
 * Hook for accessing token expiration monitoring functionality
 */
export const useTokenExpirationMonitor = () => {
  const { isAuthenticated, accessToken, isTokenExpired } = useAuthStore();

  return {
    isMonitoring: tokenExpirationService.isActive(),
    isAuthenticated,
    hasToken: !!accessToken,
    isTokenExpired: isTokenExpired(),
    forceCheck: () => tokenExpirationService.forceCheck(),
    debugToken: () => tokenExpirationService.debugCurrentToken(),
    timeRemaining: tokenExpirationService.getCurrentTokenTimeRemaining(),
  };
};

/**
 * Debug component for development - shows token status
 */
export const TokenDebugInfo: React.FC = () => {
  const {
    isMonitoring,
    isAuthenticated,
    hasToken,
    isTokenExpired,
    timeRemaining,
    debugToken,
  } = useTokenExpirationMonitor();

  // Force re-render every second to show live updates
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick => tick + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-xs font-mono z-50">
      <div className="font-bold mb-2">🔒 Token Debug</div>
      <div>Monitoring: {isMonitoring ? '✅' : '❌'}</div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Has Token: {hasToken ? '✅' : '❌'}</div>
      <div>Token Expired: {isTokenExpired ? '❌' : '✅'}</div>
      <div>Time Remaining: {formatTime(timeRemaining)}</div>
      <div className="mt-2 space-x-1">
        <button
          onClick={debugToken}
          className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
        >
          Debug Token
        </button>
        <button
          onClick={() => tokenExpirationService.startMonitoring()}
          className="px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-700"
        >
          Start Monitor
        </button>
        <button
          onClick={() => tokenExpirationService.forceCheck()}
          className="px-2 py-1 bg-yellow-600 rounded text-xs hover:bg-yellow-700"
        >
          Force Check
        </button>
      </div>
    </div>
  );
};
