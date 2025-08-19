import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
};