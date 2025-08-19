import apiClient from './client';
import {
  LoginRequest,
  SignupRequest,
  GoogleLoginRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SendOTPRequest,
  VerifyOTPRequest,
  SendOTPResponse,
  VerifyOTPResponse,
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

  // Logout - now uses HTTP-only cookies
  logout: async (): Promise<boolean> => {
    const response = await apiClient.post('/Auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/Auth/me');
    console.log('🔍 getCurrentUser API Response:', response.data);
    console.log('🔍 User name field:', response.data?.name);
    console.log('🔍 All user fields:', Object.keys(response.data || {}));
    
    // Map API response to User type to handle different field names
    const apiUser = response.data;
    const mappedUser: User = {
      userId: apiUser.userId || apiUser.user_id || apiUser.auth_id || apiUser.id || '',
      name: apiUser.name || apiUser.fullName || '',
      email: apiUser.email || '',
      photoUrl: apiUser.photoUrl || apiUser.photo_url || apiUser.picture || apiUser.avatar || apiUser.profile_picture,
      roles: Array.isArray(apiUser.roles) ? apiUser.roles : (apiUser.role ? [apiUser.role] : ['user'])
    };
    
    console.log('🔍 Mapped User:', mappedUser);
    return mappedUser;
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

      const response = await apiClient.post('/Auth/verify-reset-token', { token });
      
      // Map backend response (isValid) to frontend expectation (valid)
      const result = {
        valid: response.data.isValid,
        message: response.data.message,
        errorType: response.data.isValid ? undefined : 'BACKEND_VALIDATION_FAILED'
      };
      
      return result;
    } catch (error: any) {
      
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

  // Send OTP to email
  sendOTP: async (data: SendOTPRequest): Promise<SendOTPResponse> => {
    try {
      const response = await apiClient.post('/Auth/send-otp', data);
      
      return response.data;
    } catch (error: any) {
      
      // Handle specific HTTP error responses
      if (error.response?.status === 429) {
        const errorData = error.response.data;
        throw new Error(errorData.message || 'Too many requests. Please wait before requesting another OTP.');
      }
      
      if (error.response?.status === 400 && error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || 'Invalid email address provided.');
      }
      
      if (error.response?.status === 500) {
        throw new Error('Server error occurred. Please try again later.');
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      
      // Re-throw other unexpected errors
      throw error;
    }
  },

  // Verify OTP and login/signup
  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    try {
      // Validate OTP format before making API call
      if (!data.otp || data.otp.trim().length === 0) {
        throw new Error('Please enter the verification code.');
      }

      // Basic OTP format validation (assuming 6-digit codes)
      if (data.otp.length !== 6 || !/^\d{6}$/.test(data.otp)) {
        throw new Error('Please enter a valid 6-digit verification code.');
      }

      const response = await apiClient.post('/Auth/verify-otp', {
        email: data.email,
        otp: data.otp,
        purpose: data.purpose || 'login'
      });
      
      return response.data;
    } catch (error: any) {
      // Enhanced error logging for debugging
      
      // Handle specific HTTP error responses
      if (error.response?.status === 400 && error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || errorData.title || 'Invalid or expired verification code.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Verification code not found. Please request a new code.');
      }
      
      if (error.response?.status === 429) {
        throw new Error('Too many verification attempts. Please request a new code.');
      }
      
      if (error.response?.status === 500) {
        throw new Error('Server error occurred. Please try again later.');
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      
      // Re-throw other unexpected errors
      throw error;
    }
  },
};