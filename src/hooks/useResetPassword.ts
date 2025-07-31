import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../apis/auth';
import { ResetPasswordRequest } from '../types';

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      return await authApi.resetPassword(data);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successfully!');
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
    },
  });
};

export const useVerifyResetToken = (token: string) => {
  return useQuery({
    queryKey: ['verifyResetToken', token],
    queryFn: async () => {
      console.log('🔍 Verifying reset token:', token ? `${token.substring(0, 20)}...` : 'No token');
      try {
        const result = await authApi.verifyResetToken(token);
        console.log('✅ Token verification result:', result);
        return result;
      } catch (error) {
        console.error('❌ Token verification failed:', error);
        throw error;
      }
    },
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
