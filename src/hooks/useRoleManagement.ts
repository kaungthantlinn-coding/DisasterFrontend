import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleManagementApi, CreateRoleDto, UpdateRoleDto, CloneRoleDto, RoleFilters } from '@/apis/roleManagement';
import { toast } from 'sonner';

// Query Keys
export const roleManagementKeys = {
  all: ['roleManagement'] as const,
  roles: (filters?: RoleFilters) => [...roleManagementKeys.all, 'roles', filters] as const,
  role: (id: number) => [...roleManagementKeys.all, 'role', id] as const,
  roleUsers: (id: number) => [...roleManagementKeys.all, 'roleUsers', id] as const,
};

// Get roles with statistics
export const useRoles = (filters?: RoleFilters) => {
  return useQuery({
    queryKey: roleManagementKeys.roles(filters),
    queryFn: () => roleManagementApi.getRoles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get specific role
export const useRole = (id: number) => {
  return useQuery({
    queryKey: roleManagementKeys.role(id),
    queryFn: () => roleManagementApi.getRole(id),
    enabled: !!id,
  });
};

// Get role users
export const useRoleUsers = (id: number) => {
  return useQuery({
    queryKey: roleManagementKeys.roleUsers(id),
    queryFn: () => roleManagementApi.getRoleUsers(id),
    enabled: !!id,
  });
};

// Create role mutation
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateRoleDto) => roleManagementApi.createRole(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleManagementKeys.all });
      toast.success('Role created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create role';
      toast.error(message);
    },
  });
};

// Update role mutation
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateRoleDto }) => 
      roleManagementApi.updateRole(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleManagementKeys.all });
      toast.success('Role updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update role';
      toast.error(message);
    },
  });
};

// Delete role mutation
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => roleManagementApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleManagementKeys.all });
      toast.success('Role deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete role';
      toast.error(message);
    },
  });
};

// Clone role mutation
export const useCloneRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CloneRoleDto }) => 
      roleManagementApi.cloneRole(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleManagementKeys.all });
      toast.success('Role cloned successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to clone role';
      toast.error(message);
    },
  });
};
