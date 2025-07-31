import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { SignupRequest } from '../types';
import { ErrorTracker } from '../utils/errorHandler';

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignupRequest) => {
      const result = await authService.signup(
        data.fullName,
        data.email,
        data.password,
        data.confirmPassword,
        data.agreeToTerms
      );

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: (data) => {
      // Set authentication state
      useAuthStore.getState().setAuth(data.user, data.token, data.refreshToken);

      ErrorTracker.getInstance().trackUserAction('signup_success', { userId: data.user.userId });

      // Show success message
      toast.success('Account created successfully! Welcome to DisasterWatch.', {
        duration: 5000,
        position: 'top-center',
      });

      // Redirect to dashboard or home based on user role
      const redirectPath = data.user.roles.includes('admin') ? '/admin' : '/dashboard';
      navigate(redirectPath, { replace: true });
    },
    onError: (error: Error) => {
      // Error is already tracked in authService, so just handle UI feedback
      // Show error toast
      toast.error(error.message, {
        duration: 6000,
        position: 'top-center',
      });
    },
  });
};
