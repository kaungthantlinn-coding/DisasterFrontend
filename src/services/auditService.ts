import { apiClient } from "../apis/client";
import {
  AuditLogEntry,
  AuditLogFilter,
  AuditLogResponse,
  AuditLogStats,
  AuditLogExportOptions,
  CreateAuditLogRequest,
  AuditAlertRule,
  AuditComplianceReport,
  AuditAction,
  AuditCategory,
  AuditSeverity,
} from "../types/audit";

export interface AuditServiceInterface {
  // Audit log retrieval
  getAuditLogs(
    filter?: AuditLogFilter,
    page?: number,
    pageSize?: number
  ): Promise<AuditLogResponse>;
  getAuditLogById(id: string): Promise<AuditLogEntry>;
  getAuditLogStats(filter?: AuditLogFilter): Promise<AuditLogStats>;

  // Audit log creation
  createAuditLog(request: CreateAuditLogRequest): Promise<AuditLogEntry>;

  // Bulk operations
  createBulkAuditLogs(
    requests: CreateAuditLogRequest[]
  ): Promise<AuditLogEntry[]>;

  // Export functionality
  exportAuditLogs(
    options: AuditLogExportOptions
  ): Promise<{ downloadUrl: string; fileName: string }>;

  // Search and filtering
  searchAuditLogs(
    query: string,
    filter?: AuditLogFilter
  ): Promise<AuditLogResponse>;
  getAuditLogsByUser(
    userId: string,
    filter?: AuditLogFilter
  ): Promise<AuditLogResponse>;
  getAuditLogsByTarget(
    targetType: string,
    targetId: string,
    filter?: AuditLogFilter
  ): Promise<AuditLogResponse>;

  // Alert rules
  getAlertRules(): Promise<AuditAlertRule[]>;
  createAlertRule(
    rule: Omit<AuditAlertRule, "id" | "createdAt" | "updatedAt" | "createdBy">
  ): Promise<AuditAlertRule>;
  updateAlertRule(
    id: string,
    rule: Partial<AuditAlertRule>
  ): Promise<AuditAlertRule>;
  deleteAlertRule(id: string): Promise<void>;
  testAlertRule(id: string): Promise<{ success: boolean; message: string }>;

  // Compliance reporting
  generateComplianceReport(
    reportType: "GDPR" | "SOX" | "HIPAA" | "CUSTOM",
    period: { start: string; end: string }
  ): Promise<AuditComplianceReport>;
  getComplianceReports(): Promise<AuditComplianceReport[]>;
  downloadComplianceReport(
    reportId: string
  ): Promise<{ downloadUrl: string; fileName: string }>;

  // Analytics
  getActivityTrends(
    period: "day" | "week" | "month",
    filter?: AuditLogFilter
  ): Promise<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }>;
  }>;

  getTopActors(
    limit?: number,
    filter?: AuditLogFilter
  ): Promise<
    Array<{
      actorId: string;
      actorName: string;
      actorEmail: string;
      actionCount: number;
      lastActivity: string;
    }>
  >;

  getFailureAnalysis(filter?: AuditLogFilter): Promise<{
    totalFailures: number;
    failureRate: number;
    topFailureReasons: Array<{
      reason: string;
      count: number;
      percentage: number;
    }>;
    failuresByCategory: Record<AuditCategory, number>;
  }>;

  // System health
  getAuditSystemHealth(): Promise<{
    status: "healthy" | "warning" | "critical";
    metrics: {
      logsPerSecond: number;
      averageProcessingTime: number;
      errorRate: number;
      diskUsage: number;
      retentionCompliance: number;
    };
    issues: Array<{
      severity: "low" | "medium" | "high" | "critical";
      message: string;
      recommendation: string;
    }>;
  }>;

  // Cleanup and maintenance
  cleanupExpiredLogs(): Promise<{ deletedCount: number; message: string }>;
  archiveOldLogs(
    beforeDate: string
  ): Promise<{ archivedCount: number; archiveLocation: string }>;

  // Real-time monitoring
  subscribeToAuditEvents(callback: (event: AuditLogEntry) => void): () => void;
  getRecentActivity(limit?: number): Promise<AuditLogEntry[]>;
}

class AuditService implements AuditServiceInterface {
  private baseUrl = "/api/audit";
  private eventSubscriptions: Array<(event: AuditLogEntry) => void> = [];
  private eventSource: EventSource | null = null;

  async getAuditLogs(
    filter?: AuditLogFilter,
    page = 1,
    pageSize = 50
  ): Promise<AuditLogResponse> {
    const params = new URLSearchParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const response = await apiClient.get(
      `${this.baseUrl}/logs?${params.toString()}`
    );
    return response.data;
  }

