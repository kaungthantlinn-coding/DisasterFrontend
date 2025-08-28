export enum AuditAction {
  // User Management
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  USER_DELETED = "USER_DELETED",
  USER_BLACKLISTED = "USER_BLACKLISTED",
  USER_UNBLACKLISTED = "USER_UNBLACKLISTED",
  USER_PASSWORD_CHANGED = "USER_PASSWORD_CHANGED",
  USER_BULK_OPERATION = "USER_BULK_OPERATION",

  // Role Management
  ROLE_CREATED = "ROLE_CREATED",
  ROLE_UPDATED = "ROLE_UPDATED",
  ROLE_DELETED = "ROLE_DELETED",
  ROLE_ASSIGNED = "ROLE_ASSIGNED",
  ROLE_REVOKED = "ROLE_REVOKED",
  ROLE_DUPLICATED = "ROLE_DUPLICATED",

  // Permission Management
  PERMISSION_GRANTED = "PERMISSION_GRANTED",
  PERMISSION_REVOKED = "PERMISSION_REVOKED",
  PERMISSION_BULK_UPDATE = "PERMISSION_BULK_UPDATE",

  // System Settings
  SYSTEM_SETTING_CHANGED = "SYSTEM_SETTING_CHANGED",
  SYSTEM_BACKUP_CREATED = "SYSTEM_BACKUP_CREATED",
  SYSTEM_RESTORE_PERFORMED = "SYSTEM_RESTORE_PERFORMED",

  // Authentication
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",
  LOGOUT = "LOGOUT",
  PASSWORD_RESET_REQUESTED = "PASSWORD_RESET_REQUESTED",
  PASSWORD_RESET_COMPLETED = "PASSWORD_RESET_COMPLETED",

  // Report Management
  REPORT_CREATED = "REPORT_CREATED",
  REPORT_UPDATED = "REPORT_UPDATED",
  REPORT_DELETED = "REPORT_DELETED",
  REPORT_STATUS_CHANGED = "REPORT_STATUS_CHANGED",

  // Data Export/Import
  DATA_EXPORTED = "DATA_EXPORTED",
  DATA_IMPORTED = "DATA_IMPORTED",

  // Security Events
  SUSPICIOUS_ACTIVITY_DETECTED = "SUSPICIOUS_ACTIVITY_DETECTED",
  SECURITY_BREACH_ATTEMPT = "SECURITY_BREACH_ATTEMPT",
  ACCESS_DENIED = "ACCESS_DENIED",
}

export enum AuditSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum AuditCategory {
  USER_MANAGEMENT = "USER_MANAGEMENT",
  ROLE_MANAGEMENT = "ROLE_MANAGEMENT",
  PERMISSION_MANAGEMENT = "PERMISSION_MANAGEMENT",
  SYSTEM_ADMINISTRATION = "SYSTEM_ADMINISTRATION",
  AUTHENTICATION = "AUTHENTICATION",
  REPORT_MANAGEMENT = "REPORT_MANAGEMENT",
  DATA_MANAGEMENT = "DATA_MANAGEMENT",
  SECURITY = "SECURITY",
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  category: AuditCategory;
  severity: AuditSeverity;

  // Actor information
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;

  // Target information (what was acted upon)
  targetType: string; // 'user', 'role', 'permission', 'system', etc.
  targetId?: string;
  targetName?: string;

  // Action details
  description: string;
  details: Record<string, any>;

  // Context information
  ipAddress: string;
  userAgent: string;
  sessionId?: string;

  // Additional metadata
  success: boolean;
  errorMessage?: string;
  duration?: number; // in milliseconds
  affectedRecords?: number;

  // Change tracking
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;

  // Compliance and retention
  retentionDate?: string;
  complianceFlags?: string[];
}

export interface AuditLogFilter {
  startDate?: string;
  endDate?: string;
  actions?: AuditAction[];
  categories?: AuditCategory[];
  severities?: AuditSeverity[];
  actorIds?: string[];
  targetTypes?: string[];
  targetIds?: string[];
  success?: boolean;
  ipAddress?: string;
  searchTerm?: string;
}

export interface AuditLogStats {
  totalEntries: number;
  entriesByCategory: Record<AuditCategory, number>;
  entriesBySeverity: Record<AuditSeverity, number>;
  entriesByAction: Record<AuditAction, number>;
  topActors: Array<{
    actorId: string;
    actorName: string;
    count: number;
  }>;
  recentActivity: AuditLogEntry[];
  failureRate: number;
  averageResponseTime: number;
}

