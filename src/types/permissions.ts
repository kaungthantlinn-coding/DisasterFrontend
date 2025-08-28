// Permission system types and constants

// Core permission categories
export enum PermissionCategory {
  USER_MANAGEMENT = "user_management",
  REPORT_MANAGEMENT = "report_management",
  SYSTEM_SETTINGS = "system_settings",
  AUDIT_LOGS = "audit_logs",
  ROLE_MANAGEMENT = "role_management",
  DASHBOARD_ACCESS = "dashboard_access",
  COMMUNICATION = "communication",
}

// Granular permissions
export enum Permission {
  // User Management Permissions
  CREATE_USER = "create_user",
  VIEW_USER = "view_user",
  EDIT_USER = "edit_user",
  DELETE_USER = "delete_user",
  SUSPEND_USER = "suspend_user",
  UNSUSPEND_USER = "unsuspend_user",
  CHANGE_USER_PASSWORD = "change_user_password",
  VIEW_USER_DETAILS = "view_user_details",
  BULK_USER_OPERATIONS = "bulk_user_operations",
  EXPORT_USER_DATA = "export_user_data",

  // Role Management Permissions
  CREATE_ROLE = "create_role",
  VIEW_ROLE = "view_role",
  EDIT_ROLE = "edit_role",
  DELETE_ROLE = "delete_role",
  ASSIGN_ROLE = "assign_role",
  REVOKE_ROLE = "revoke_role",
  MANAGE_PERMISSIONS = "manage_permissions",

  // Report Management Permissions
  CREATE_REPORT = "create_report",
  VIEW_REPORT = "view_report",
  EDIT_REPORT = "edit_report",
  DELETE_REPORT = "delete_report",
  VERIFY_REPORT = "verify_report",
  REJECT_REPORT = "reject_report",
  PUBLISH_REPORT = "publish_report",
  VIEW_ALL_REPORTS = "view_all_reports",
  EXPORT_REPORT_DATA = "export_report_data",

  // System Settings Permissions
  VIEW_SYSTEM_SETTINGS = "view_system_settings",
  EDIT_SYSTEM_SETTINGS = "edit_system_settings",
  MANAGE_INTEGRATIONS = "manage_integrations",
  CONFIGURE_NOTIFICATIONS = "configure_notifications",
  MANAGE_BACKUP_SETTINGS = "manage_backup_settings",

  // Audit Log Permissions
  VIEW_AUDIT_LOGS = "view_audit_logs",
  EXPORT_AUDIT_LOGS = "export_audit_logs",
  DELETE_AUDIT_LOGS = "delete_audit_logs",

  // Dashboard Access Permissions
  VIEW_ADMIN_DASHBOARD = "view_admin_dashboard",
  VIEW_CJ_DASHBOARD = "view_cj_dashboard",
  VIEW_USER_DASHBOARD = "view_user_dashboard",
  VIEW_ANALYTICS = "view_analytics",
  VIEW_STATISTICS = "view_statistics",

  // Communication Permissions
  SEND_NOTIFICATIONS = "send_notifications",
  MANAGE_SUPPORT_REQUESTS = "manage_support_requests",
  BROADCAST_MESSAGES = "broadcast_messages",
}

// Permission metadata for UI display
export interface PermissionMetadata {
  id: Permission;
  name: string;
  description: string;
  category: PermissionCategory;
  isSystemCritical: boolean;
  requiresConfirmation: boolean;
}

// Role definition
export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// User with enhanced permission structure
export interface UserWithPermissions {
  userId: string;
  name: string;
  email: string;
  photoUrl?: string;
  roles: Role[];
  directPermissions: Permission[]; // Permissions assigned directly to user
  effectivePermissions: Permission[]; // Combined permissions from roles + direct
  isBlacklisted?: boolean;
  isSuperAdmin?: boolean;
}

// Permission assignment/revocation tracking
export interface PermissionChange {
  id: string;
  userId: string;
  permission: Permission;
  action: "granted" | "revoked";
  grantedBy: string;
  reason?: string;
  timestamp: string;
  expiresAt?: string;
}

// Role assignment tracking
export interface RoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: string;
  reason?: string;
  isActive: boolean;
}

// Permission validation result
export interface PermissionValidationResult {
  hasPermission: boolean;
  missingPermissions: Permission[];
  warnings: string[];
  blockers: string[];
}

// Bulk permission operation
export interface BulkPermissionOperation {
  userIds: string[];
  permissions: Permission[];
  action: "grant" | "revoke";
  reason?: string;
}

