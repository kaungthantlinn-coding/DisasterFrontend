import { apiService } from './api';
import { errorHandler, Result, ErrorTracker } from '../utils/errorHandler';
import { User } from '../types';
import { extractPhotoUrl } from '../utils/avatarUtils';

export interface ApiUser {
  userId?: string;    // Direct userId field from API
  auth_id?: string;   // Backend primary key
  user_id?: string;   // Backend user identifier
  id?: string;        // Fallback for other endpoints
  email: string;
  name: string;
  fullName?: string;  // Alternative name field
  displayName?: string; // Display name field
  role?: string;
  roles?: string[];   // Backend might return roles array
  // Photo URL fields from various OAuth providers
  photoUrl?: string;        // Direct photoUrl field from API
  photo_url?: string;       // Backend uses photo_url
  picture?: string;         // Google OAuth standard field
  avatar?: string;          // Generic avatar field
  profile_picture?: string; // Alternative profile picture field
  createdAt?: string;
  updatedAt?: string;
  isBlacklisted?: boolean;  // Blacklist status
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface GoogleLoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Helper function to convert API user to app user
const mapApiUserToUser = (apiUser: ApiUser): User => {
  console.log('🔍 AuthService - Raw API User Data:', apiUser);
  console.log('🔍 AuthService - Available fields:', Object.keys(apiUser || {}));
  
  // Extract userId from various possible fields (including direct userId)
  const userId = apiUser.userId || apiUser.user_id || apiUser.auth_id || apiUser.id || '';
  console.log('🔍 AuthService - UserId mapping:', {
    userId: apiUser.userId,
    user_id: apiUser.user_id,
    auth_id: apiUser.auth_id,
    id: apiUser.id,
    final: userId
  });
  
  // Extract name from various possible fields
  const name = apiUser.name || apiUser.fullName || apiUser.displayName || '';
  console.log('🔍 AuthService - Name mapping:', {
    name: apiUser.name,
    fullName: apiUser.fullName,
    displayName: apiUser.displayName,
    final: name
  });
  
  // Extract roles from various possible formats
  let roles: string[] = [];
  if (apiUser.roles && Array.isArray(apiUser.roles)) {
    roles = apiUser.roles;
  } else if (apiUser.role) {
    roles = [apiUser.role];
  } else {
    roles = ['user']; // Default role
  }
  console.log('🔍 AuthService - Roles mapping:', {
    roles: apiUser.roles,
    role: apiUser.role,
    final: roles
  });
  
  // Use the centralized photo URL extraction utility
  const photoUrl = extractPhotoUrl(apiUser);
  
  const mappedUser = {
    userId,
    name,
    email: apiUser.email,
    photoUrl,
    roles,
    isBlacklisted: apiUser.isBlacklisted || false,
  };
  
  console.log('🔍 AuthService - Final mapped user:', mappedUser);
  return mappedUser;
};

// Helper function to convert API response to app response
const mapApiResponse = (apiResponse: any) => {
  console.log('🔍 AuthService - Complete API Response:', apiResponse);
  console.log('🔍 AuthService - API Response keys:', Object.keys(apiResponse || {}));
  
  // Handle different possible response structures
  let user: ApiUser;
  
  if (apiResponse.user) {
    // Standard response with user object
    console.log('🔍 AuthService - Using apiResponse.user');
    user = apiResponse.user;
  } else if (apiResponse.auth_id || apiResponse.user_id || apiResponse.email) {
    // Direct user data in response
    console.log('🔍 AuthService - Using direct user data from response');
    user = apiResponse;
  } else {
    // Fallback - create empty user
    console.log('🔍 AuthService - Using fallback empty user');
    user = {
      email: '',
      name: '',
    };
  }
  
  console.log('🔍 AuthService - Selected user object:', user);
  
  const mappedResponse = {
    user: mapApiUserToUser(user),
    token: apiResponse.token || apiResponse.accessToken || '',
    refreshToken: apiResponse.refreshToken || '',
  };
  
  console.log('🔍 AuthService - Final mapped response:', mappedResponse);
  return mappedResponse;
};

export const authService = {
  async login(email: string, password: string): Promise<Result<LoginResponse>> {
    try {
      ErrorTracker.getInstance().trackUserAction('login_attempt', { email });

      const apiData = await errorHandler.withRetry(
        () => apiService.auth.login(email, password),
        {
          maxRetries: 2,
          shouldRetry: (error) => {
            // Don't retry on authentication errors
            return !(error.message.includes('401') || error.message.includes('Invalid credentials'));
          },
        }
      );

      const data = mapApiResponse(apiData);
      ErrorTracker.getInstance().trackUserAction('login_success', { userId: data.user.userId });
      return { success: true, data };
    } catch (error) {
      ErrorTracker.getInstance().track(error as Error, {
        component: 'AuthService',
        action: 'login',
        additionalData: { email },
      });

      return {
        success: false,
        error: errorHandler.fromAxiosError(error)
      };
    }
  },

  async signup(fullName: string, email: string, password: string, confirmPassword: string, agreeToTerms: boolean): Promise<Result<LoginResponse>> {
    try {
      ErrorTracker.getInstance().trackUserAction('signup_attempt', { email });

      const apiData = await errorHandler.withRetry(
        () => apiService.auth.signup(fullName, email, password, confirmPassword, agreeToTerms),
        {
          maxRetries: 2,
          shouldRetry: (error) => {
            // Don't retry on validation errors or conflicts
            return !(error.message.includes('400') || error.message.includes('409'));
          },
        }
      );

      const data = mapApiResponse(apiData);
      ErrorTracker.getInstance().trackUserAction('signup_success', { userId: data.user.userId });
      return { success: true, data };
    } catch (error) {
      ErrorTracker.getInstance().track(error as Error, {
        component: 'AuthService',
        action: 'signup',
        additionalData: { email },
      });

      return {
        success: false,
        error: errorHandler.fromAxiosError(error)
      };
    }
  },

  async googleLogin(credential: string): Promise<Result<GoogleLoginResponse>> {
    try {
      ErrorTracker.getInstance().trackUserAction('google_login_attempt');
      
      const apiData = await errorHandler.withRetry(
        () => apiService.auth.googleLogin(credential),
        { maxRetries: 2 }
      );
      
      const data = mapApiResponse(apiData);
      
      ErrorTracker.getInstance().trackUserAction('google_login_success', { userId: data.user.userId });
      return { success: true, data };
    } catch (error) {
      ErrorTracker.getInstance().track(error as Error, {
        component: 'AuthService',
        action: 'google_login',
      });
      
      return { 
        success: false, 
        error: errorHandler.fromAxiosError(error) 
      };
    }
  },

  async logout(): Promise<Result<void>> {
    try {
      ErrorTracker.getInstance().trackUserAction('logout_attempt');
      
      await apiService.auth.logout();
      
      ErrorTracker.getInstance().trackUserAction('logout_success');
      return { success: true, data: undefined };
    } catch (error) {
      ErrorTracker.getInstance().track(error as Error, {
        component: 'AuthService',
        action: 'logout',
      });
      
      // Even if logout fails on server, we should clear local state
      return { success: true, data: undefined };
    }
  },

  async getProfile(): Promise<Result<User>> {
    try {
      console.log('🔍 AuthService - Getting profile from API...');
      const apiData = await errorHandler.withRetry(
        () => apiService.auth.getProfile(),
        { maxRetries: 3 }
      );
      
      console.log('🔍 AuthService - Profile API response:', apiData);
      const data = mapApiUserToUser(apiData);
      console.log('🔍 AuthService - Mapped profile data:', data);
      return { success: true, data };
    } catch (error) {
      console.error('🔍 AuthService - Profile API error:', error);
      ErrorTracker.getInstance().track(error as Error, {
        component: 'AuthService',
        action: 'get_profile',
      });
      
      return { 
        success: false, 
        error: errorHandler.fromAxiosError(error) 
      };
    }
  },

  async refreshToken(): Promise<Result<{ token: string; refreshToken: string }>> {
    try {
      const data = await apiService.auth.refreshToken();
      return { success: true, data };
    } catch (error) {
      ErrorTracker.getInstance().track(error as Error, {
        component: 'AuthService',
        action: 'refresh_token',
      });
      
      return { 
        success: false, 
        error: errorHandler.fromAxiosError(error) 
      };
    }
  },

  async getGoogleClientId(): Promise<Result<{ clientId: string }>> {
    try {
      const data = await errorHandler.withRetry(
        () => apiService.google.getClientId(),
        { 
          maxRetries: 3,
          baseDelay: 500,
        }
      );
      
      return { success: true, data };
    } catch (error) {
      ErrorTracker.getInstance().track(error as Error, {
        component: 'AuthService',
        action: 'get_google_client_id',
      });
      
      return { 
        success: false, 
        error: errorHandler.fromAxiosError(error) 
      };
    }
  },
};