import { apiClient } from "@/apis/client";
import {
  Permission,
  Role,
  UserWithPermissions,
  PermissionChange,
  BulkPermissionOperation,
  PermissionValidationResult,
} from "@/types/permissions";

/**
 * API endpoints for permission management
 */
export interface CreateRoleDto {
  name: string;
  displayName: string;
  description: string;
  permissions: Permission[];
  isActive?: boolean;
}

export interface UpdateRoleDto {
  displayName?: string;
  description?: string;
  permissions?: Permission[];
  isActive?: boolean;
}

export interface AssignRoleDto {
  userId: string;
  roleIds: string[];
  reason?: string;
}

export interface UpdateUserPermissionsDto {
  userId: string;
  directPermissions: Permission[];
  roleIds: string[];
  reason?: string;
}

export interface BulkRoleAssignmentDto {
  userIds: string[];
  roleIds: string[];
  action: "assign" | "revoke";
  reason?: string;
}

export interface PermissionAuditLogDto {
  id: string;
  userId: string;
  targetUserId?: string;
  targetRoleId?: string;
  action: "assign" | "revoke" | "create" | "update" | "delete";
  entityType: "permission" | "role" | "user";
  changes: PermissionChange[];
  reason?: string;
  timestamp: string;
  userEmail: string;
  userName: string;
}

export interface PagedPermissionAuditDto {
  items: PermissionAuditLogDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PermissionStatsDto {
  totalRoles: number;
  totalCustomRoles: number;
  totalUsersWithCustomPermissions: number;
  mostUsedPermissions: Array<{
    permission: Permission;
    count: number;
  }>;
  roleDistribution: Array<{
    roleName: string;
    userCount: number;
  }>;
}

/**
 * Permission and Role Management API Service
 */
export const permissionService = {
  // Role Management
  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get("/api/admin/roles");
    return response.data;
  },

  async getRoleById(roleId: string): Promise<Role> {
    const response = await apiClient.get(`/api/admin/roles/${roleId}`);
    return response.data;
  },

  async createRole(roleData: CreateRoleDto): Promise<Role> {
    const response = await apiClient.post("/api/admin/roles", roleData);
    return response.data;
  },

  async updateRole(roleId: string, roleData: UpdateRoleDto): Promise<Role> {
    const response = await apiClient.put(
      `/api/admin/roles/${roleId}`,
      roleData
    );
    return response.data;
  },

  async deleteRole(roleId: string, reason?: string): Promise<void> {
    await apiClient.delete(`/api/admin/roles/${roleId}`, {
      data: { reason },
    });
  },

  async duplicateRole(roleId: string, newName: string): Promise<Role> {
    const response = await apiClient.post(
      `/api/admin/roles/${roleId}/duplicate`,
      {
        name: newName,
      }
    );
    return response.data;
  },

  // User Permission Management
  async getUserWithPermissions(userId: string): Promise<UserWithPermissions> {
    const response = await apiClient.get(
      `/api/admin/users/${userId}/permissions`
    );
    return response.data;
  },

  async updateUserPermissions(
    data: UpdateUserPermissionsDto
  ): Promise<UserWithPermissions> {
    const response = await apiClient.put(
      `/api/admin/users/${data.userId}/permissions`,
      data
    );
    return response.data;
  },

  async assignRolesToUser(data: AssignRoleDto): Promise<UserWithPermissions> {
    const response = await apiClient.post(
      `/api/admin/users/${data.userId}/roles`,
      data
    );
    return response.data;
  },

  async revokeRolesFromUser(
    userId: string,
    roleIds: string[],
    reason?: string
  ): Promise<UserWithPermissions> {
    const response = await apiClient.delete(
      `/api/admin/users/${userId}/roles`,
      {
        data: { roleIds, reason },
      }
    );
    return response.data;
  },

  // Bulk Operations
  async bulkAssignRoles(
    data: BulkRoleAssignmentDto
  ): Promise<{ successCount: number; failureCount: number; errors: string[] }> {
    const response = await apiClient.post("/api/admin/users/bulk/roles", data);
    return response.data;
  },

  async bulkUpdatePermissions(
    operations: BulkPermissionOperation[]
  ): Promise<{ successCount: number; failureCount: number; errors: string[] }> {
    const response = await apiClient.post("/api/admin/permissions/bulk", {
      operations,
    });
    return response.data;
  },

  // Permission Validation
  async validatePermissionChanges(
    userId: string,
    newPermissions: Permission[],
    newRoleIds: string[]
  ): Promise<PermissionValidationResult> {
    const response = await apiClient.post("/api/admin/permissions/validate", {
      userId,
      newPermissions,
      newRoleIds,
    });
    return response.data;
  },