// Permission group for easier management
export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  category: PermissionCategory;
}

// System role definitions
export const SYSTEM_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  CJ: "cj",
  USER: "user",
} as const;

// Permission metadata mapping
export const PERMISSION_METADATA: Record<Permission, PermissionMetadata> = {
  // User Management
  [Permission.CREATE_USER]: {
    id: Permission.CREATE_USER,
    name: "Create User",
    description: "Create new user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.VIEW_USER]: {
    id: Permission.VIEW_USER,
    name: "View User",
    description: "View user information",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.EDIT_USER]: {
    id: Permission.EDIT_USER,
    name: "Edit User",
    description: "Edit user information",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.DELETE_USER]: {
    id: Permission.DELETE_USER,
    name: "Delete User",
    description: "Delete user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.SUSPEND_USER]: {
    id: Permission.SUSPEND_USER,
    name: "Suspend User",
    description: "Suspend user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.UNSUSPEND_USER]: {
    id: Permission.UNSUSPEND_USER,
    name: "Unsuspend User",
    description: "Reactivate suspended user accounts",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.CHANGE_USER_PASSWORD]: {
    id: Permission.CHANGE_USER_PASSWORD,
    name: "Change User Password",
    description: "Reset or change user passwords",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.VIEW_USER_DETAILS]: {
    id: Permission.VIEW_USER_DETAILS,
    name: "View User Details",
    description: "View detailed user information",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.BULK_USER_OPERATIONS]: {
    id: Permission.BULK_USER_OPERATIONS,
    name: "Bulk User Operations",
    description: "Perform bulk operations on multiple users",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.EXPORT_USER_DATA]: {
    id: Permission.EXPORT_USER_DATA,
    name: "Export User Data",
    description: "Export user data to various formats",
    category: PermissionCategory.USER_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },

  // Role Management
  [Permission.CREATE_ROLE]: {
    id: Permission.CREATE_ROLE,
    name: "Create Role",
    description: "Create new roles",
    category: PermissionCategory.ROLE_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.VIEW_ROLE]: {
    id: Permission.VIEW_ROLE,
    name: "View Role",
    description: "View role information",
    category: PermissionCategory.ROLE_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.EDIT_ROLE]: {
    id: Permission.EDIT_ROLE,
    name: "Edit Role",
    description: "Edit role information and permissions",
    category: PermissionCategory.ROLE_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.DELETE_ROLE]: {
    id: Permission.DELETE_ROLE,
    name: "Delete Role",
    description: "Delete roles",
    category: PermissionCategory.ROLE_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.ASSIGN_ROLE]: {
    id: Permission.ASSIGN_ROLE,
    name: "Assign Role",
    description: "Assign roles to users",
    category: PermissionCategory.ROLE_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.REVOKE_ROLE]: {
    id: Permission.REVOKE_ROLE,
    name: "Revoke Role",
    description: "Remove roles from users",
    category: PermissionCategory.ROLE_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.MANAGE_PERMISSIONS]: {
    id: Permission.MANAGE_PERMISSIONS,
    name: "Manage Permissions",
    description: "Manage individual permissions",
    category: PermissionCategory.ROLE_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },

  // Report Management
  [Permission.CREATE_REPORT]: {
    id: Permission.CREATE_REPORT,
    name: "Create Report",
    description: "Create new disaster reports",
    category: PermissionCategory.REPORT_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.VIEW_REPORT]: {
    id: Permission.VIEW_REPORT,
    name: "View Report",
    description: "View disaster reports",
    category: PermissionCategory.REPORT_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.EDIT_REPORT]: {
    id: Permission.EDIT_REPORT,
    name: "Edit Report",
    description: "Edit disaster reports",
    category: PermissionCategory.REPORT_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.DELETE_REPORT]: {
    id: Permission.DELETE_REPORT,
    name: "Delete Report",
    description: "Delete disaster reports",
    category: PermissionCategory.REPORT_MANAGEMENT,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.VERIFY_REPORT]: {
    id: Permission.VERIFY_REPORT,
    name: "Verify Report",
    description: "Verify and approve disaster reports",
    category: PermissionCategory.REPORT_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.REJECT_REPORT]: {
    id: Permission.REJECT_REPORT,
    name: "Reject Report",
    description: "Reject disaster reports",
    category: PermissionCategory.REPORT_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.PUBLISH_REPORT]: {
    id: Permission.PUBLISH_REPORT,
    name: "Publish Report",
    description: "Publish reports to public",
    category: PermissionCategory.REPORT_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.VIEW_ALL_REPORTS]: {
    id: Permission.VIEW_ALL_REPORTS,
    name: "View All Reports",
    description: "View all disaster reports in system",
    category: PermissionCategory.REPORT_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.EXPORT_REPORT_DATA]: {
    id: Permission.EXPORT_REPORT_DATA,
    name: "Export Report Data",
    description: "Export report data to various formats",
    category: PermissionCategory.REPORT_MANAGEMENT,
    isSystemCritical: false,
    requiresConfirmation: false,
  },

  // System Settings
  [Permission.VIEW_SYSTEM_SETTINGS]: {
    id: Permission.VIEW_SYSTEM_SETTINGS,
    name: "View System Settings",
    description: "View system configuration settings",
    category: PermissionCategory.SYSTEM_SETTINGS,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.EDIT_SYSTEM_SETTINGS]: {
    id: Permission.EDIT_SYSTEM_SETTINGS,
    name: "Edit System Settings",
    description: "Modify system configuration settings",
    category: PermissionCategory.SYSTEM_SETTINGS,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.MANAGE_INTEGRATIONS]: {
    id: Permission.MANAGE_INTEGRATIONS,
    name: "Manage Integrations",
    description: "Manage third-party integrations",
    category: PermissionCategory.SYSTEM_SETTINGS,
    isSystemCritical: true,
    requiresConfirmation: true,
  },
  [Permission.CONFIGURE_NOTIFICATIONS]: {
    id: Permission.CONFIGURE_NOTIFICATIONS,
    name: "Configure Notifications",
    description: "Configure notification settings",
    category: PermissionCategory.SYSTEM_SETTINGS,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.MANAGE_BACKUP_SETTINGS]: {
    id: Permission.MANAGE_BACKUP_SETTINGS,
    name: "Manage Backup Settings",
    description: "Configure backup and recovery settings",
    category: PermissionCategory.SYSTEM_SETTINGS,
    isSystemCritical: true,
    requiresConfirmation: true,
  },

  // Audit Logs
  [Permission.VIEW_AUDIT_LOGS]: {
    id: Permission.VIEW_AUDIT_LOGS,
    name: "View Audit Logs",
    description: "View system audit logs",
    category: PermissionCategory.AUDIT_LOGS,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.EXPORT_AUDIT_LOGS]: {
    id: Permission.EXPORT_AUDIT_LOGS,
    name: "Export Audit Logs",
    description: "Export audit logs to various formats",
    category: PermissionCategory.AUDIT_LOGS,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.DELETE_AUDIT_LOGS]: {
    id: Permission.DELETE_AUDIT_LOGS,
    name: "Delete Audit Logs",
    description: "Delete audit log entries",
    category: PermissionCategory.AUDIT_LOGS,
    isSystemCritical: true,
    requiresConfirmation: true,
  },

  // Dashboard Access
  [Permission.VIEW_ADMIN_DASHBOARD]: {
    id: Permission.VIEW_ADMIN_DASHBOARD,
    name: "View Admin Dashboard",
    description: "Access administrative dashboard",
    category: PermissionCategory.DASHBOARD_ACCESS,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.VIEW_CJ_DASHBOARD]: {
    id: Permission.VIEW_CJ_DASHBOARD,
    name: "View CJ Dashboard",
    description: "Access CJ officer dashboard",
    category: PermissionCategory.DASHBOARD_ACCESS,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.VIEW_USER_DASHBOARD]: {
    id: Permission.VIEW_USER_DASHBOARD,
    name: "View User Dashboard",
    description: "Access user dashboard",
    category: PermissionCategory.DASHBOARD_ACCESS,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.VIEW_ANALYTICS]: {
    id: Permission.VIEW_ANALYTICS,
    name: "View Analytics",
    description: "View system analytics and insights",
    category: PermissionCategory.DASHBOARD_ACCESS,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.VIEW_STATISTICS]: {
    id: Permission.VIEW_STATISTICS,
    name: "View Statistics",
    description: "View system statistics",
    category: PermissionCategory.DASHBOARD_ACCESS,
    isSystemCritical: false,
    requiresConfirmation: false,
  },

  // Communication
  [Permission.SEND_NOTIFICATIONS]: {
    id: Permission.SEND_NOTIFICATIONS,
    name: "Send Notifications",
    description: "Send notifications to users",
    category: PermissionCategory.COMMUNICATION,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.MANAGE_SUPPORT_REQUESTS]: {
    id: Permission.MANAGE_SUPPORT_REQUESTS,
    name: "Manage Support Requests",
    description: "Handle user support requests",
    category: PermissionCategory.COMMUNICATION,
    isSystemCritical: false,
    requiresConfirmation: false,
  },
  [Permission.BROADCAST_MESSAGES]: {
    id: Permission.BROADCAST_MESSAGES,
    name: "Broadcast Messages",
    description: "Send broadcast messages to all users",
    category: PermissionCategory.COMMUNICATION,
    isSystemCritical: false,
    requiresConfirmation: true,
  },
};

