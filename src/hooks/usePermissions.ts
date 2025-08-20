import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Permission,
  Role,
  UserWithPermissions,
  PermissionValidationResult,
  BulkPermissionOperation
} from '../types/permissions';
import { permissionService, UpdateUserPermissionsDto, AssignRoleDto } from '../services/permissionService';
import { PermissionUtils, createPermissionChecker } from '../utils/permissionUtils';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';

/**
 * Hook for checking current user's permissions
 */
export const useCurrentUserPermissions = () => {
  const { user } = useAuthStore();
  
  const permissionChecker = useMemo(() => {
    return createPermissionChecker(user);
  }, [user]);
  
  return {
    hasPermission: permissionChecker.hasPermission,
    hasAnyPermission: permissionChecker.hasAnyPermission,
    hasAllPermissions: permissionChecker.hasAllPermissions,
    isSuperAdmin: permissionChecker.isSuperAdmin,
    canAssignRole: permissionChecker.canAssignRole,
    user
  };
};

/**
 * Hook for managing roles
 */
export const useRoles = () => {
  const queryClient = useQueryClient();
  
  const {
    data: roles = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['roles'],
    queryFn: permissionService.getRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const createRoleMutation = useMutation({
    mutationFn: permissionService.createRole,
    onSuccess: (newRole) => {
      queryClient.setQueryData(['roles'], (old: Role[] = []) => [...old, newRole]);
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] });
      toast.success('Role created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create role');
    }
  });
  
  const updateRoleMutation = useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: any }) => 
      permissionService.updateRole(roleId, data),
    onSuccess: (updatedRole) => {
      queryClient.setQueryData(['roles'], (old: Role[] = []) => 
        old.map(role => role.id === updatedRole.id ? updatedRole : role)
      );
      queryClient.invalidateQueries({ queryKey: ['role', updatedRole.id] });
      toast.success('Role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  });
  
  const deleteRoleMutation = useMutation({
    mutationFn: ({ roleId, reason }: { roleId: string; reason?: string }) => 
      permissionService.deleteRole(roleId, reason),
    onSuccess: (_, { roleId }) => {
      queryClient.setQueryData(['roles'], (old: Role[] = []) => 
        old.filter(role => role.id !== roleId)
      );
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] });
      toast.success('Role deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete role');
    }
  });
  
  const duplicateRoleMutation = useMutation({
    mutationFn: ({ roleId, newName }: { roleId: string; newName: string }) => 
      permissionService.duplicateRole(roleId, newName),
    onSuccess: (newRole) => {
      queryClient.setQueryData(['roles'], (old: Role[] = []) => [...old, newRole]);
      toast.success('Role duplicated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to duplicate role');
    }
  });
  
  const { user: currentUser } = useCurrentUserPermissions();
  
  const assignableRoles = useMemo(() => {
    if (!currentUser) return [];
    const userWithPermissions = PermissionUtils.convertToUserWithPermissions(currentUser);
    return PermissionUtils.getAssignableRoles(roles, userWithPermissions);
  }, [roles, currentUser]);
  
  const sortedRoles = useMemo(() => {
    return PermissionUtils.sortRolesByHierarchy(roles);
  }, [roles]);
  
  return {
    roles,
    sortedRoles,
    assignableRoles,
    isLoading,
    error,
    refetch,
    createRole: createRoleMutation.mutate,
    updateRole: updateRoleMutation.mutate,
    deleteRole: deleteRoleMutation.mutate,
    duplicateRole: duplicateRoleMutation.mutate,
    isCreating: createRoleMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isDeleting: deleteRoleMutation.isPending,
    isDuplicating: duplicateRoleMutation.isPending
  };
};

/**
 * Hook for managing user permissions
 */
export const useUserPermissions = (userId?: string) => {
  const queryClient = useQueryClient();
  
  const {
    data: userWithPermissions,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: () => userId ? permissionService.getUserWithPermissions(userId) : null,
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
  
  const updatePermissionsMutation = useMutation({
    mutationFn: (data: UpdateUserPermissionsDto) => 
      permissionService.updateUserPermissions(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user-permissions', updatedUser.userId], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] });
      toast.success('User permissions updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update permissions');
    }
  });
  
  const assignRolesMutation = useMutation({
    mutationFn: (data: AssignRoleDto) => 
      permissionService.assignRolesToUser(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user-permissions', updatedUser.userId], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Roles assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign roles');
    }
  });
  
  const revokeRolesMutation = useMutation({
    mutationFn: ({ userId, roleIds, reason }: { userId: string; roleIds: string[]; reason?: string }) => 
      permissionService.revokeRolesFromUser(userId, roleIds, reason),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user-permissions', updatedUser.userId], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Roles revoked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke roles');
    }
  });
  
  const validatePermissionsMutation = useMutation({
    mutationFn: ({ userId, newPermissions, newRoleIds }: {
      userId: string;
      newPermissions: Permission[];
      newRoleIds: string[];
    }) => permissionService.validatePermissionChanges(userId, newPermissions, newRoleIds),
  });
  
  return {
    userWithPermissions,
    isLoading,
    error,
    refetch,
    updatePermissions: updatePermissionsMutation.mutate,
    assignRoles: assignRolesMutation.mutate,
    revokeRoles: revokeRolesMutation.mutate,
    validatePermissions: validatePermissionsMutation.mutateAsync,
    isUpdatingPermissions: updatePermissionsMutation.isPending,
    isAssigningRoles: assignRolesMutation.isPending,
    isRevokingRoles: revokeRolesMutation.isPending,
    isValidating: validatePermissionsMutation.isPending,
    validationResult: validatePermissionsMutation.data
  };
};