export interface AuditLogExportOptions {
  format: "csv" | "json" | "pdf";
  filter?: AuditLogFilter;
  includeDetails?: boolean;
  includeSystemInfo?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CreateAuditLogRequest {
  action: AuditAction;
  category: AuditCategory;
  severity: AuditSeverity;
  targetType: string;
  targetId?: string;
  targetName?: string;
  description: string;
  details?: Record<string, any>;
  success?: boolean;
  errorMessage?: string;
  duration?: number;
  affectedRecords?: number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export interface AuditLogResponse {
  entries: AuditLogEntry[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AuditAlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: {
    actions?: AuditAction[];
    categories?: AuditCategory[];
    severities?: AuditSeverity[];
    failureThreshold?: number;
    timeWindow?: number; // in minutes
    targetTypes?: string[];
  };
  notifications: {
    email?: string[];
    webhook?: string;
    slack?: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AuditComplianceReport {
  id: string;
  reportType: "GDPR" | "SOX" | "HIPAA" | "CUSTOM";
  generatedAt: string;
  generatedBy: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalActions: number;
    criticalActions: number;
    failedActions: number;
    uniqueActors: number;
    dataAccessEvents: number;
    securityEvents: number;
  };
  findings: Array<{
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    category: string;
    description: string;
    count: number;
    recommendations: string[];
  }>;
  downloadUrl?: string;
}

// Utility types for audit logging
export type AuditContext = {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
};

export type AuditTarget = {
  type: string;
  id?: string;
  name?: string;
};

export type AuditChange = {
  field: string;
  oldValue: any;
  newValue: any;
};

// Action-specific audit data interfaces
export interface UserAuditData {
  userId: string;
  userName: string;
  userEmail: string;
  changes?: AuditChange[];
  roles?: string[];
  permissions?: string[];
}

export interface RoleAuditData {
  roleId: string;
  roleName: string;
  permissions?: string[];
  assignedUsers?: string[];
  changes?: AuditChange[];
}

export interface PermissionAuditData {
  permission: string;
  grantedTo?: string; // user or role ID
  grantedToType: "user" | "role";
  grantedToName: string;
}

export interface SystemAuditData {
  setting?: string;
  component?: string;
  version?: string;
  changes?: AuditChange[];
}

// Constants for audit logging
export const AUDIT_RETENTION_DAYS = {
  LOW: 30,
  MEDIUM: 90,
  HIGH: 365,
  CRITICAL: 2555, // 7 years
};

export const AUDIT_ACTION_DESCRIPTIONS: Record<AuditAction, string> = {
  [AuditAction.USER_CREATED]: "New user account created",
  [AuditAction.USER_UPDATED]: "User account information updated",
  [AuditAction.USER_DELETED]: "User account deleted",
  [AuditAction.USER_BLACKLISTED]: "User account blacklisted",
  [AuditAction.USER_UNBLACKLISTED]: "User account removed from blacklist",
  [AuditAction.USER_PASSWORD_CHANGED]: "User password changed",
  [AuditAction.USER_BULK_OPERATION]: "Bulk operation performed on users",
  [AuditAction.ROLE_CREATED]: "New role created",
  [AuditAction.ROLE_UPDATED]: "Role updated",
  [AuditAction.ROLE_DELETED]: "Role deleted",
  [AuditAction.ROLE_ASSIGNED]: "Role assigned to user",
  [AuditAction.ROLE_REVOKED]: "Role revoked from user",
  [AuditAction.ROLE_DUPLICATED]: "Role duplicated",
  [AuditAction.PERMISSION_GRANTED]: "Permission granted",
  [AuditAction.PERMISSION_REVOKED]: "Permission revoked",
  [AuditAction.PERMISSION_BULK_UPDATE]: "Bulk permission update performed",
  [AuditAction.SYSTEM_SETTING_CHANGED]: "System setting changed",
  [AuditAction.SYSTEM_BACKUP_CREATED]: "System backup created",
  [AuditAction.SYSTEM_RESTORE_PERFORMED]: "System restore performed",
  [AuditAction.LOGIN_SUCCESS]: "Successful login",
  [AuditAction.LOGIN_FAILED]: "Failed login attempt",
  [AuditAction.LOGOUT]: "User logged out",
  [AuditAction.PASSWORD_RESET_REQUESTED]: "Password reset requested",
  [AuditAction.PASSWORD_RESET_COMPLETED]: "Password reset completed",
  [AuditAction.REPORT_CREATED]: "Report created",
  [AuditAction.REPORT_UPDATED]: "Report updated",
  [AuditAction.REPORT_DELETED]: "Report deleted",
  [AuditAction.REPORT_STATUS_CHANGED]: "Report status changed",
  [AuditAction.DATA_EXPORTED]: "Data exported",
  [AuditAction.DATA_IMPORTED]: "Data imported",
  [AuditAction.SUSPICIOUS_ACTIVITY_DETECTED]: "Suspicious activity detected",
  [AuditAction.SECURITY_BREACH_ATTEMPT]: "Security breach attempt",
  [AuditAction.ACCESS_DENIED]: "Access denied",
};

export const AUDIT_CATEGORY_COLORS: Record<AuditCategory, string> = {
  [AuditCategory.USER_MANAGEMENT]: "#3B82F6", // blue
  [AuditCategory.ROLE_MANAGEMENT]: "#8B5CF6", // purple
  [AuditCategory.PERMISSION_MANAGEMENT]: "#06B6D4", // cyan
  [AuditCategory.SYSTEM_ADMINISTRATION]: "#10B981", // emerald
  [AuditCategory.AUTHENTICATION]: "#F59E0B", // amber
  [AuditCategory.REPORT_MANAGEMENT]: "#EF4444", // red
  [AuditCategory.DATA_MANAGEMENT]: "#84CC16", // lime
  [AuditCategory.SECURITY]: "#DC2626", // red-600
};

export const AUDIT_SEVERITY_COLORS: Record<AuditSeverity, string> = {
  [AuditSeverity.LOW]: "#10B981", // green
  [AuditSeverity.MEDIUM]: "#F59E0B", // amber
  [AuditSeverity.HIGH]: "#EF4444", // red
  [AuditSeverity.CRITICAL]: "#DC2626", // red-600
};
