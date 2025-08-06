import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userManagementApi,
  UpdateUserRolesDto,
  RoleUpdateValidationDto,
  UpdateUserDto
} from '../apis/userManagement';

export interface RoleUpdateOptions {
  onValidationSuccess?: (validation: RoleUpdateValidationDto) => void;
  onValidationError?: (error: any) => void;
  onUpdateSuccess?: () => void;
  onUpdateError?: (error: any) => void;
}

// Client-side validation logic for role updates
const validateRoleUpdateClientSide = (roleData: UpdateUserRolesDto): RoleUpdateValidationDto => {
  const { roleNames } = roleData;

  const warnings: string[] = [];
  const blockers: string[] = [];
  const affectedPermissions: string[] = [];
  let requiresConfirmation = false;

  // Check for admin role changes (case-insensitive)
  if (roleNames.some(role => role.toLowerCase() === 'admin')) {
    warnings.push('This will grant administrative privileges');
    affectedPermissions.push('User Management', 'System Administration', 'Role Management');
    requiresConfirmation = true;

    // For admin role changes, we always require confirmation but don't block on reason
    // The reason is provided automatically by the UI
  }

  // Check for CJ role (case-insensitive)
  if (roleNames.some(role => role.toLowerCase() === 'cj')) {
    affectedPermissions.push('Report Verification', 'Content Moderation');
  }

  // Check for multiple roles
  if (roleNames.length > 1) {
    warnings.push('User will have multiple roles with combined permissions');
  }

  // Check if removing all roles
  if (roleNames.length === 0) {
    blockers.push('User must have at least one role assigned');
  }

  return {
    canUpdate: blockers.length === 0,
    warnings,
    blockers,
    affectedPermissions,
    requiresConfirmation
  };
};

export const useRoleUpdate = (options: RoleUpdateOptions = {}) => {
  const queryClient = useQueryClient();

  // Mutation for updating user roles using dedicated endpoint
  const updateUserRolesMutation = useMutation({
    mutationFn: ({ userId, rolesData }: { userId: string; rolesData: UpdateUserRolesDto }) =>
      userManagementApi.updateUserRoles(userId, rolesData),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      // Use partial matching to invalidate all user-related queries
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false // This will invalidate all queries that start with ['users']
      });
      queryClient.invalidateQueries({ queryKey: ['userManagementStats'] });

      options.onUpdateSuccess?.();
    },
    onError: (error) => {
      console.error('Failed to update user roles:', error);
      options.onUpdateError?.(error);
    },
  });

  // Combined function to validate and then update user with roles
  const validateAndUpdateRoles = async (
    userId: string,
    roleData: UpdateUserRolesDto,
    skipValidation: boolean = false
  ): Promise<void> => {
    try {
      if (!skipValidation) {
        // Client-side validation of role changes
        const validation = validateRoleUpdateClientSide(roleData);

        // If validation fails (has blockers), throw an error
        if (!validation.canUpdate) {
          const error = new Error('Role update validation failed');
          (error as any).validation = validation;
          throw error;
        }

        // If validation requires confirmation and has warnings,
        // let the calling component handle the confirmation
        if (validation.requiresConfirmation && validation.warnings.length > 0) {
          const confirmationError = new Error('Role update requires confirmation');
          (confirmationError as any).validation = validation;
          (confirmationError as any).requiresConfirmation = true;
          throw confirmationError;
        }
      }

      // If validation passes or is skipped, proceed with the update using dedicated roles API
      const rolesUpdateData: UpdateUserRolesDto = {
        roleNames: roleData.roleNames.map(role => role.toLowerCase()),
        reason: roleData.reason
      };

      await updateUserRolesMutation.mutateAsync({ userId, rolesData: rolesUpdateData });
    } catch (error) {
      // Re-throw the error so the calling component can handle it
      throw error;
    }
  };

  // Function to validate roles only (without updating)
  const validateRoles = async (roleData: UpdateUserRolesDto): Promise<RoleUpdateValidationDto> => {
    return Promise.resolve(validateRoleUpdateClientSide(roleData));
  };

  // Function to update user with roles (without validation)
  const updateRoles = async (userId: string, roleData: UpdateUserRolesDto): Promise<void> => {
    const rolesUpdateData: UpdateUserRolesDto = {
      roleNames: roleData.roleNames.map(role => role.toLowerCase()),
      reason: roleData.reason
    };
    await updateUserRolesMutation.mutateAsync({ userId, rolesData: rolesUpdateData });
  };

  return {
    // Main functions
    validateAndUpdateRoles,
    validateRoles,
    updateRoles,

    // Loading states
    isValidating: false, // Client-side validation is synchronous
    isUpdating: updateUserRolesMutation.isPending,
    isLoading: updateUserRolesMutation.isPending,

    // Error states
    validationError: null, // Client-side validation doesn't have async errors
    updateError: updateUserRolesMutation.error,
    error: updateUserRolesMutation.error,

    // Reset functions
    resetValidation: () => {}, // No async validation to reset
    resetUpdate: updateUserRolesMutation.reset,
    reset: () => {
      updateUserRolesMutation.reset();
    }
  };
};
