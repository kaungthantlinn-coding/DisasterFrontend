import { useAuth } from './useAuth';

export const useRoles = () => {
  const { user } = useAuth();

  const isAdmin = (): boolean => {
    return user?.roles?.includes('admin') || false;
  };

  const isCj = (): boolean => {
    return user?.roles?.includes('cj') || false;
  };

  const hasAdminOrCjRole = (): boolean => {
    return isAdmin() || isCj();
  };

  const isOnlyUser = (): boolean => {
    if (!user?.roles || user.roles.length === 0) return true;
    return user.roles.every(role => role === 'user' || !role);
  };

  const formatRoleName = (role: string): string => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Admin';
      case 'cj':
        return 'CJ';
      case 'user':
        return 'User';
      default:
        return role || 'User';
    }
  };

  return {
    isAdmin,
    isCj,
    hasAdminOrCjRole,
    isOnlyUser,
    formatRoleName,
    userRoles: user?.roles || [],
  };
};