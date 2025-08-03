import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../apis/auth';
import { ResetPasswordRequest } from '../types';

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const result = await authApi.resetPassword(data);
      return result;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successfully! You can now log in with your new password.');
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          'Failed to reset password. Please try again or request a new reset link.';
      
      toast.error(errorMessage);
    },
  });
};

export const useVerifyResetToken = (token: string) => {
  return useQuery({
    queryKey: ['verifyResetToken', token],
    queryFn: async () => {
      try {
        const result = await authApi.verifyResetToken(token);
        return result;
      } catch (error: any) {
        // Return a user-friendly error instead of throwing
        return {
          valid: false,
          message: 'An unexpected error occurred while verifying your reset token. Please try requesting a new password reset link.',
          errorType: 'UNEXPECTED_ERROR'
        };
      }
    },
    enabled: !!token,
    retry: (failureCount: number, error: any) => {
      // Only retry network errors, up to 2 times
      if (error?.errorType === 'NETWORK_ERROR' && failureCount < 2) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
    refetchOnWindowFocus: false,
    staleTime: 0, // Always verify token freshly
  });
};
