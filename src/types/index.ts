// User types
export interface User {
  userId: string;
  name: string;
  email: string;
  photoUrl?: string;
  roles: string[];
}

// Authentication request types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface GoogleLoginRequest {
  idToken: string;
  deviceInfo?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Authentication response types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// Google types
declare global {
  interface Window {
    google: any;
  }
}