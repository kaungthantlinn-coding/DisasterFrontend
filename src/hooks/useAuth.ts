import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../apis/auth';

export const useAuth = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated && !user,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: user || currentUser,
    isAuthenticated,
    isLoading,
    logout,
  };
};