/**
 * Hook for bulk permission operations
 */
export const useBulkPermissions = () => {
  const queryClient = useQueryClient();
  
  const bulkAssignRolesMutation = useMutation({
    mutationFn: permissionService.bulkAssignRoles,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] });
      toast.success(`Bulk operation completed: ${result.successCount} successful, ${result.failureCount} failed`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Bulk operation failed');
    }
  });
  
  const bulkUpdatePermissionsMutation = useMutation({
    mutationFn: (operations: BulkPermissionOperation[]) => 
      permissionService.bulkUpdatePermissions(operations),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] });
      toast.success(`Bulk permission update completed: ${result.successCount} successful, ${result.failureCount} failed`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Bulk permission update failed');
    }
  });
  
  return {
    bulkAssignRoles: bulkAssignRolesMutation.mutate,
    bulkUpdatePermissions: bulkUpdatePermissionsMutation.mutate,
    isBulkAssigning: bulkAssignRolesMutation.isPending,
    isBulkUpdating: bulkUpdatePermissionsMutation.isPending
  };
};

/**
 * Hook for permission statistics and analytics
 */
export const usePermissionStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['permission-stats'],
    queryFn: permissionService.getPermissionStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  return {
    stats,
    isLoading,
    error,
    refetch
  };
};

/**
 * Hook for permission audit log
 */
export const usePermissionAudit = (filters?: {
  userId?: string;
  targetUserId?: string;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  const {
    data: auditLog,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['permission-audit', page, pageSize, filters],
    queryFn: () => permissionService.getPermissionAuditLog(page, pageSize, filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
  
  const exportAuditMutation = useMutation({
    mutationFn: () => permissionService.exportAuditLog(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `permission-audit-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Audit log exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to export audit log');
    }
  });
  
  return {
    auditLog,
    isLoading,
    error,
    refetch,
    page,
    setPage,
    pageSize,
    setPageSize,
    exportAudit: exportAuditMutation.mutate,
    isExporting: exportAuditMutation.isPending
  };
};

/**
 * Hook for quick permission actions
 */
export const useQuickPermissions = () => {
  const queryClient = useQueryClient();
  
  const quickAssignRoleMutation = useMutation({
    mutationFn: ({ userId, roleName }: { userId: string; roleName: string }) => 
      permissionService.quickAssignRole(userId, roleName),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Role assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign role');
    }
  });
  
  const quickRevokeRoleMutation = useMutation({
    mutationFn: ({ userId, roleName }: { userId: string; roleName: string }) => 
      permissionService.quickRevokeRole(userId, roleName),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Role revoked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke role');
    }
  });
  
  const quickGrantPermissionMutation = useMutation({
    mutationFn: ({ userId, permission }: { userId: string; permission: Permission }) => 
      permissionService.quickGrantPermission(userId, permission),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Permission granted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to grant permission');
    }
  });
  
  const quickRevokePermissionMutation = useMutation({
    mutationFn: ({ userId, permission }: { userId: string; permission: Permission }) => 
      permissionService.quickRevokePermission(userId, permission),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Permission revoked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke permission');
    }
  });
  
  return {
    quickAssignRole: quickAssignRoleMutation.mutate,
    quickRevokeRole: quickRevokeRoleMutation.mutate,
    quickGrantPermission: quickGrantPermissionMutation.mutate,
    quickRevokePermission: quickRevokePermissionMutation.mutate,
    isQuickAssigning: quickAssignRoleMutation.isPending,
    isQuickRevoking: quickRevokeRoleMutation.isPending,
    isQuickGranting: quickGrantPermissionMutation.isPending,
    isQuickRevokingPermission: quickRevokePermissionMutation.isPending
  };
};

/**
 * Hook for permission validation
 */
export const usePermissionValidation = () => {
  const [validationResults, setValidationResults] = useState<Record<string, PermissionValidationResult>>({});
  
  const validatePermissionChange = useCallback(async (
    key: string,
    user: UserWithPermissions,
    newPermissions: Permission[],
    currentUser: UserWithPermissions
  ) => {
    const result = PermissionUtils.validatePermissionChanges(user, newPermissions, currentUser);
    setValidationResults(prev => ({ ...prev, [key]: result }));
    return result;
  }, []);
  
  const clearValidation = useCallback((key: string) => {
    setValidationResults(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);
  
  const clearAllValidations = useCallback(() => {
    setValidationResults({});
  }, []);
  
  return {
    validationResults,
    validatePermissionChange,
    clearValidation,
    clearAllValidations
  };
};