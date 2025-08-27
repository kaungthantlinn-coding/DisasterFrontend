import React from 'react';
import { Permission } from '@/types/permissions';
import { Role } from '@/types/roles';
import { useCurrentUserPermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  fallback?: React.ReactNode;
  showFallback?: boolean;
  className?: string;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  showFallback = true,
  className
}) => {
  const { hasAnyPermission, hasAllPermissions } = useCurrentUserPermissions();
  
  // Determine which permissions to check
  const permissionsToCheck = permission ? [permission] : permissions;
  
  if (permissionsToCheck.length === 0) {
    // No permissions specified, render children
    return <div className={className}>{children}</div>;
  }
  
  // Check permissions based on requireAll flag
  const hasRequiredPermissions = requireAll 
    ? hasAllPermissions(permissionsToCheck)
    : hasAnyPermission(permissionsToCheck);
  
  if (hasRequiredPermissions) {
    return <div className={className}>{children}</div>;
  }
  
  // User doesn't have required permissions
  if (!showFallback) {
    return null;
  }
  
  if (fallback) {
    return <div className={className}>{fallback}</div>;
  }
  
  // Default fallback
  return (
    <div className={className}>
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this content.
        </AlertDescription>
      </Alert>
    </div>
  );
};

/**
 * Higher-order component for permission-based rendering
 */
export const withPermissionGuard = <P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<PermissionGuardProps, 'children'>
) => {
  return (props: P) => (
    <PermissionGuard {...guardProps}>
      <Component {...props} />
    </PermissionGuard>
  );
};

/**
 * Component for inline permission checks with render props
 */
interface PermissionCheckProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  children: (hasPermission: boolean) => React.ReactNode;
}

export const PermissionCheck: React.FC<PermissionCheckProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  children
}) => {
  const { hasAnyPermission, hasAllPermissions } = useCurrentUserPermissions();
  
  const permissionsToCheck = permission ? [permission] : permissions;
  
  if (permissionsToCheck.length === 0) {
    return <>{children(true)}</>;
  }
  
  const hasRequiredPermissions = requireAll 
    ? hasAllPermissions(permissionsToCheck)
    : hasAnyPermission(permissionsToCheck);
  
  return <>{children(hasRequiredPermissions)}</>;
};

/**
 * Component that shows content only to Super Admins
 */
interface SuperAdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
  className?: string;
}

export const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({
  children,
  fallback,
  showFallback = true,
  className
}) => {
  const { isSuperAdmin } = useCurrentUserPermissions();
  
  if (isSuperAdmin()) {
    return <div className={className}>{children}</div>;
  }
  
  if (!showFallback) {
    return null;
  }
  
  if (fallback) {
    return <div className={className}>{fallback}</div>;
  }
  
  return (
    <div className={className}>
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          This content is only available to Super Administrators.
        </AlertDescription>
      </Alert>
    </div>
  );
};

/**
 * Component that conditionally disables/enables UI elements based on permissions
 */
interface PermissionButtonProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
  className?: string;
  onClick?: () => void;
  [key: string]: any; // For other button props
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  disabled = false,
  disabledTooltip,
  className,
  onClick,
  ...buttonProps
}) => {
  const { hasAnyPermission, hasAllPermissions } = useCurrentUserPermissions();
  
  const permissionsToCheck = permission ? [permission] : permissions;
  
  let hasRequiredPermissions = true;
  if (permissionsToCheck.length > 0) {
    hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissionsToCheck)
      : hasAnyPermission(permissionsToCheck);
  }
  
  const isDisabled = disabled || !hasRequiredPermissions;
  
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };
  
  return (
    <button
      {...buttonProps}
      className={`${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled}
      onClick={handleClick}
      title={isDisabled && !hasRequiredPermissions ? 
        disabledTooltip || 'You don\'t have permission to perform this action' : 
        buttonProps.title
      }
    >
      {children}
    </button>
  );
};

/**
 * Hook for conditional rendering based on permissions
 */
export const usePermissionGuard = () => {
  const { hasAnyPermission, hasAllPermissions, isSuperAdmin } = useCurrentUserPermissions();
  
  const canAccess = React.useCallback((
    permission?: Permission,
    permissions?: Permission[],
    requireAll = false
  ) => {
    if (isSuperAdmin()) return true;
    
    const permissionsToCheck = permission ? [permission] : permissions || [];
    
    if (permissionsToCheck.length === 0) return true;
    
    return requireAll 
      ? hasAllPermissions(permissionsToCheck)
      : hasAnyPermission(permissionsToCheck);
  }, [hasAnyPermission, hasAllPermissions, isSuperAdmin]);
  
  const renderIfAllowed = React.useCallback((
    content: React.ReactNode,
    permission?: Permission,
    permissions?: Permission[],
    requireAll = false,
    fallback?: React.ReactNode
  ) => {
    return canAccess(permission, permissions, requireAll) ? content : (fallback || null);
  }, [canAccess]);
  
  return {
    canAccess,
    renderIfAllowed,
    isSuperAdmin: isSuperAdmin()
  };
};

/**
 * Component for role-based access control
 */
interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  showFallback?: boolean;
  className?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  requireAll = false,
  fallback,
  showFallback = true,
  className
}) => {
  const { user } = useCurrentUserPermissions();
  
  if (!user || !user.roles) {
    if (!showFallback) return null;
    
    return (
      <div className={className}>
        {fallback || (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You don't have the required role to access this content.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }
  
  const userRoles = Array.isArray(user.roles) 
    ? user.roles.map((role: Role | string) => typeof role === 'string' ? role : role.name || String(role.id))
    : [];
  
  const hasRequiredRoles = requireAll
    ? roles.every(role => userRoles.includes(role))
    : roles.some(role => userRoles.includes(role));
  
  if (hasRequiredRoles) {
    return <div className={className}>{children}</div>;
  }
  
  if (!showFallback) {
    return null;
  }
  
  return (
    <div className={className}>
      {fallback || (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            You don't have the required role to access this content.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

/**
 * Component that shows different content based on user roles
 */
interface ConditionalRenderProps {
  superAdmin?: React.ReactNode;
  admin?: React.ReactNode;
  cj?: React.ReactNode;
  user?: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  superAdmin,
  admin,
  cj,
  user: userContent,
  fallback,
  className
}) => {
  const { user, isSuperAdmin } = useCurrentUserPermissions();
  
  if (!user) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }
  
  if (isSuperAdmin() && superAdmin) {
    return <div className={className}>{superAdmin}</div>;
  }
  
  const userRoles = Array.isArray(user.roles) 
    ? user.roles.map((role: Role | string) => typeof role === 'string' ? role.toLowerCase() : (role.name || String(role.id)).toLowerCase())
    : [];
  
  if (userRoles.includes('admin') && admin) {
    return <div className={className}>{admin}</div>;
  }
  
  if (userRoles.includes('cj') && cj) {
    return <div className={className}>{cj}</div>;
  }
  
  if (userRoles.includes('user') && userContent) {
    return <div className={className}>{userContent}</div>;
  }
  
  return fallback ? <div className={className}>{fallback}</div> : null;
};

export default PermissionGuard;