// Default role permissions
export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [SYSTEM_ROLES.SUPER_ADMIN]: Object.values(Permission), // All permissions
  [SYSTEM_ROLES.ADMIN]: [
    // User Management
    Permission.VIEW_USER,
    Permission.EDIT_USER,
    Permission.SUSPEND_USER,
    Permission.UNSUSPEND_USER,
    Permission.VIEW_USER_DETAILS,
    Permission.EXPORT_USER_DATA,

    // Report Management
    Permission.CREATE_REPORT,
    Permission.VIEW_REPORT,
    Permission.EDIT_REPORT,
    Permission.VERIFY_REPORT,
    Permission.REJECT_REPORT,
    Permission.PUBLISH_REPORT,
    Permission.VIEW_ALL_REPORTS,
    Permission.EXPORT_REPORT_DATA,

    // System Settings
    Permission.VIEW_SYSTEM_SETTINGS,
    Permission.CONFIGURE_NOTIFICATIONS,

    // Dashboard Access
    Permission.VIEW_ADMIN_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_STATISTICS,

    // Communication
    Permission.SEND_NOTIFICATIONS,
    Permission.MANAGE_SUPPORT_REQUESTS,
  ],
  [SYSTEM_ROLES.CJ]: [
    // Report Management
    Permission.CREATE_REPORT,
    Permission.VIEW_REPORT,
    Permission.EDIT_REPORT,
    Permission.VERIFY_REPORT,
    Permission.REJECT_REPORT,
    Permission.VIEW_ALL_REPORTS,

    // Dashboard Access
    Permission.VIEW_CJ_DASHBOARD,
    Permission.VIEW_STATISTICS,

    // Communication
    Permission.SEND_NOTIFICATIONS,
  ],
  [SYSTEM_ROLES.USER]: [
    // Report Management
    Permission.CREATE_REPORT,
    Permission.VIEW_REPORT,

    // Dashboard Access
    Permission.VIEW_USER_DASHBOARD,
  ],
};

