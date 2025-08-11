import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { isTokenExpired } from '../utils/jwtUtils';
import { authApi } from '../apis/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenExpiresAt: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string, expiresAt?: string) => void;
  setAuth: (user: User, accessToken: string, refreshToken: string, expiresAt?: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  isTokenExpired: () => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      tokenExpiresAt: null,

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

      setTokens: (accessToken, refreshToken, expiresAt) =>
        set({
          accessToken,
          refreshToken,
          tokenExpiresAt: expiresAt || null,
          isAuthenticated: !!accessToken
        }),

      setAuth: (user, accessToken, refreshToken, expiresAt) =>
        set({
          user,
          accessToken,
          refreshToken,
          tokenExpiresAt: expiresAt || null,
          isAuthenticated: true
        }),

      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          try {
            await authApi.logout(refreshToken);
          } catch (error) {
            console.error('API logout failed', error);
          }
        }
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false 
        });
      },
      
      setLoading: (isLoading) => set({ isLoading }),

      isTokenExpired: () => {
        const { accessToken } = get();
        return isTokenExpired(accessToken);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);