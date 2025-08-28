import {
  Permission,
  PermissionCategory,
  Role,
  UserWithPermissions,
  PermissionValidationResult,
  PERMISSION_METADATA,
  DEFAULT_ROLE_PERMISSIONS,
  SYSTEM_ROLES,
} from "@/types/permissions";
import { User } from "@/types";

/**
 * Utility functions for permission management
 */
export class PermissionUtils {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(
    user: UserWithPermissions | User,
    permission: Permission
  ): boolean {
    if (!user) return false;

    // Check if user is super admin (has all permissions)
    if ("isSuperAdmin" in user && user.isSuperAdmin) {
      return true;
    }

    // Check effective permissions if available
    if ("effectivePermissions" in user) {
      return user.effectivePermissions.includes(permission);
    }

    // Fallback: check role-based permissions for legacy User type
    if ("roles" in user && Array.isArray(user.roles)) {
      // This block handles the legacy 'User' type, which has roles as string[]
      const roleNames = user.roles as string[];
      return roleNames.some((roleName) => {
        const rolePermissions =
          DEFAULT_ROLE_PERMISSIONS[roleName.toLowerCase()];
        return rolePermissions?.includes(permission) || false;
      });
    }

    return false;
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(
    user: UserWithPermissions | User,
    permissions: Permission[]
  ): boolean {
    return permissions.some((permission) =>
      this.hasPermission(user, permission)
    );
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(
    user: UserWithPermissions | User,
    permissions: Permission[]
  ): boolean {
    return permissions.every((permission) =>
      this.hasPermission(user, permission)
    );
  }

  /**
   * Get all effective permissions for a user
   */
  static getEffectivePermissions(user: UserWithPermissions): Permission[] {
    if (user.isSuperAdmin) {
      return Object.values(Permission);
    }

    const rolePermissions = user.roles.reduce((acc, role) => {
      return [...acc, ...role.permissions];
    }, [] as Permission[]);

    // Combine role permissions with direct permissions and remove duplicates
    const allPermissions = [
      ...new Set([...rolePermissions, ...user.directPermissions]),
    ];
    return allPermissions;
  }

  /**
   * Validate permission changes for a user
   */
  static validatePermissionChanges(
    user: UserWithPermissions,
    newPermissions: Permission[],
    currentUser: UserWithPermissions
  ): PermissionValidationResult {
    const result: PermissionValidationResult = {
      hasPermission: true,
      missingPermissions: [],
      warnings: [],
      blockers: [],
    };

    // Check if current user can manage permissions
    if (!this.hasPermission(currentUser, Permission.MANAGE_PERMISSIONS)) {
      result.hasPermission = false;
      result.blockers.push(
        "You do not have permission to manage user permissions"
      );
      return result;
    }

    // Check if trying to assign permissions the current user doesn't have
    const currentUserPermissions = this.getEffectivePermissions(currentUser);
    const unauthorizedPermissions = newPermissions.filter(
      (permission) => !currentUserPermissions.includes(permission)
    );

    if (unauthorizedPermissions.length > 0 && !currentUser.isSuperAdmin) {
      result.hasPermission = false;
      result.missingPermissions = unauthorizedPermissions;
      result.blockers.push(
        `You cannot assign permissions you don't have: ${unauthorizedPermissions.join(
          ", "
        )}`
      );
    }

    // Check for system-critical permissions
    const criticalPermissions = newPermissions.filter(
      (permission) => PERMISSION_METADATA[permission]?.isSystemCritical
    );

    if (criticalPermissions.length > 0) {
      result.warnings.push(
        `You are assigning system-critical permissions: ${criticalPermissions.join(
          ", "
        )}`
      );
    }

    // Check if user is trying to modify their own permissions
    if (user.userId === currentUser.userId) {
      result.warnings.push(
        "You are modifying your own permissions. This may affect your access."
      );
    }

    return result;
  }

  /**
   * Get permissions by category
   */
  static getPermissionsByCategory(category: PermissionCategory): Permission[] {
    return Object.values(Permission).filter(
      (permission) => PERMISSION_METADATA[permission]?.category === category
    );
  }

  /**
   * Get permission display name
   */
  static getPermissionDisplayName(permission: Permission): string {
    return PERMISSION_METADATA[permission]?.name || permission;
  }

  /**
   * Get permission description
   */
  static getPermissionDescription(permission: Permission): string {
    return PERMISSION_METADATA[permission]?.description || "";
  }

  /**
   * Check if permission requires confirmation
   */
  static requiresConfirmation(permission: Permission): boolean {
    return PERMISSION_METADATA[permission]?.requiresConfirmation || false;
  }

  /**
   * Convert legacy user to UserWithPermissions
   */
  static convertToUserWithPermissions(user: User): UserWithPermissions {
    const roles: Role[] = [];
    const directPermissions: Permission[] = [];

    // Convert string roles to Role objects
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((roleName) => {
        if (typeof roleName === "string") {
          const permissions =
            DEFAULT_ROLE_PERMISSIONS[roleName.toLowerCase()] || [];
          roles.push({
            id: roleName.toLowerCase(),
            name: roleName.toLowerCase(),
            displayName: roleName,
            description: `${roleName} role`,
            permissions,
            isSystemRole: Object.values(SYSTEM_ROLES).includes(
              roleName.toLowerCase() as any
            ),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      });
    }

    const effectivePermissions = this.calculateEffectivePermissions(
      roles,
      directPermissions
    );

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      roles,
      directPermissions,
      effectivePermissions,
      isBlacklisted: user.isBlacklisted,
      isSuperAdmin: user.roles?.includes("super_admin") || false,
    };
  }

  /**
   * Calculate effective permissions from roles and direct permissions
   */
  private static calculateEffectivePermissions(
    roles: Role[],
    directPermissions: Permission[]
  ): Permission[] {
    const rolePermissions = roles.reduce((acc, role) => {
      return [...acc, ...role.permissions];
    }, [] as Permission[]);

    // Combine and deduplicate
    return [...new Set([...rolePermissions, ...directPermissions])];
  }

  /**
   * Check if a role can be assigned by the current user
   */
  static canAssignRole(role: Role, currentUser: UserWithPermissions): boolean {
    if (currentUser.isSuperAdmin) {
      return true;
    }

    if (!this.hasPermission(currentUser, Permission.ASSIGN_ROLE)) {
      return false;
    }

    // Check if current user has all permissions that the role grants
    const currentUserPermissions = this.getEffectivePermissions(currentUser);
    return role.permissions.every((permission) =>
      currentUserPermissions.includes(permission)
    );
  }

  /**
   * Get available roles that a user can assign
   */
  static getAssignableRoles(
    roles: Role[],
    currentUser: UserWithPermissions
  ): Role[] {
    return roles.filter((role) => this.canAssignRole(role, currentUser));
  }

  /**
   * Format permissions for display
   */
  static formatPermissionsForDisplay(permissions: Permission[]): string {
    if (permissions.length === 0) return "No permissions";
    if (permissions.length === 1)
      return this.getPermissionDisplayName(permissions[0]);
    if (permissions.length <= 3) {
      return permissions
        .map((p) => this.getPermissionDisplayName(p))
        .join(", ");
    }
    return `${permissions
      .slice(0, 2)
      .map((p) => this.getPermissionDisplayName(p))
      .join(", ")} and ${permissions.length - 2} more`;
  }

  /**
   * Group permissions by category for display
   */
  static groupPermissionsByCategory(
    permissions: Permission[]
  ): Record<PermissionCategory, Permission[]> {
    const grouped = {} as Record<PermissionCategory, Permission[]>;

    // Initialize all categories
    Object.values(PermissionCategory).forEach((category) => {
      grouped[category] = [];
    });

    // Group permissions
    permissions.forEach((permission) => {
      const category = PERMISSION_METADATA[permission]?.category;
      if (category) {
        grouped[category].push(permission);
      }
    });

    return grouped;
  }

  /**
   * Check if user is super admin
   */
  static isSuperAdmin(user: UserWithPermissions | User): boolean {
    if ("isSuperAdmin" in user) {
      return user.isSuperAdmin || false;
    }

    // Fallback for legacy User type - check for both 'super_admin' and 'superadmin'
    return (
      user.roles?.some((role) => {
        const roleName = typeof role === "string" ? role : role.name;
        return roleName === "super_admin" || roleName === "superadmin";
      }) || false
    );
  }

  /**
   * Get role hierarchy level (for UI sorting)
   */
  static getRoleHierarchyLevel(roleName: string): number {
    switch (roleName.toLowerCase()) {
      case SYSTEM_ROLES.SUPER_ADMIN:
        return 4;
      case SYSTEM_ROLES.ADMIN:
        return 3;
      case SYSTEM_ROLES.CJ:
        return 2;
      case SYSTEM_ROLES.USER:
        return 1;
      default:
        return 0; // Custom roles
    }
  }

  /**
   * Sort roles by hierarchy
   */
  static sortRolesByHierarchy(roles: Role[]): Role[] {
    return [...roles].sort(
      (a, b) =>
        this.getRoleHierarchyLevel(b.name) - this.getRoleHierarchyLevel(a.name)
    );
  }
}

/**
 * Permission checker hook-like utility
 */
export const createPermissionChecker = (
  user: UserWithPermissions | User | null
) => {
  return {
    hasPermission: (permission: Permission) =>
      user ? PermissionUtils.hasPermission(user, permission) : false,
    hasAnyPermission: (permissions: Permission[]) =>
      user ? PermissionUtils.hasAnyPermission(user, permissions) : false,
    hasAllPermissions: (permissions: Permission[]) =>
      user ? PermissionUtils.hasAllPermissions(user, permissions) : false,
    isSuperAdmin: () => (user ? PermissionUtils.isSuperAdmin(user) : false),
    canAssignRole: (role: Role) =>
      user
        ? PermissionUtils.canAssignRole(role, user as UserWithPermissions)
        : false,
  };
};
