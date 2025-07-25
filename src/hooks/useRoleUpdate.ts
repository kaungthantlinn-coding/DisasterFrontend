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
  const { roleNames, reason } = roleData;

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

  // Mutation for updating user (including roles) using existing working endpoint
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: UpdateUserDto }) =>
      userManagementApi.updateUser(userId, userData),
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
      console.error('Failed to update user:', error);
      options.onUpdateError?.(error);
    },
  });

  // Combined function to validate and then update user with roles
  const validateAndUpdateRoles = async (
    userId: string,
    roleData: UpdateUserRolesDto,
    otherUserData: Partial<UpdateUserDto> = {},
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

      // If validation passes or is skipped, proceed with the update using existing API
      const updateData: UpdateUserDto = {
        ...otherUserData,
        roleNames: roleData.roleNames
      };

      await updateUserMutation.mutateAsync({ userId, userData: updateData });
    } catch (error) {
      // Re-throw the error so the calling component can handle it
      throw error;
    }
  };

  // Function to validate roles only (without updating)
  const validateRoles = async (userId: string, roleData: UpdateUserRolesDto): Promise<RoleUpdateValidationDto> => {
    return Promise.resolve(validateRoleUpdateClientSide(roleData));
  };

  // Function to update user with roles (without validation)
  const updateRoles = async (userId: string, roleData: UpdateUserRolesDto, otherUserData: Partial<UpdateUserDto> = {}): Promise<void> => {
    const updateData: UpdateUserDto = {
      ...otherUserData,
      roleNames: roleData.roleNames
    };
    return updateUserMutation.mutateAsync({ userId, userData: updateData });
  };

  return {
    // Main functions
    validateAndUpdateRoles,
    validateRoles,
    updateRoles,

    // Loading states
    isValidating: false, // Client-side validation is synchronous
    isUpdating: updateUserMutation.isPending,
    isLoading: updateUserMutation.isPending,

    // Error states
    validationError: null, // Client-side validation doesn't have async errors
    updateError: updateUserMutation.error,
    error: updateUserMutation.error,

    // Reset functions
    resetValidation: () => {}, // No async validation to reset
    resetUpdate: updateUserMutation.reset,
    reset: () => {
      updateUserMutation.reset();
    }
  };
};
