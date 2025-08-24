export interface Role {
  id: string; // Changed from number to Guid string
  name: string;
  description: string;
  isActive: boolean;
  isSystem: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface RoleStatistics {
  totalRoles: number;
  activeRoles: number;
  systemRoles: number;
  customRoles: number;
  totalUsers: number;
}

export interface CreateRoleDto {
  name: string;
  description: string;
}

export interface UpdateRoleDto {
  name: string;
  description: string;
  isActive: boolean;
}

export interface RoleManagementResponse {
  roles: Role[];
  statistics: RoleStatistics;
}

export interface RoleUserDto {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}
