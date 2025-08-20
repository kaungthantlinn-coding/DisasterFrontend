import { apiClient } from './client';

export interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  isSystem: boolean;
  isActive: boolean;
  category: 'system' | 'emergency' | 'operational' | 'public';
  createdAt: string;
  lastModified: string;
}

export interface RoleStatistics {
  totalRoles: number;
  systemRoles: number;
  emergencyRoles: number;
  operationalRoles: number;
  publicRoles: number;
  totalUsers: number;
}

export interface CreateRoleDto {
  name: string;
  description: string;
  category: 'system' | 'emergency' | 'operational' | 'public';
}

export interface UpdateRoleDto {
  name: string;
  description: string;
  category: 'system' | 'emergency' | 'operational' | 'public';
  isActive: boolean;
}

export interface CloneRoleDto {
  name: string;
  description?: string;
}

export interface RoleManagementResponse {
  roles: Role[];
  statistics: RoleStatistics;
}

export interface RoleFilters {
  search?: string;
  category?: string;
  filter?: string;
}

// API Functions
export const roleManagementApi = {
  // Get all roles with statistics
  getRoles: async (filters?: RoleFilters): Promise<RoleManagementResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters?.filter && filters.filter !== 'all') params.append('filter', filters.filter);
    
    const response = await apiClient.get(`/RoleManagement?${params.toString()}`);
    return response.data;
  },

  // Get specific role
  getRole: async (id: number): Promise<Role> => {
    const response = await apiClient.get(`/RoleManagement/${id}`);
    return response.data;
  },

  // Create new role
  createRole: async (dto: CreateRoleDto): Promise<Role> => {
    const response = await apiClient.post('/RoleManagement', dto);
    return response.data;
  },

  // Update role
  updateRole: async (id: number, dto: UpdateRoleDto): Promise<Role> => {
    const response = await apiClient.put(`/RoleManagement/${id}`, dto);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: number): Promise<void> => {
    await apiClient.delete(`/RoleManagement/${id}`);
  },

  // Clone role
  cloneRole: async (id: number, dto: CloneRoleDto): Promise<Role> => {
    const response = await apiClient.post(`/RoleManagement/${id}/clone`, dto);
    return response.data;
  },

  // Get users with specific role
  getRoleUsers: async (id: number): Promise<any[]> => {
    const response = await apiClient.get(`/RoleManagement/${id}/users`);
    return response.data;
  }
};
