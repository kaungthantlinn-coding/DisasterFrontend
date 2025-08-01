import { apiClient } from './client';

// TypeScript interfaces for API responses
export interface UserListItemDto {
  userId: string;
  name: string;
  email: string;
  photoUrl?: string;
  authProvider: string;
  isBlacklisted: boolean;
  createdAt?: string;
  roleNames: string[];
  lastActive?: string;
  reportsCount?: number;
}

export interface PagedUserListDto {
  users: UserListItemDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UserDetailsDto extends UserListItemDto {
  phone?: string;
  location?: string;
  joinDate?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleNames: string[];
  phone?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  roleNames?: string[];
  phone?: string;
}

export interface ChangeUserPasswordDto {
  newPassword: string;
  confirmPassword: string;
}

export interface BulkUserOperationDto {
  userIds: string[];
  operation: 'blacklist' | 'unblacklist' | 'delete';
}

export interface UserManagementStatsDto {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  adminUsers: number;
  cjUsers: number;
  regularUsers: number;
  newUsersThisMonth: number;
  totalReportsVerified: number;
}

export interface UserDeletionValidationDto {
  canDelete: boolean;
  warnings: string[];
  blockers: string[];
}

export interface UserFilterParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  role?: string;           // Specific role name (was roleFilter)
  status?: string;         // "Active", "Suspended", "All" (was statusFilter)
  isBlacklisted?: boolean;
  authProvider?: string;
  createdAfter?: Date;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// User Management API Service
export const userManagementApi = {
  // Get paginated list of users
  async getUsers(params: UserFilterParams = {}): Promise<PagedUserListDto> {
    const queryParams = new URLSearchParams();

    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.searchTerm && params.searchTerm.trim()) queryParams.append('searchTerm', params.searchTerm.trim());
    if (params.role && params.role !== 'all') {
      queryParams.append('role', params.role);
    }
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params.isBlacklisted !== undefined) queryParams.append('isBlacklisted', params.isBlacklisted.toString());
    if (params.authProvider) queryParams.append('authProvider', params.authProvider);
    if (params.createdAfter) queryParams.append('createdAfter', params.createdAfter.toISOString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const url = `/UserManagement?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get user details by ID
  async getUserById(userId: string): Promise<UserDetailsDto> {
    const response = await apiClient.get(`/UserManagement/${userId}`);
    return response.data;
  },

  // Create new user
  async createUser(userData: CreateUserDto): Promise<UserDetailsDto> {
    const response = await apiClient.post('/UserManagement', userData);
    return response.data;
  },

  // Update user
  async updateUser(userId: string, userData: UpdateUserDto): Promise<UserDetailsDto> {
    const response = await apiClient.put(`/UserManagement/${userId}`, userData);
    return response.data;
  },

  // Delete user
  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/UserManagement/${userId}`);
    return response.data;
  },

  // Blacklist (suspend) user
  async blacklistUser(userId: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/UserManagement/${userId}/blacklist`);
    return response.data;
  },

  // Unblacklist (unsuspend) user
  async unblacklistUser(userId: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/UserManagement/${userId}/unblacklist`);
    return response.data;
  },

  // Change user password
  async changeUserPassword(userId: string, passwordData: ChangeUserPasswordDto): Promise<{ message: string }> {
    const response = await apiClient.post(`/UserManagement/${userId}/change-password`, passwordData);
    return response.data;
  },

  // Bulk operations
  async bulkOperation(operationData: BulkUserOperationDto): Promise<{ affectedCount: number; message: string }> {
    const response = await apiClient.post('/UserManagement/bulk-operation', operationData);
    return response.data;
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<UserManagementStatsDto> {
    const response = await apiClient.get('/UserManagement/dashboard/stats');
    return response.data;
  },

  // Validate user deletion
  async validateDeletion(userId: string): Promise<UserDeletionValidationDto> {
    const response = await apiClient.get(`/UserManagement/${userId}/validate-deletion`);
    return response.data;
  },

  // Get user's report activity (for CJ officers)
  async getUserReportActivity(userId: string): Promise<{
    totalReports: number;
    verifiedReports: number;
    pendingReports: number;
    rejectedReports: number;
  }> {
    const response = await apiClient.get(`/UserManagement/${userId}/report-activity`);
    return response.data;
  },

  // Get available roles for dropdown
  async getAvailableRoles(): Promise<string[]> {
    const response = await apiClient.get('/UserManagement/roles');
    return response.data;
  }
};

// CJ user list ကို fetch လုပ်တဲ့ function
export const fetchCjUsers = async () => {
  const response = await apiClient.get('/UserManagement/cj-users');
  return response.data;
};