  async getAuditLogById(id: string): Promise<AuditLogEntry> {
    const response = await apiClient.get(`${this.baseUrl}/logs/${id}`);
    return response.data;
  }

  async getAuditLogStats(filter?: AuditLogFilter): Promise<AuditLogStats> {
    const params = new URLSearchParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseUrl}/stats?${params.toString()}`
    );
    return response.data;
  }

  async createAuditLog(request: CreateAuditLogRequest): Promise<AuditLogEntry> {
    const response = await apiClient.post(`${this.baseUrl}/logs`, request);
    return response.data;
  }

  async createBulkAuditLogs(
    requests: CreateAuditLogRequest[]
  ): Promise<AuditLogEntry[]> {
    const response = await apiClient.post(`${this.baseUrl}/logs/bulk`, {
      logs: requests,
    });
    return response.data;
  }

  async exportAuditLogs(
    options: AuditLogExportOptions
  ): Promise<{ downloadUrl: string; fileName: string }> {
    const response = await apiClient.post(`${this.baseUrl}/export`, options);
    return response.data;
  }

  async searchAuditLogs(
    query: string,
    filter?: AuditLogFilter
  ): Promise<AuditLogResponse> {
    const params = new URLSearchParams({ q: query });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseUrl}/search?${params.toString()}`
    );
    return response.data;
  }

  async getAuditLogsByUser(
    userId: string,
    filter?: AuditLogFilter
  ): Promise<AuditLogResponse> {
    const params = new URLSearchParams({ userId });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseUrl}/users/${userId}/logs?${params.toString()}`
    );
    return response.data;
  }

  async getAuditLogsByTarget(
    targetType: string,
    targetId: string,
    filter?: AuditLogFilter
  ): Promise<AuditLogResponse> {
    const params = new URLSearchParams({ targetType, targetId });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await apiClient.get(
      `${
        this.baseUrl
      }/targets/${targetType}/${targetId}/logs?${params.toString()}`
    );
    return response.data;
  }

  async getAlertRules(): Promise<AuditAlertRule[]> {
    const response = await apiClient.get(`${this.baseUrl}/alerts/rules`);
    return response.data;
  }

  async createAlertRule(
    rule: Omit<AuditAlertRule, "id" | "createdAt" | "updatedAt" | "createdBy">
  ): Promise<AuditAlertRule> {
    const response = await apiClient.post(`${this.baseUrl}/alerts/rules`, rule);
    return response.data;
  }

  async updateAlertRule(
    id: string,
    rule: Partial<AuditAlertRule>
  ): Promise<AuditAlertRule> {
    const response = await apiClient.put(
      `${this.baseUrl}/alerts/rules/${id}`,
      rule
    );
    return response.data;
  }

  async deleteAlertRule(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/alerts/rules/${id}`);
  }

  async testAlertRule(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(
      `${this.baseUrl}/alerts/rules/${id}/test`
    );
    return response.data;
  }

  async generateComplianceReport(
    reportType: "GDPR" | "SOX" | "HIPAA" | "CUSTOM",
    period: { start: string; end: string }
  ): Promise<AuditComplianceReport> {
    const response = await apiClient.post(
      `${this.baseUrl}/compliance/reports`,
      {
        reportType,
        period,
      }
    );
    return response.data;
  }

  async getComplianceReports(): Promise<AuditComplianceReport[]> {
    const response = await apiClient.get(`${this.baseUrl}/compliance/reports`);
    return response.data;
  }

  async downloadComplianceReport(
    reportId: string
  ): Promise<{ downloadUrl: string; fileName: string }> {
    const response = await apiClient.get(
      `${this.baseUrl}/compliance/reports/${reportId}/download`
    );
    return response.data;
  }

  async getActivityTrends(
    period: "day" | "week" | "month",
    filter?: AuditLogFilter
  ) {
    const params = new URLSearchParams({ period });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseUrl}/analytics/trends?${params.toString()}`
    );
    return response.data;
  }

  async getTopActors(limit = 10, filter?: AuditLogFilter) {
    const params = new URLSearchParams({ limit: limit.toString() });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseUrl}/analytics/top-actors?${params.toString()}`
    );
    return response.data;
  }

  async getFailureAnalysis(filter?: AuditLogFilter) {
    const params = new URLSearchParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseUrl}/analytics/failures?${params.toString()}`
    );
    return response.data;
  }

  async getAuditSystemHealth() {
    const response = await apiClient.get(`${this.baseUrl}/system/health`);
    return response.data;
  }

  async cleanupExpiredLogs(): Promise<{
    deletedCount: number;
    message: string;
  }> {
    const response = await apiClient.post(
      `${this.baseUrl}/maintenance/cleanup`
    );
    return response.data;
  }

  async archiveOldLogs(
    beforeDate: string
  ): Promise<{ archivedCount: number; archiveLocation: string }> {
    const response = await apiClient.post(
      `${this.baseUrl}/maintenance/archive`,
      { beforeDate }
    );
    return response.data;
  }

  subscribeToAuditEvents(callback: (event: AuditLogEntry) => void): () => void {
    this.eventSubscriptions.push(callback);

    // Initialize EventSource if not already done
    if (!this.eventSource) {
      this.eventSource = new EventSource(`${this.baseUrl}/events/stream`);

      this.eventSource.onmessage = (event) => {
        try {
          const auditEvent: AuditLogEntry = JSON.parse(event.data);
          this.eventSubscriptions.forEach((cb) => cb(auditEvent));
        } catch (error) {
          console.error("Error parsing audit event:", error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("Audit event stream error:", error);
      };
    }

    // Return unsubscribe function
    return () => {
      const index = this.eventSubscriptions.indexOf(callback);
      if (index > -1) {
        this.eventSubscriptions.splice(index, 1);
      }

      // Close EventSource if no more subscriptions
      if (this.eventSubscriptions.length === 0 && this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    };
  }

  async getRecentActivity(limit = 20): Promise<AuditLogEntry[]> {
    const response = await apiClient.get(
      `${this.baseUrl}/recent?limit=${limit}`
    );
    return response.data;
  }
}

// Create and export the audit service instance
export const auditService = new AuditService();

// Utility functions for audit logging
export const auditUtils = {
  /**
   * Create an audit log entry for user actions
   */
  logUserAction: async (
    action: AuditAction,
    targetUser: { id: string; name: string; email?: string },
    details?: Record<string, any>,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ) => {
    return auditService.createAuditLog({
      action,
      category: AuditCategory.USER_MANAGEMENT,
      severity: AuditSeverity.MEDIUM,
      targetType: "user",
      targetId: targetUser.id,
      targetName: targetUser.name,
      description: `${action.replace("_", " ").toLowerCase()} for user ${
        targetUser.name
      }`,
      details,
      oldValues,
      newValues,
      success: true,
    });
  },

  /**
   * Create an audit log entry for role actions
   */
  logRoleAction: async (
    action: AuditAction,
    targetRole: { id: string; name: string },
    details?: Record<string, any>,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ) => {
    return auditService.createAuditLog({
      action,
      category: AuditCategory.ROLE_MANAGEMENT,
      severity: AuditSeverity.MEDIUM,
      targetType: "role",
      targetId: targetRole.id,
      targetName: targetRole.name,
      description: `${action.replace("_", " ").toLowerCase()} for role ${
        targetRole.name
      }`,
      details,
      oldValues,
      newValues,
      success: true,
    });
  },

  /**
   * Create an audit log entry for permission actions
   */
  logPermissionAction: async (
    action: AuditAction,
    permission: string,
    target: { type: "user" | "role"; id: string; name: string },
    details?: Record<string, any>
  ) => {
    return auditService.createAuditLog({
      action,
      category: AuditCategory.PERMISSION_MANAGEMENT,
      severity: AuditSeverity.HIGH,
      targetType: target.type,
      targetId: target.id,
      targetName: target.name,
      description: `${action
        .replace("_", " ")
        .toLowerCase()} permission ${permission} for ${target.type} ${
        target.name
      }`,
      details: {
        permission,
        ...details,
      },
      success: true,
    });
  },

  /**
   * Create an audit log entry for system actions
   */
  logSystemAction: async (
    action: AuditAction,
    description: string,
    details?: Record<string, any>,
    severity: AuditSeverity = AuditSeverity.MEDIUM
  ) => {
    return auditService.createAuditLog({
      action,
      category: AuditCategory.SYSTEM_ADMINISTRATION,
      severity,
      targetType: "system",
      description,
      details,
      success: true,
    });
  },

  /**
   * Create an audit log entry for security events
   */
  logSecurityEvent: async (
    action: AuditAction,
    description: string,
    details?: Record<string, any>,
    success = true,
    errorMessage?: string
  ) => {
    return auditService.createAuditLog({
      action,
      category: AuditCategory.SECURITY,
      severity: success ? AuditSeverity.MEDIUM : AuditSeverity.HIGH,
      targetType: "security",
      description,
      details,
      success,
      errorMessage,
    });
  },
};

export default auditService;