  async validateRoleAssignment(
    userId: string,
    roleIds: string[]
  ): Promise<PermissionValidationResult> {
    const response = await apiClient.post(
      "/api/admin/roles/validate-assignment",
      {
        userId,
        roleIds,
      }
    );
    return response.data;
  },

  // Audit and Logging
  async getPermissionAuditLog(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      userId?: string;
      targetUserId?: string;
      action?: string;
      entityType?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<PagedPermissionAuditDto> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });

    const response = await apiClient.get(
      `/api/admin/audit/permissions?${params}`
    );
    return response.data;
  },

  async exportAuditLog(filters?: {
    userId?: string;
    targetUserId?: string;
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const params = new URLSearchParams(filters || {});
    const response = await apiClient.get(
      `/api/admin/audit/permissions/export?${params}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  // Statistics and Analytics
  async getPermissionStats(): Promise<PermissionStatsDto> {
    const response = await apiClient.get("/api/admin/permissions/stats");
    return response.data;
  },

  async getRoleUsageStats(roleId: string): Promise<{
    userCount: number;
    recentAssignments: number;
    permissionCount: number;
    isSystemRole: boolean;
  }> {
    const response = await apiClient.get(`/api/admin/roles/${roleId}/stats`);
    return response.data;
  },

  // Permission Discovery
  async getAvailablePermissions(): Promise<Permission[]> {
    const response = await apiClient.get("/api/admin/permissions/available");
    return response.data;
  },

  async getPermissionDependencies(permission: Permission): Promise<{
    requiredPermissions: Permission[];
    conflictingPermissions: Permission[];
    impliedPermissions: Permission[];
  }> {
    const response = await apiClient.get(
      `/api/admin/permissions/${permission}/dependencies`
    );
    return response.data;
  },

  // User Search with Permissions
  async searchUsersWithPermissions(
    query: string,
    filters?: {
      hasPermission?: Permission;
      hasRole?: string;
      hasAnyPermission?: Permission[];
      hasAllPermissions?: Permission[];
    }
  ): Promise<UserWithPermissions[]> {
    const response = await apiClient.post(
      "/api/admin/users/search/permissions",
      {
        query,
        filters,
      }
    );
    return response.data;
  },

  // Role Templates
  async getRoleTemplates(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      permissions: Permission[];
      category: string;
    }>
  > {
    const response = await apiClient.get("/api/admin/roles/templates");
    return response.data;
  },

  async createRoleFromTemplate(
    templateId: string,
    customizations: {
      name: string;
      displayName: string;
      description?: string;
      additionalPermissions?: Permission[];
      removedPermissions?: Permission[];
    }
  ): Promise<Role> {
    const response = await apiClient.post(
      `/api/admin/roles/templates/${templateId}/create`,
      customizations
    );
    return response.data;
  },

  // Permission Inheritance
  async getPermissionInheritance(userId: string): Promise<{
    directPermissions: Permission[];
    rolePermissions: Array<{
      roleName: string;
      permissions: Permission[];
    }>;
    effectivePermissions: Permission[];
    conflicts: Array<{
      permission: Permission;
      sources: string[];
    }>;
  }> {
    const response = await apiClient.get(
      `/api/admin/users/${userId}/permissions/inheritance`
    );
    return response.data;
  },

  // System Health
  async checkPermissionSystemHealth(): Promise<{
    orphanedPermissions: Permission[];
    unusedRoles: string[];
    usersWithoutRoles: string[];
    duplicatePermissions: Array<{
      userId: string;
      duplicatedPermissions: Permission[];
    }>;
    recommendations: string[];
  }> {
    const response = await apiClient.get("/api/admin/permissions/health");
    return response.data;
  },

  // Quick Actions
  async quickAssignRole(userId: string, roleName: string): Promise<void> {
    await apiClient.post(`/api/admin/users/${userId}/quick-assign-role`, {
      roleName,
    });
  },

  async quickRevokeRole(userId: string, roleName: string): Promise<void> {
    await apiClient.post(`/api/admin/users/${userId}/quick-revoke-role`, {
      roleName,
    });
  },

  async quickGrantPermission(
    userId: string,
    permission: Permission
  ): Promise<void> {
    await apiClient.post(`/api/admin/users/${userId}/quick-grant-permission`, {
      permission,
    });
  },

  async quickRevokePermission(
    userId: string,
    permission: Permission
  ): Promise<void> {
    await apiClient.post(`/api/admin/users/${userId}/quick-revoke-permission`, {
      permission,
    });
  },
};

export default permissionService;
