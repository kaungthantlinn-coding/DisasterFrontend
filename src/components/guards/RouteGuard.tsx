import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Permission, Role } from '@/types/permissions';
import { useCurrentUserPermissions } from '@/hooks/usePermissions';
import { useAuthStore } from '@/stores/authStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RouteGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  roles?: string[];
  requireAllRoles?: boolean;
  redirectTo?: string;
  showUnauthorized?: boolean;
  requireAuth?: boolean;
}

/**
 * Component that protects routes based on permissions and roles
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  roles = [],
  requireAllRoles = false,
  redirectTo = '/unauthorized',
  showUnauthorized = true,
  requireAuth = true
}) => {
  const location = useLocation();
  const { user, hasAnyPermission, hasAllPermissions, isSuperAdmin } = useCurrentUserPermissions();
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    // Handle loading state
  }

  // Check if user is authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super admin has access to everything
  if (isSuperAdmin()) {
    return <>{children}</>;
  }

  // Check role-based access
  if (roles.length > 0 && user?.roles) {
    const userRoles = Array.isArray(user.roles)
      ? user.roles.map((role: Role | string) => typeof role === 'string' ? role : role.name || String(role.id))
      : [];
    
    const hasRequiredRoles = requireAllRoles
      ? roles.every(role => userRoles.includes(role))
      : roles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRoles) {
      if (showUnauthorized) {
        return <UnauthorizedPage reason="role" requiredRoles={roles} />;
      }
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Check permission-based access
  const permissionsToCheck = permission ? [permission] : permissions;
  
  if (permissionsToCheck.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissionsToCheck)
      : hasAnyPermission(permissionsToCheck);
    
    if (!hasRequiredPermissions) {
      if (showUnauthorized) {
        return <UnauthorizedPage reason="permission" requiredPermissions={permissionsToCheck} />;
      }
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};

/**
 * Unauthorized page component
 */
interface UnauthorizedPageProps {
  reason: 'permission' | 'role' | 'auth';
  requiredPermissions?: Permission[];
  requiredRoles?: string[];
  customMessage?: string;
}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  reason,
  requiredPermissions = [],
  requiredRoles = [],
  customMessage
}) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (reason) {
      case 'permission':
        return <Lock className="h-12 w-12 text-red-500" />;
      case 'role':
        return <Shield className="h-12 w-12 text-orange-500" />;
      case 'auth':
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      default:
        return <Lock className="h-12 w-12 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (reason) {
      case 'permission':
        return 'Insufficient Permissions';
      case 'role':
        return 'Role Access Required';
      case 'auth':
        return 'Authentication Required';
      default:
        return 'Access Denied';
    }
  };

  const getMessage = () => {
    if (customMessage) return customMessage;
    
    switch (reason) {
      case 'permission':
        return `You don't have the required permissions to access this page. Required permissions: ${requiredPermissions.join(', ')}`;
      case 'role':
        return `You don't have the required role to access this page. Required roles: ${requiredRoles.join(', ')}`;
      case 'auth':
        return 'You need to be logged in to access this page.';
      default:
        return 'You are not authorized to access this page.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="flex justify-center">
            {getIcon()}
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {getTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getMessage()}
          </p>
        </div>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              If you believe this is an error, please contact your administrator.
            </AlertDescription>
          </Alert>
          
          <div className="flex space-x-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Higher-order component for route protection
 */
export const withRouteGuard = <P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<RouteGuardProps, 'children'>
) => {
  return (props: P) => (
    <RouteGuard {...guardProps}>
      <Component {...props} />
    </RouteGuard>
  );
};

/**
 * Super Admin only route guard
 */
interface SuperAdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  showUnauthorized?: boolean;
}

export const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({
  children,
  redirectTo = '/unauthorized',
  showUnauthorized = true
}) => {
  const { isSuperAdmin } = useCurrentUserPermissions();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSuperAdmin()) {
    if (showUnauthorized) {
      return (
        <UnauthorizedPage 
          reason="role" 
          requiredRoles={['SUPER_ADMIN']}
          customMessage="This page is only accessible to Super Administrators."
        />
      );
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

/**
 * Admin route guard (includes Super Admin)
 */
interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  showUnauthorized?: boolean;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  redirectTo = '/unauthorized',
  showUnauthorized = true
}) => {
  const { user, isSuperAdmin } = useCurrentUserPermissions();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super admin has admin access
  if (isSuperAdmin()) {
    return <>{children}</>;
  }

  // Check if user has admin role
  const userRoles = Array.isArray(user?.roles) 
    ? user.roles.map((role: Role | string) => typeof role === 'string' ? role.toLowerCase() : (role.name || String(role.id)).toLowerCase())
    : [];

  if (!userRoles.includes('admin')) {
    if (showUnauthorized) {
      return (
        <UnauthorizedPage 
          reason="role" 
          requiredRoles={['ADMIN', 'SUPER_ADMIN']}
          customMessage="This page requires administrator privileges."
        />
      );
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

/**
 * Protected route that requires authentication
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login'
}) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * Route guard for specific permissions with loading state
 */
interface PermissionRouteProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showUnauthorized?: boolean;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  redirectTo = '/unauthorized',
  showUnauthorized = true
}) => {
  const { 
    hasAnyPermission, 
    hasAllPermissions,
    isSuperAdmin
  } = useCurrentUserPermissions();
  const { isAuthenticated, isLoading: loading } = useAuthStore();
  const location = useLocation();

  // Show loading state while checking permissions
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super admin has access to everything
  if (isSuperAdmin()) {
    return <>{children}</>;
  }

  const permissionsToCheck = permission ? [permission] : permissions;
  
  if (permissionsToCheck.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissionsToCheck)
      : hasAnyPermission(permissionsToCheck);
    
    if (!hasRequiredPermissions) {
      if (fallback) {
        return <>{fallback}</>;
      }
      
      if (showUnauthorized) {
        return <UnauthorizedPage reason="permission" requiredPermissions={permissionsToCheck} />;
      }
      
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};

export default RouteGuard;