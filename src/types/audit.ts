export enum AuditAction {
  // 1. Authentication & User Access
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_FAILED_LOGIN = 'USER_FAILED_LOGIN',
  USER_PASSWORD_CHANGE = 'USER_PASSWORD_CHANGE',
  USER_ROLE_CHANGE = 'USER_ROLE_CHANGE',
  USER_BLACKLISTED = 'USER_BLACKLISTED',
  USER_UNBLACKLISTED = 'USER_UNBLACKLISTED',
  
  // User Management (Extended)
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_BULK_OPERATION = 'USER_BULK_OPERATION',
  
  // Role Management
  ROLE_CREATED = 'ROLE_CREATED',
  ROLE_UPDATED = 'ROLE_UPDATED',
  ROLE_DELETED = 'ROLE_DELETED',
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ROLE_REVOKED = 'ROLE_REVOKED',
  ROLE_DUPLICATED = 'ROLE_DUPLICATED',
  
  // Permission Management
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  PERMISSION_BULK_UPDATE = 'PERMISSION_BULK_UPDATE',
  
  // 2. Disaster Report Management
  REPORT_CREATE = 'REPORT_CREATE',
  REPORT_UPDATE = 'REPORT_UPDATE',
  REPORT_DELETE = 'REPORT_DELETE',
  REPORT_VERIFY = 'REPORT_VERIFY',
  REPORT_REJECT = 'REPORT_REJECT',
  REPORT_STATUS_CHANGED = 'REPORT_STATUS_CHANGED',
  
  // 3. Media & Attachment
  MEDIA_UPLOAD = 'MEDIA_UPLOAD',
  MEDIA_DELETE = 'MEDIA_DELETE',
  
  // 4. Assistance & Support
  ASSISTANCE_REQUEST = 'ASSISTANCE_REQUEST',
  ASSISTANCE_PROVIDE = 'ASSISTANCE_PROVIDE',
  ASSISTANCE_UPDATE = 'ASSISTANCE_UPDATE',
  ASSISTANCE_DELETE = 'ASSISTANCE_DELETE',
  
  // 5. Donation & Organization
  DONATION_CREATE = 'DONATION_CREATE',
  DONATION_UPDATE = 'DONATION_UPDATE',
  DONATION_DELETE = 'DONATION_DELETE',
  DONATION_VERIFY = 'DONATION_VERIFY',
  ORGANIZATION_REGISTER = 'ORGANIZATION_REGISTER',
  ORGANIZATION_VERIFY = 'ORGANIZATION_VERIFY',
  ORGANIZATION_REJECT = 'ORGANIZATION_REJECT',
  
  // 6. Notification & Communication
  NOTIFICATION_SEND = 'NOTIFICATION_SEND',
  NOTIFICATION_READ = 'NOTIFICATION_READ',
  
  // 7. System & Security
  SYSTEM_CONFIG_CHANGE = 'SYSTEM_CONFIG_CHANGE',
  SYSTEM_DATA_EXPORT = 'SYSTEM_DATA_EXPORT',
  SYSTEM_DATA_IMPORT = 'SYSTEM_DATA_IMPORT',
  SYSTEM_PUBLIC_DATA_UPDATE = 'SYSTEM_PUBLIC_DATA_UPDATE',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  
  // Legacy System Settings (Keep for backward compatibility)
  SYSTEM_SETTING_CHANGED = 'SYSTEM_SETTING_CHANGED',
  SYSTEM_BACKUP_CREATED = 'SYSTEM_BACKUP_CREATED',
  SYSTEM_RESTORE_PERFORMED = 'SYSTEM_RESTORE_PERFORMED',
  
  // Legacy Authentication (Keep for backward compatibility)
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  
  // Legacy Report Management (Keep for backward compatibility)
  REPORT_CREATED = 'REPORT_CREATED',
  REPORT_UPDATED = 'REPORT_UPDATED',
  REPORT_DELETED = 'REPORT_DELETED',
  
  // Legacy Data Export/Import (Keep for backward compatibility)
  DATA_EXPORTED = 'DATA_EXPORTED',
  DATA_IMPORTED = 'DATA_IMPORTED',
  
  // Security Events
  SUSPICIOUS_ACTIVITY_DETECTED = 'SUSPICIOUS_ACTIVITY_DETECTED',
  SECURITY_BREACH_ATTEMPT = 'SECURITY_BREACH_ATTEMPT',
  ACCESS_DENIED = 'ACCESS_DENIED'
}

