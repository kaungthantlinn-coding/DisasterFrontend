import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { errorHandler, ErrorTracker } from '../utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5057/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token and track requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for tracking
    config.metadata = {
      startTime: Date.now(),
      requestId: Math.random().toString(36).substr(2, 9),
    };
    
    return config;
  },
  (error) => {
    const apiError = errorHandler.fromAxiosError(error);
    ErrorTracker.getInstance().track(apiError, {
      component: 'API',
      action: 'request_error',
    });
    return Promise.reject(apiError);
  }
);

// Response interceptor to handle auth errors and track responses
api.interceptors.response.use(
  (response) => {
    // Track successful requests
    const duration = Date.now() - (response.config.metadata?.startTime || 0);
    if (duration > 3000) { // Log slow requests
      console.warn(`Slow API request: ${response.config.url} took ${duration}ms`);
    }
    
    return response;
  },
  (error) => {
    const apiError = errorHandler.fromAxiosError(error);
    
    // Enhanced error handling for connection issues
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      console.error('Backend server is not running or unreachable at:', API_BASE_URL);
      console.error('Please ensure the DisasterApp backend is running on localhost:5057');
    }
    
    // Track API errors
    ErrorTracker.getInstance().track(apiError, {
      component: 'API',
      action: 'response_error',
      additionalData: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        requestId: error.config?.metadata?.requestId,
        baseURL: API_BASE_URL,
      },
    });
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    return Promise.reject(apiError);
  }
);

// Declare module augmentation for axios config
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
      requestId: string;
    };
  }
}

// API service methods - Fixed duplicate auth property
export const apiService = {
  // Auth endpoints - Updated for DisasterApp backend
  auth: {
    login: async (email: string, password: string) => {
      const response = await api.post('/Auth/login', { email, password });
      return response.data;
    },
    
    googleLogin: async (credential: string) => {
      const response = await api.post('/Auth/google-login', { idToken: credential });
      return response.data;
    },
    
    logout: async () => {
      const response = await api.post('/Auth/logout');
      return response.data;
    },
    
    refreshToken: async () => {
      const response = await api.post('/Auth/refresh');
      return response.data;
    },
    
    getProfile: async () => {
      const response = await api.get('/Auth/validate');
      return response.data;
    },
  },
  
  // Google OAuth endpoints - Updated for DisasterApp backend
  google: {
    getClientId: async () => {
      const response = await api.get('/Config/google-client-id');
      return response.data;
    },
  },
  
  // User management endpoints
  users: {
    getAll: async () => {
      const response = await api.get('/users');
      return response.data;
    },
    
    getById: async (id: string) => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
    
    update: async (id: string, data: Partial<any>) => {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    },
    
    delete: async (id: string) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
  },
};