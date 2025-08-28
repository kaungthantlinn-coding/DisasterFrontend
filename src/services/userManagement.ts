import { api } from "./api";
import { UserWithPermissions } from "../types/permissions";

export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  roleIds: string[];
  directPermissions: string[];
  sendWelcomeEmail: boolean;
  requirePasswordChange: boolean;
  notes?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  roleIds?: string[];
  directPermissions?: string[];
  isBlacklisted?: boolean;
  notes?: string;
}

export interface UserListResponse {
  users: UserWithPermissions[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const userManagementApi = {
  // Create a new user
  createUser: async (
    userData: CreateUserRequest
  ): Promise<UserWithPermissions> => {
    const response = await api.post("/admin/users", userData);
    return response.data;
  },

  // Get all users with pagination and filtering
  getUsers: async (
    page = 1,
    pageSize = 10,
    search?: string,
    role?: string,
    status?: string
  ): Promise<UserListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (search) params.append("search", search);
    if (role) params.append("role", role);
    if (status) params.append("status", status);

    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  // Get a specific user by ID
  getUser: async (userId: string): Promise<UserWithPermissions> => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update a user
  updateUser: async (
    userId: string,
    userData: UpdateUserRequest
  ): Promise<UserWithPermissions> => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete a user
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  // Bulk operations
  bulkActivateUsers: async (userIds: string[]): Promise<void> => {
    await api.post("/admin/users/bulk/activate", { userIds });
  },

  bulkDeactivateUsers: async (userIds: string[]): Promise<void> => {
    await api.post("/admin/users/bulk/deactivate", { userIds });
  },

  bulkDeleteUsers: async (userIds: string[]): Promise<void> => {
    await api.post("/admin/users/bulk/delete", { userIds });
  },

  // Blacklist operations
  blacklistUser: async (userId: string, reason?: string): Promise<void> => {
    await api.post(`/admin/users/${userId}/blacklist`, { reason });
  },

  removeFromBlacklist: async (userId: string): Promise<void> => {
    await api.post(`/admin/users/${userId}/remove-blacklist`);
  },

  // Password operations
  resetUserPassword: async (
    userId: string,
    newPassword: string
  ): Promise<void> => {
    await api.post(`/admin/users/${userId}/reset-password`, {
      password: newPassword,
    });
  },

  sendPasswordResetEmail: async (userId: string): Promise<void> => {
    await api.post(`/admin/users/${userId}/send-password-reset`);
  },

  // User permissions
  updateUserPermissions: async (
    userId: string,
    permissions: string[]
  ): Promise<void> => {
    await api.put(`/admin/users/${userId}/permissions`, { permissions });
  },

  // User roles
  updateUserRoles: async (userId: string, roleIds: string[]): Promise<void> => {
    await api.put(`/admin/users/${userId}/roles`, { roleIds });
  },

  // Export users
  exportUsers: async (format: "csv" | "json" | "xlsx"): Promise<Blob> => {
    const response = await api.get(`/admin/users/export?format=${format}`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Import users
  importUsers: async (
    file: File
  ): Promise<{ success: number; failed: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/admin/users/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
