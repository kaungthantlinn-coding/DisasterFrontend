import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useErrorHandler, ErrorTracker } from '../utils/errorHandler';

export const useLogin = () => {
  const { handleError, getErrorMessage } = useErrorHandler();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await authService.login(email, password);
      
      if (!result.success) {
        throw result.error;
      }
      
      return result.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.user, data.token, data.refreshToken);
      ErrorTracker.getInstance().trackUserAction('login_success', { userId: data.user.userId });
    },
    onError: (error) => {
      handleError(error as Error, {
        component: 'useLogin',
        action: 'login_mutation',
      });
    },
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      const errorMessage = getErrorMessage(error);
      if (errorMessage.includes('unauthorized') || errorMessage.includes('Invalid credentials')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for getting user-friendly error messages
export const useLoginError = (error: Error | null) => {
  const { getErrorMessage } = useErrorHandler();
  
  if (!error) return null;
  
  return getErrorMessage(error);
};

// Hook for tracking login attempts
export const useLoginTracking = () => {
  const { trackAction } = useErrorHandler();
  
  return {
    trackLoginAttempt: (email: string) => {
      trackAction('login_attempt', { email });
    },
    trackLoginSuccess: (userId: string) => {
      trackAction('login_success', { userId });
    },
    trackLoginFailure: (error: string) => {
      trackAction('login_failure', { error });
    },
  };
};