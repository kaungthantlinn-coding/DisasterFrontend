import { User } from '../types';

/**
 * Determines the appropriate redirect path based on user role
 * @param user - The authenticated user object
 * @param defaultPath - Default path if no role-specific redirect is needed
 * @returns The path to redirect to
 */
export const getRoleBasedRedirectPath = (user: User | null, defaultPath: string = '/'): string => {
  if (!user || !user.roles || user.roles.length === 0) {
    return defaultPath;
  }

  // Super Admin users should be redirected to admin dashboard (unified panel)
  if (user.roles.includes('superadmin') || user.roles.includes('super_admin')) {
    return '/admin';
  }

  // Admin users should be redirected to admin panel
  if (user.roles.includes('admin')) {
    return '/admin';
  }

  // CJ users should be redirected to dashboard
  if (user.roles.includes('cj')) {
    return '/dashboard';
  }

  // Regular users and others go to home page
  return defaultPath;
};

/**
 * Checks if a user should be redirected to a role-specific page
 * @param user - The authenticated user object
 * @returns boolean indicating if role-based redirection should occur
 */
export const shouldRedirectBasedOnRole = (user: User | null): boolean => {
  if (!user || !user.roles || user.roles.length === 0) {
    return false;
  }

  // Redirect superadmin, admin and CJ users to their specific dashboards
  return user.roles.includes('superadmin') || 
         user.roles.includes('super_admin') || 
         user.roles.includes('admin') || 
         user.roles.includes('cj');
};

/**
 * Gets the display name for the redirect destination
 * @param user - The authenticated user object
 * @returns Human-readable name of the redirect destination
 */
export const getRedirectDestinationName = (user: User | null): string => {
  if (!user || !user.roles || user.roles.length === 0) {
    return 'Home';
  }

  if (user.roles.includes('superadmin') || user.roles.includes('super_admin')) {
    return 'Super Admin Dashboard';
  }

  if (user.roles.includes('admin')) {
    return 'Admin Panel';
  }

  if (user.roles.includes('cj')) {
    return 'Dashboard';
  }

  return 'Home';
};

/**
 * Logs the redirection for debugging purposes
 * @param user - The authenticated user object
 * @param redirectPath - The path being redirected to
 */
export const logRoleBasedRedirection = (user: User | null, redirectPath: string): void => {
  if (process.env.NODE_ENV === 'development') {
    const userRoles = user?.roles?.join(', ') || 'none';
    const destination = getRedirectDestinationName(user);
    console.log(`🔄 Role-based redirection: User with roles [${userRoles}] → ${destination} (${redirectPath})`);
  }
};