// Permission groups for easier management
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "user_management_basic",
    name: "Basic User Management",
    description: "Basic user viewing and editing capabilities",
    category: PermissionCategory.USER_MANAGEMENT,
    permissions: [Permission.VIEW_USER, Permission.VIEW_USER_DETAILS],
  },
  {
    id: "user_management_advanced",
    name: "Advanced User Management",
    description: "Full user management capabilities",
    category: PermissionCategory.USER_MANAGEMENT,
    permissions: [
      Permission.CREATE_USER,
      Permission.EDIT_USER,
      Permission.DELETE_USER,
      Permission.SUSPEND_USER,
      Permission.UNSUSPEND_USER,
      Permission.BULK_USER_OPERATIONS,
    ],
  },
  {
    id: "report_management_basic",
    name: "Basic Report Management",
    description: "Basic report viewing and creation",
    category: PermissionCategory.REPORT_MANAGEMENT,
    permissions: [Permission.CREATE_REPORT, Permission.VIEW_REPORT],
  },
  {
    id: "report_management_advanced",
    name: "Advanced Report Management",
    description: "Full report management capabilities",
    category: PermissionCategory.REPORT_MANAGEMENT,
    permissions: [
      Permission.EDIT_REPORT,
      Permission.DELETE_REPORT,
      Permission.VERIFY_REPORT,
      Permission.REJECT_REPORT,
      Permission.PUBLISH_REPORT,
      Permission.VIEW_ALL_REPORTS,
    ],
  },
  {
    id: "system_administration",
    name: "System Administration",
    description: "System configuration and management",
    category: PermissionCategory.SYSTEM_SETTINGS,
    permissions: [
      Permission.VIEW_SYSTEM_SETTINGS,
      Permission.EDIT_SYSTEM_SETTINGS,
      Permission.MANAGE_INTEGRATIONS,
      Permission.MANAGE_BACKUP_SETTINGS,
    ],
  },
];
