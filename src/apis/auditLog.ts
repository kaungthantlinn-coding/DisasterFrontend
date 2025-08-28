import { apiClient } from "./client";

export interface AuditFilterOptions {
  actions: string[];
  targetTypes: string[];
}

export interface AuditLogFilters {
  action?: string;
  targetType?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: string;
  targetName?: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  metadata?: any;
}

export interface AuditLogResponse {
  logs: AuditLogEntry[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AuditLogStats {
  totalLogs: number;
  todayLogs: number;
  userActions: number;
}

// Fetch available filter options from backend
export const fetchAuditFilterOptions =
  async (): Promise<AuditFilterOptions> => {
    try {
      const response = await apiClient.get("/audit-logs/filter-options");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch audit filter options:", error);
      // Return fallback values based on known database values
      return {
        actions: [
          "LOGIN_SUCCESS",
          "LOGIN_FAILED",
          "USER_LOGIN_SUCCESS",
          "USER_LOGIN_FAILED",
          "LOGOUT",
          "USER_CREATED",
          "USER_UPDATED",
          "USER_SUSPENDED",
          "USER_REACTIVATED",
          "USER_DEACTIVATED",
          "DONATION_CREATED",
          "DONATION_UPDATED",
          "ORGANIZATION_REGISTERED",
          "ORGANIZATION_UPDATED",
          "REPORT_POST",
          "REPORT_PUT",
          "REPORT_DELETE",
          "AUDIT_LOGS_EXPORTED_ADVANCED",
          "PROFILE_UPDATED",
        ],
        targetTypes: ["Audit", "General", "HttpRequest", "UserRole"],
      };
    }
  };

// Fetch audit logs with filters
export const fetchAuditLogs = async (
  page: number = 1,
  pageSize: number = 20,
  filters: AuditLogFilters = {}
): Promise<AuditLogResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const response = await apiClient.get(`/audit-logs?${params.toString()}`);
  return response.data;
};

// Fetch audit log statistics
export const fetchAuditLogStats = async (): Promise<AuditLogStats> => {
  const response = await apiClient.get("/audit-logs/stats");
  return response.data;
};

// Export audit logs
export const exportAuditLogs = async (
  format: string,
  fields: string[],
  filters: any
): Promise<Blob> => {
  const response = await apiClient.post(
    "/audit-logs/export",
    {
      format,
      fields,
      filters,
    },
    {
      responseType: "blob",
    }
  );

  return response.data;
};
