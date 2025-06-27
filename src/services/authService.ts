import { apiService } from './api';
import { errorHandler, Result, ErrorTracker } from '../utils/errorHandler';
import { User } from '../types';

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
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
const mapApiUserToUser = (apiUser: ApiUser): User => ({
  userId: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  photoUrl: apiUser.avatar,
  roles: [apiUser.role],
});

// Helper function to convert API response to app response
const mapApiResponse = (apiResponse: { user: ApiUser; token: string; refreshToken: string }) => ({
  user: mapApiUserToUser(apiResponse.user),
  token: apiResponse.token,
  refreshToken: apiResponse.refreshToken,
});

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
      const apiData = await errorHandler.withRetry(
        () => apiService.auth.getProfile(),
        { maxRetries: 3 }
      );
      
      const data = mapApiUserToUser(apiData);
      return { success: true, data };
    } catch (error) {
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