import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { authApi } from '../apis/auth';
import { useAuthStore } from '../stores/authStore';
import { useErrorHandler, ErrorTracker } from '../utils/errorHandler';
import { getRoleBasedRedirectPath, logRoleBasedRedirection } from '../utils/roleRedirection';
import { getTokenExpirationDate } from '../utils/jwtUtils';
import { SendOTPRequest, VerifyOTPRequest } from '../types';

// Hook for sending OTP to email
export const useSendEmailOTP = () => {
  const { handleError, getErrorMessage } = useErrorHandler();
  
  return useMutation({
    mutationFn: async (data: SendOTPRequest) => {
      const result = await authApi.sendOTP(data);
      return result;
    },
    onSuccess: (data, variables) => {
      // Track successful OTP send
      ErrorTracker.getInstance().trackUserAction('otp_send_success', { 
        email: variables.email,
        purpose: variables.purpose || 'login'
      });
      
      toast.success(data.message || 'Verification code sent to your email!');
    },
    onError: (error: any, variables) => {
      // Track failed OTP send
      ErrorTracker.getInstance().track(error as Error, {
        component: 'useSendEmailOTP',
        action: 'send_otp_mutation',
        additionalData: { 
          email: variables.email,
          purpose: variables.purpose
        }
      });
      
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
    retry: (failureCount, error) => {
      // Don't retry on rate limiting or client errors
      const errorMessage = getErrorMessage(error);
      if (errorMessage.includes('Too many') || errorMessage.includes('Invalid email')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

// Hook for verifying OTP and logging in
export const useVerifyEmailOTP = () => {
  const { handleError, getErrorMessage } = useErrorHandler();
  const navigate = useNavigate();
  const location = useLocation();
  
  return useMutation({
    mutationFn: async (data: VerifyOTPRequest) => {
      const result = await authApi.verifyOTP(data);
      return result;
    },
    onSuccess: (data, variables) => {
      // Extract token expiration date
      const expiresAt = getTokenExpirationDate(data.accessToken)?.toISOString();

      // Set auth state with token expiration info
      useAuthStore.getState().setAuth(data.user, data.accessToken, data.refreshToken, expiresAt);

      // Track successful login
      const actionType = data.isNewUser ? 'otp_signup_success' : 'otp_login_success';
      ErrorTracker.getInstance().trackUserAction(actionType, { 
        userId: data.user.userId,
        email: variables.email,
        isNewUser: data.isNewUser
      });



      // Show appropriate success message
      const successMessage = data.isNewUser 
        ? 'Welcome! Your account has been created and you are now logged in.'
        : 'Successfully logged in with verification code!';
      
      toast.success(successMessage);

      // Check for intended destination from location state
      const from = (location.state as any)?.from?.pathname;

      if (from && from !== '/login' && from !== '/email-otp') {
        // Redirect to the intended destination
        navigate(from, { replace: true });
      } else {
        // Use role-based redirection as fallback
        const redirectPath = getRoleBasedRedirectPath(data.user);
        logRoleBasedRedirection(data.user, redirectPath);
        navigate(redirectPath, { replace: true });
      }
    },
    onError: (error: any, variables) => {
      // Track failed OTP verification
      ErrorTracker.getInstance().track(error as Error, {
        component: 'useVerifyEmailOTP',
        action: 'verify_otp_mutation',
        additionalData: { 
          email: variables.email,
          purpose: variables.purpose
        }
      });
      
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
    retry: (failureCount, error) => {
      // Don't retry on invalid code or rate limiting
      const errorMessage = getErrorMessage(error);
      if (errorMessage.includes('Invalid') || 
          errorMessage.includes('expired') || 
          errorMessage.includes('Too many')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

// Hook for managing OTP countdown timer
export const useOTPTimer = (initialSeconds: number = 300) => { // 5 minutes default
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const startTimer = (customSeconds?: number) => {
    const timerDuration = customSeconds || initialSeconds;
    setSeconds(timerDuration);
    setIsActive(true);

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          setIsActive(false);
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return interval;
  };

  const resetTimer = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    seconds,
    isActive,
    startTimer,
    resetTimer,
    formatTime: () => formatTime(seconds),
    isExpired: seconds === 0
  };
};

// Hook for OTP resend functionality with rate limiting
export const useOTPResend = () => {
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const sendOTPMutation = useSendEmailOTP();

  const resendOTP = async (email: string, purpose?: 'login' | 'signup' | 'verification') => {
    if (!canResend) {
      toast.error(`Please wait ${resendCooldown} seconds before requesting another code.`);
      return;
    }

    try {
      await sendOTPMutation.mutateAsync({ email, purpose });
      
      // Start cooldown (60 seconds)
      setCanResend(false);
      setResendCooldown(60);
      
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Resend OTP failed:', error);
    }
  };

  return {
    resendOTP,
    canResend,
    resendCooldown,
    isResending: sendOTPMutation.isPending
  };
};