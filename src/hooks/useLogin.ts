import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useErrorHandler, ErrorTracker } from '../utils/errorHandler';
import { getRoleBasedRedirectPath, logRoleBasedRedirection } from '../utils/roleRedirection';
import { getTokenExpirationDate } from '../utils/jwtUtils';

export const useLogin = () => {
  const { handleError, getErrorMessage } = useErrorHandler();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await authService.login(email, password);
      
      if (!result.success) {
        throw result.error;
      }
      
      return result.data;
    },
    onSuccess: (data) => {
      // Check if user is blacklisted before proceeding
      console.log('🔍 Login Success - User data:', data.user);
      console.log('🔍 Login Success - isBlacklisted:', data.user.isBlacklisted);
      
      if (data.user.isBlacklisted) {
        console.log('🚫 User is blacklisted - showing suspension toast');
        // Show toast immediately and prevent login
        toast.error('Your account has been suspended. Please contact support for assistance.', {
          duration: 5000,
        });
        throw new Error('Account suspended');
      }

      // Extract token expiration date
      const expiresAt = getTokenExpirationDate(data.token)?.toISOString();

      // Set auth state with token expiration info
      useAuthStore.getState().setAuth(data.user, data.token, expiresAt);

      // Track successful login
      ErrorTracker.getInstance().trackUserAction('login_success', { userId: data.user.userId });



      // Check for intended destination from location state
      const from = (location.state as any)?.from?.pathname;

      if (from && from !== '/login') {
        // Redirect to the intended destination
        navigate(from, { replace: true });
      } else {
        // Use role-based redirection as fallback
        const redirectPath = getRoleBasedRedirectPath(data.user);
        logRoleBasedRedirection(data.user, redirectPath);
        navigate(redirectPath, { replace: true });
      }
    },
    onError: (error) => {
      console.error('🔥 Login error:', error);
      console.log('🔥 Login error message:', error.message);
      
      // Handle specific error cases
      if (error.message === 'Account suspended') {
        console.log('🚫 Account suspended error caught - not showing additional toast');
        // Don't show additional error toast, suspension message already shown
        return;
      }
      
      // Check if the error indicates a blacklisted/suspended account
      const errorMessage = error.message?.toLowerCase() || '';
      if (errorMessage.includes('blacklisted') || 
          errorMessage.includes('suspended') || 
          errorMessage.includes('banned') ||
          errorMessage.includes('account has been suspended')) {
        console.log('🚫 Blacklisted user detected from API error - showing suspension toast');
        toast.error('Your account has been suspended. Please contact support for assistance.', {
          duration: 5000,
        });
        return;
      }
      
      console.log('🔥 Showing generic login error toast');
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