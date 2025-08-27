import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { useErrorHandler, ErrorTracker } from "../utils/errorHandler";
import {
  getRoleBasedRedirectPath,
  logRoleBasedRedirection,
} from "../utils/roleRedirection";
import { getTokenExpirationDate } from '../utils/jwtUtils';

export const useGoogleLogin = () => {
  const { handleError, getErrorMessage } = useErrorHandler();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: async (credential: string) => {
      const result = await authService.googleLogin(credential);

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: (data) => {
      // Check if user is blacklisted before proceeding
      console.log('🔍 Google Login Success - User data:', data.user);
      console.log('🔍 Google Login Success - isBlacklisted:', data.user.isBlacklisted);
      
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

      useAuthStore.getState().setAuth(data.user, data.token, expiresAt);
      // Track successful login
      ErrorTracker.getInstance().trackUserAction('google_login_success', { userId: data.user.userId });

   // Check for intended destination from location state
      const from = (location.state as any)?.from?.pathname;

      if (from && from !== "/login") {
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
      console.error('🔥 Google login error:', error);
      console.log('🔥 Google login error message:', error.message);
      console.log('🔥 Google login error details:', error);
      
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
      
      console.log('🔥 Showing generic Google login error toast');
      // Show generic error for other cases
      toast.error('Google login failed. Please try again.');
      
      handleError(error as Error, {
        component: "useGoogleLogin",
        action: "google_login_mutation",
      });
    },
    retry: (failureCount, error) => {
      const errorMessage = getErrorMessage(error);
      if (
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("Invalid")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useGoogleClientId = () => {
 // Get client ID from environment variables
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Validate client ID
  const isValidClientId = clientId && 
    clientId !== 'YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE' && 
    !clientId.includes('123456789-abcdefghijklmnopqrstuvwxyz');
  
  return {
    data: isValidClientId ? { clientId } : null,
    isLoading: false,
    error: !isValidClientId
      ? new Error(
          "Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file."
        )
      : null,
  };
};

// Hook for Google login error handling
export const useGoogleLoginError = (error: Error | null) => {
  const { getErrorMessage } = useErrorHandler();

  if (!error) return null;

  // Provide specific error messages for Google login issues
  const message = getErrorMessage(error);

  if (message.includes("popup_closed_by_user")) {
    return "Google sign-in was cancelled. Please try again.";
  }

  if (message.includes("access_denied")) {
    return "Access denied. Please grant permission to continue.";
  }

  if (message.includes("invalid_client")) {
    return "Google sign-in configuration error. Please contact support.";
  }

  return message;
};

// Hook for tracking Google login events
export const useGoogleLoginTracking = () => {
  const { trackAction } = useErrorHandler();

  return {
    trackGoogleLoginAttempt: () => {
      trackAction("google_login_attempt");
    },
    trackGoogleLoginSuccess: (userId: string) => {
      trackAction("google_login_success", { userId });
    },
    trackGoogleLoginFailure: (error: string) => {
      trackAction("google_login_failure", { error });
    },
    trackGoogleScriptLoad: () => {
      trackAction("google_script_loaded");
    },
    trackGoogleScriptError: (error: string) => {
      trackAction("google_script_error", { error });
    },
  };
};
