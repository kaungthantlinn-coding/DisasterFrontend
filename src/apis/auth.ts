import apiClient from './client';
import {
  LoginRequest,
  SignupRequest,
  GoogleLoginRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  User,
} from '../types';

// Authentication API functions
export const authApi = {
  // Login with email/password
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/Auth/login', data);
    return response.data;
  },

  // Signup with email/password
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/Auth/signup', data);
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (data: GoogleLoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/Auth/google-login', data);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/Auth/refresh', data);
    return response.data;
  },

  // Logout
  logout: async (refreshToken: string): Promise<boolean> => {
    const response = await apiClient.post('/Auth/logout', { refreshToken });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/Auth/me');
    return response.data;
  },

  // Validate token
  validateToken: async (token: string): Promise<boolean> => {
    const response = await apiClient.post('/Auth/validate', { token });
    return response.data;
  },

  // Get Google Client ID
  getGoogleClientId: async (): Promise<string> => {
    const response = await apiClient.get('/Config/google-client-id');
    return response.data;
  },

  // Forgot password - send reset email
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/Auth/forgot-password', data);
    return response.data;
  },

  // Reset password with token
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/Auth/reset-password', data);
    return response.data;
  },

  // Verify reset token
  verifyResetToken: async (token: string): Promise<{ valid: boolean; message?: string; errorType?: string }> => {
    try {
      // Validate token format before making API call
      if (!token || token.trim().length === 0) {
        return {
          valid: false,
          message: 'No reset token provided. Please check your email link.',
          errorType: 'MISSING_TOKEN'
        };
      }

      // Basic token format validation
      if (token.length < 20) {
        return {
          valid: false,
          message: 'Invalid token format. Please use the complete link from your email.',
          errorType: 'INVALID_FORMAT'
        };
      }

      console.log('🔍 Verifying reset token with backend...');
      const response = await apiClient.post('/Auth/verify-reset-token', { token });
      
      // Map backend response (isValid) to frontend expectation (valid)
      const result = {
        valid: response.data.isValid,
        message: response.data.message,
        errorType: response.data.isValid ? undefined : 'BACKEND_VALIDATION_FAILED'
      };
      
      console.log('✅ Backend token verification result:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Token verification API error:', error);
      
      // Handle specific HTTP error responses
      if (error.response?.status === 400 && error.response?.data) {
        const errorData = error.response.data;
        return {
          valid: false,
          message: errorData.message || 'Invalid or expired token.',
          errorType: 'EXPIRED_OR_INVALID'
        };
      }
      
      if (error.response?.status === 404) {
        return {
          valid: false,
          message: 'Reset token not found. Please request a new password reset link.',
          errorType: 'TOKEN_NOT_FOUND'
        };
      }
      
      if (error.response?.status === 500) {
        return {
          valid: false,
          message: 'Server error occurred. Please try again later or request a new reset link.',
          errorType: 'SERVER_ERROR'
        };
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        return {
          valid: false,
          message: 'Unable to connect to server. Please check your internet connection and try again.',
          errorType: 'NETWORK_ERROR'
        };
      }
      
      // Re-throw other unexpected errors
      throw error;
    }
  },
};