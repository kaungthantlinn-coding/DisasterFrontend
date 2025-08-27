import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { isTokenExpired } from '../utils/jwtUtils';
import { apiClient } from '../apis/client';

interface AuthState {
  user: User | null;
  accessToken: string | null; // Stored in memory only
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenExpiresAt: string | null;
  isRefreshing: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setTokens: (accessToken: string, expiresAt?: string) => void;
  setAuth: (user: User, accessToken: string, expiresAt?: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  isTokenExpired: () => boolean;
  refreshToken: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null, // Memory only - not persisted
      isAuthenticated: false,
      isLoading: true, // Start with loading true to handle initial auth check
      tokenExpiresAt: null,
      isRefreshing: false,
      isInitialized: false,

      // Actions
      setUser: (user) => {
        console.log(' AuthStore - Setting user:', user);
        console.log(' AuthStore - User validation:');
        console.log('  - Has userId:', !!user?.userId);
        console.log('  - Has name:', !!user?.name);
        console.log('  - Has email:', !!user?.email);
        console.log('  - Has roles:', user?.roles?.length > 0);
        set({ user });
      },

      setTokens: (accessToken, expiresAt) =>
        set({
          accessToken,
          tokenExpiresAt: expiresAt || null,
          isAuthenticated: !!accessToken
        }),

      setAuth: (user, accessToken, expiresAt) =>
        set({
          user,
          accessToken,
          tokenExpiresAt: expiresAt || null,
          isAuthenticated: true
        }),

      logout: async () => {
        try {
          // Call server logout to clear HTTP-only refresh token cookie
          await apiClient.post('/Auth/logout');
        } catch (error) {
          console.warn('Server logout failed, clearing local state anyway', error);
        }
        
        // Always clear local state
        set({ 
          user: null, 
          accessToken: null, 
          tokenExpiresAt: null,
          isAuthenticated: false,
          isLoading: false
        });
      },
      
      setLoading: (isLoading) => set({ isLoading }),

      isTokenExpired: () => {
        const { accessToken } = get();
        return isTokenExpired(accessToken);
      },

      refreshToken: async () => {
        if (get().isRefreshing) {
          console.log('Token refresh already in progress, skipping.');
          return false;
        }
        set({ isRefreshing: true });

        try {
          const response = await apiClient.post('/Auth/refresh');
          const { data } = response;

          const accessToken = data.accessToken || data.token;
          const expiresAt = data.expiresAt || data.expiresIn;

          if (accessToken) {
            set({
              user: data.user || get().user,
              accessToken,
              tokenExpiresAt: expiresAt || null,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
            console.log('Token refresh successful');
            return true;
          }
          return false;
        } catch (error) {
          console.error('Token refresh failed:', error);
          // The interceptor in apiClient should handle the logout for 401s.
          // For other errors, we ensure the state is cleaned up.
          set({ 
            isAuthenticated: false, 
            accessToken: null, 
            user: null, 
            isLoading: false, 
            isInitialized: true 
          });
          return false;
        } finally {
          set({ isRefreshing: false });
        }
      },

      initializeAuth: async () => {
        if (get().isInitialized) return;

        const { user, accessToken } = get();
        if (user && !accessToken) {
          await get().refreshToken();
        } else {
          // If no refresh is needed, just turn off the loader.
          set({ isLoading: false, isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        // accessToken NOT persisted - memory only for security
        // refreshToken NOT persisted - uses HTTP-only cookies
        // isAuthenticated will be determined by presence of valid accessToken
      }),
    }
  )
);