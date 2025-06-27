import apiClient from './client';
import {
  LoginRequest,
  SignupRequest,
  GoogleLoginRequest,
  RefreshTokenRequest,
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
};