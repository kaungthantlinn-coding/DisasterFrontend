import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useErrorHandler, ErrorTracker } from '../utils/errorHandler';

export const useGoogleLogin = () => {
  const { handleError, getErrorMessage } = useErrorHandler();

  return useMutation({
    mutationFn: async (credential: string) => {
      const result = await authService.googleLogin(credential);
      
      if (!result.success) {
        throw result.error;
      }
      
      return result.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.user, data.token, data.refreshToken);
      // Track successful login after auth store is updated
      ErrorTracker.getInstance().trackUserAction('google_login_success', { userId: data.user.userId });
    },
    onError: (error) => {
      handleError(error as Error, {
        component: 'useGoogleLogin',
        action: 'google_login_mutation',
      });
    },
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      const errorMessage = getErrorMessage(error);
      if (errorMessage.includes('unauthorized') || errorMessage.includes('Invalid')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useGoogleClientId = () => {
  // Use environment variable directly instead of API call
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  // Validate that client ID is configured and not a placeholder
  const isValidClientId = clientId && 
    clientId !== 'YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE' && 
    !clientId.includes('123456789-abcdefghijklmnopqrstuvwxyz');
  
  return {
    data: isValidClientId ? { clientId } : null,
    isLoading: false,
    error: !isValidClientId ? new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.') : null
  };
};

// Hook for Google login error handling
export const useGoogleLoginError = (error: Error | null) => {
  const { getErrorMessage } = useErrorHandler();
  
  if (!error) return null;
  
  // Provide specific error messages for Google login issues
  const message = getErrorMessage(error);
  
  if (message.includes('popup_closed_by_user')) {
    return 'Google sign-in was cancelled. Please try again.';
  }
  
  if (message.includes('access_denied')) {
    return 'Access denied. Please grant permission to continue.';
  }
  
  if (message.includes('invalid_client')) {
    return 'Google sign-in configuration error. Please contact support.';
  }
  
  return message;
};

// Hook for tracking Google login events
export const useGoogleLoginTracking = () => {
  const { trackAction } = useErrorHandler();
  
  return {
    trackGoogleLoginAttempt: () => {
      trackAction('google_login_attempt');
    },
    trackGoogleLoginSuccess: (userId: string) => {
      trackAction('google_login_success', { userId });
    },
    trackGoogleLoginFailure: (error: string) => {
      trackAction('google_login_failure', { error });
    },
    trackGoogleScriptLoad: () => {
      trackAction('google_script_loaded');
    },
    trackGoogleScriptError: (error: string) => {
      trackAction('google_script_error', { error });
    },
  };
};