import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../apis/auth';
import { ResetPasswordRequest } from '../types';

// Helper function to decode URL components safely
const safeDecodeURIComponent = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    console.warn('⚠️ Failed to decode URI component:', str);
    return str;
  }
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      console.log('🔐 Starting password reset process...');
      console.log('🔐 Reset data:', {
        hasToken: !!data.token,
        tokenLength: data.token?.length || 0,
        hasNewPassword: !!data.newPassword,
        hasConfirmPassword: !!data.confirmPassword,
        passwordsMatch: data.newPassword === data.confirmPassword
      });
      
      const result = await authApi.resetPassword(data);
      console.log('✅ Password reset completed successfully');
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Password reset successful - redirecting user');
      toast.success(data.message || 'Password reset successfully! You can now log in with your new password.');
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (error: any) => {
      console.error('❌ Password reset failed:', {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Enhanced error logging for backend responses
      if (error.response?.data) {
        console.error('📜 Backend Error Details:', {
          message: error.response.data.message,
          details: error.response.data.details || 'No additional details',
          errorCode: error.response.data.errorCode || 'No error code',
          timestamp: new Date().toISOString(),
          endpoint: '/Auth/reset-password',
          requestData: 'Hidden for security'
        });
      }
      
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
      console.log('🔍 Starting token verification process...');
      console.log('🔍 Token details:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
        urlDecoded: token === safeDecodeURIComponent(token) ? 'Already decoded' : 'Needs decoding'
      });
      
      try {
        const result = await authApi.verifyResetToken(token);
        
        console.log('✅ Token verification completed:', {
          valid: result.valid,
          message: result.message,
          errorType: result.errorType
        });
        
        return result;
      } catch (error: any) {
        console.error('❌ Token verification failed with unexpected error:', {
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack?.substring(0, 200) + '...'
        });
        
        // Return a user-friendly error instead of throwing
        return {
          valid: false,
          message: 'An unexpected error occurred while verifying your reset token. Please try requesting a new password reset link.',
          errorType: 'UNEXPECTED_ERROR'
        };
      }
    },
    enabled: !!token,
    retry: (failureCount, error: any) => {
      // Only retry network errors, up to 2 times
      if (error?.errorType === 'NETWORK_ERROR' && failureCount < 2) {
        console.log(`🔄 Retrying token verification (attempt ${failureCount + 1})`);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    refetchOnWindowFocus: false,
    staleTime: 0, // Always verify token freshly
  });
};
