import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { isTokenExpired } from '../utils/jwtUtils';

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
      setUser: (user) => set({ user }),

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

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          tokenExpiresAt: null,
          isAuthenticated: false
        }),

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