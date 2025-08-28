import { apiClient } from "./client";

import {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  RoleManagementResponse,
  RoleUserDto,
} from "../types/roles";

export interface RoleFilters {
  search?: string;
  filter?: string;
}

// API Functions
export const roleManagementApi = {
  // Get all roles with statistics
  getRoles: async (filters?: RoleFilters): Promise<RoleManagementResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.filter && filters.filter !== "all")
      params.append("filter", filters.filter);

    const response = await apiClient.get(
      `/RoleManagement?${params.toString()}`
    );
    return response.data;
  },

  // Get specific role
  getRole: async (id: string): Promise<Role> => {
    const response = await apiClient.get(`/RoleManagement/${id}`);
    return response.data;
  },

  // Create new role
  createRole: async (dto: CreateRoleDto): Promise<Role> => {
    const response = await apiClient.post("/RoleManagement", dto);
    return response.data;
  },

  // Update role
  updateRole: async (id: string, dto: UpdateRoleDto): Promise<Role> => {
    const response = await apiClient.put(`/RoleManagement/${id}`, dto);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete(`/RoleManagement/${id}`);
  },

  // Get users with specific role
  getRoleUsers: async (id: string): Promise<RoleUserDto[]> => {
    const response = await apiClient.get(`/RoleManagement/${id}/users`);
    return response.data;
  },
};