export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AuditCategory {
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  ROLE_MANAGEMENT = 'ROLE_MANAGEMENT',
  PERMISSION_MANAGEMENT = 'PERMISSION_MANAGEMENT',
  SYSTEM_ADMINISTRATION = 'SYSTEM_ADMINISTRATION',
  AUTHENTICATION = 'AUTHENTICATION',
  REPORT_MANAGEMENT = 'REPORT_MANAGEMENT',
  DATA_MANAGEMENT = 'DATA_MANAGEMENT',
  SECURITY = 'SECURITY',
  // New categories for disaster reporting platform
  MEDIA_MANAGEMENT = 'MEDIA_MANAGEMENT',
  ASSISTANCE_SUPPORT = 'ASSISTANCE_SUPPORT',
  DONATION_MANAGEMENT = 'DONATION_MANAGEMENT',
  ORGANIZATION_MANAGEMENT = 'ORGANIZATION_MANAGEMENT',
  COMMUNICATION = 'COMMUNICATION'
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
  format: 'csv' | 'json' | 'pdf';
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
  reportType: 'GDPR' | 'SOX' | 'HIPAA' | 'CUSTOM';
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
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
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
  grantedToType: 'user' | 'role';
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
  CRITICAL: 2555 // 7 years
};

export const AUDIT_ACTION_DESCRIPTIONS: Record<AuditAction, string> = {
  // Authentication & User Access
  [AuditAction.USER_LOGIN]: 'User logged into the system',
  [AuditAction.USER_LOGOUT]: 'User logged out of the system',
  [AuditAction.USER_FAILED_LOGIN]: 'Failed login attempt by user',
  [AuditAction.USER_PASSWORD_CHANGE]: 'User changed their password',
  [AuditAction.USER_ROLE_CHANGE]: 'User role was changed',
  [AuditAction.USER_BLACKLISTED]: 'User account blacklisted',
  [AuditAction.USER_UNBLACKLISTED]: 'User account removed from blacklist',
  
  // User Management
  [AuditAction.USER_CREATED]: 'New user account created',
  [AuditAction.USER_UPDATED]: 'User account information updated',
  [AuditAction.USER_DELETED]: 'User account deleted',
  [AuditAction.USER_BULK_OPERATION]: 'Bulk operation performed on users',
  
  // Role Management
  [AuditAction.ROLE_CREATED]: 'New role created',
  [AuditAction.ROLE_UPDATED]: 'Role updated',
  [AuditAction.ROLE_DELETED]: 'Role deleted',
  [AuditAction.ROLE_ASSIGNED]: 'Role assigned to user',
  [AuditAction.ROLE_REVOKED]: 'Role revoked from user',
  [AuditAction.ROLE_DUPLICATED]: 'Role duplicated',
  
  // Permission Management
  [AuditAction.PERMISSION_GRANTED]: 'Permission granted',
  [AuditAction.PERMISSION_REVOKED]: 'Permission revoked',
  [AuditAction.PERMISSION_BULK_UPDATE]: 'Bulk permission update performed',
  
  // Disaster Report Management
  [AuditAction.REPORT_CREATE]: 'New disaster report created',
  [AuditAction.REPORT_UPDATE]: 'Disaster report updated',
  [AuditAction.REPORT_DELETE]: 'Disaster report deleted',
  [AuditAction.REPORT_VERIFY]: 'Disaster report verified by admin',
  [AuditAction.REPORT_REJECT]: 'Disaster report rejected',
  [AuditAction.REPORT_STATUS_CHANGED]: 'Report status changed',
  
  // Media & Attachment
  [AuditAction.MEDIA_UPLOAD]: 'Media file uploaded',
  [AuditAction.MEDIA_DELETE]: 'Media file deleted',
  
  // Assistance & Support
  [AuditAction.ASSISTANCE_REQUEST]: 'Assistance request submitted',
  [AuditAction.ASSISTANCE_PROVIDE]: 'Assistance provided by organization',
  [AuditAction.ASSISTANCE_UPDATE]: 'Assistance record updated',
  [AuditAction.ASSISTANCE_DELETE]: 'Assistance record deleted',
  
  // Donation & Organization
  [AuditAction.DONATION_CREATE]: 'New donation record created',
  [AuditAction.DONATION_UPDATE]: 'Donation record updated',
  [AuditAction.DONATION_DELETE]: 'Donation record deleted',
  [AuditAction.DONATION_VERIFY]: 'Donation verified by organization',
  [AuditAction.ORGANIZATION_REGISTER]: 'New organization registered',
  [AuditAction.ORGANIZATION_VERIFY]: 'Organization verified by super admin',
  [AuditAction.ORGANIZATION_REJECT]: 'Organization registration rejected',
  
  // Notification & Communication
  [AuditAction.NOTIFICATION_SEND]: 'Notification sent to user(s)',
  [AuditAction.NOTIFICATION_READ]: 'Notification marked as read',
  
  // System & Security
  [AuditAction.SYSTEM_CONFIG_CHANGE]: 'System configuration changed',
  [AuditAction.SYSTEM_DATA_EXPORT]: 'Data exported from system',
  [AuditAction.SYSTEM_DATA_IMPORT]: 'Data imported into system',
  [AuditAction.SYSTEM_PUBLIC_DATA_UPDATE]: 'Public data API updated (USGS, Weather)',
  [AuditAction.SYSTEM_ERROR]: 'System error occurred',
  
  // Legacy Actions (for backward compatibility)
  [AuditAction.SYSTEM_SETTING_CHANGED]: 'System setting changed',
  [AuditAction.SYSTEM_BACKUP_CREATED]: 'System backup created',
  [AuditAction.SYSTEM_RESTORE_PERFORMED]: 'System restore performed',
  [AuditAction.LOGIN_SUCCESS]: 'Successful login',
  [AuditAction.LOGIN_FAILED]: 'Failed login attempt',
  [AuditAction.LOGOUT]: 'User logged out',
  [AuditAction.PASSWORD_RESET_REQUESTED]: 'Password reset requested',
  [AuditAction.PASSWORD_RESET_COMPLETED]: 'Password reset completed',
  [AuditAction.REPORT_CREATED]: 'Report created',
  [AuditAction.REPORT_UPDATED]: 'Report updated',
  [AuditAction.REPORT_DELETED]: 'Report deleted',
  [AuditAction.DATA_EXPORTED]: 'Data exported',
  [AuditAction.DATA_IMPORTED]: 'Data imported',
  
  // Security Events
  [AuditAction.SUSPICIOUS_ACTIVITY_DETECTED]: 'Suspicious activity detected',
  [AuditAction.SECURITY_BREACH_ATTEMPT]: 'Security breach attempt',
  [AuditAction.ACCESS_DENIED]: 'Access denied'
};

