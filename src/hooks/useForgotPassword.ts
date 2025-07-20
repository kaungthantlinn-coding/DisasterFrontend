import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { authApi } from '../apis/auth';
import { ForgotPasswordRequest } from '../types';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      return await authApi.forgotPassword(data);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset email sent successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to send password reset email. Please try again.';
      toast.error(errorMessage);
    },
  });
};