export const AUDIT_CATEGORY_COLORS: Record<AuditCategory, string> = {
  [AuditCategory.USER_MANAGEMENT]: '#3B82F6', // blue
  [AuditCategory.ROLE_MANAGEMENT]: '#8B5CF6', // purple
  [AuditCategory.PERMISSION_MANAGEMENT]: '#06B6D4', // cyan
  [AuditCategory.SYSTEM_ADMINISTRATION]: '#10B981', // emerald
  [AuditCategory.AUTHENTICATION]: '#F59E0B', // amber
  [AuditCategory.REPORT_MANAGEMENT]: '#EF4444', // red
  [AuditCategory.DATA_MANAGEMENT]: '#84CC16', // lime
  [AuditCategory.SECURITY]: '#DC2626' // red-600
};

export const AUDIT_SEVERITY_COLORS: Record<AuditSeverity, string> = {
  [AuditSeverity.LOW]: '#10B981', // green
  [AuditSeverity.MEDIUM]: '#F59E0B', // amber
  [AuditSeverity.HIGH]: '#EF4444', // red
  [AuditSeverity.CRITICAL]: '#DC2626' // red-600
};  [AuditAction.ROLE_DELETED]: 'Role deleted',
  [AuditAction.ROLE_ASSIGNED]: 'Role assigned to user',
  [AuditAction.ROLE_REVOKED]: 'Role revoked from user',
  [AuditAction.ROLE_DUPLICATED]: 'Role duplicated',
  [AuditAction.PERMISSION_GRANTED]: 'Permission granted',
  [AuditAction.PERMISSION_REVOKED]: 'Permission revoked',
  [AuditAction.PERMISSION_BULK_UPDATE]: 'Bulk permission update performed',
  [AuditAction.SYSTEM_SETTING_CHANGED]: 'System setting changed',
  [AuditAction.SYSTEM_BACKUP_CREATED]: 'System backup created',
  [AuditAction.SYSTEM_RESTORE_PERFORMED]: 'System restore performed',
  [AuditAction.LOGIN_SUCCESS]: 'Successful login',
  [AuditAction.LOGIN_FAILED]: 'Failed login attempt',
  [AuditAction.LOGOUT]: 'User logged out',
  [AuditAction.PASSWORD_RESET_REQUESTED]: 'Password reset requested',
  [AuditAction.PASSWORD_RESET_COMPLETED]: 'Password reset completed',
  [AuditAction.REPORT_CREATED]: 'Report created',
  [AuditAction.REPORT_UPDATED]: 'Report updated',
  [AuditAction.REPORT_DELETED]: 'Report deleted',
  [AuditAction.REPORT_STATUS_CHANGED]: 'Report status changed',
  [AuditAction.DATA_EXPORTED]: 'Data exported',
  [AuditAction.DATA_IMPORTED]: 'Data imported',
  [AuditAction.SUSPICIOUS_ACTIVITY_DETECTED]: 'Suspicious activity detected',
  [AuditAction.SECURITY_BREACH_ATTEMPT]: 'Security breach attempt',
  [AuditAction.ACCESS_DENIED]: 'Access denied'
};

export const AUDIT_CATEGORY_COLORS: Record<AuditCategory, string> = {
  [AuditCategory.USER_MANAGEMENT]: '#3B82F6', // blue
  [AuditCategory.ROLE_MANAGEMENT]: '#8B5CF6', // purple
  [AuditCategory.PERMISSION_MANAGEMENT]: '#06B6D4', // cyan
  [AuditCategory.SYSTEM_ADMINISTRATION]: '#10B981', // emerald
  [AuditCategory.AUTHENTICATION]: '#F59E0B', // amber
  [AuditCategory.REPORT_MANAGEMENT]: '#EF4444', // red
  [AuditCategory.DATA_MANAGEMENT]: '#84CC16', // lime
  [AuditCategory.SECURITY]: '#DC2626' // red-600
};

export const AUDIT_SEVERITY_COLORS: Record<AuditSeverity, string> = {
  [AuditSeverity.LOW]: '#10B981', // green
  [AuditSeverity.MEDIUM]: '#F59E0B', // amber
  [AuditSeverity.HIGH]: '#EF4444', // red
  [AuditSeverity.CRITICAL]: '#DC2626' // red-600
};