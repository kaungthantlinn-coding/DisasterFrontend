import { apiClient } from './client';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  actions?: string[];
  targetTypes?: string[];
  page?: number;
  pageSize?: number;
}

export interface ExportFilters {
  format: 'pdf' | 'excel' | 'csv';
  filters?: AuditLogFilters;
  fields?: string[];
}

export interface AuditLogResponse {
  logs: AuditLog[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditFilterOptions {
  actions: string[];
  targetTypes: string[];
}

export const auditLogService = {
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.actions) {
      filters.actions.forEach(action => params.append('actions', action));
    }
    if (filters.targetTypes) {
      filters.targetTypes.forEach(type => params.append('targetTypes', type));
    }
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());

    const response = await apiClient.get(`/audit-logs?${params.toString()}`);
    return response.data;
  },

  async exportAuditLogs(exportData: ExportFilters): Promise<Blob> {
    const response = await apiClient.post('/audit-logs/export', exportData, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/octet-stream'
      }
    });
    return response.data;
  },

  async getAuditLogById(id: string): Promise<AuditLog> {
    const response = await apiClient.get(`/audit-logs/${id}`);
    return response.data;
  },

  async getAuditLogStatistics(): Promise<{
    totalLogs: number;
    todayLogs: number;
    weekLogs: number;
    monthLogs: number;
    topActions: Array<{ action: string; count: number }>;
    topUsers: Array<{ userId: string; userName: string; count: number }>;
  }> {
    const response = await apiClient.get('/audit-logs/statistics');
    return response.data;
  }
};

export const fetchAuditFilterOptions = async (): Promise<AuditFilterOptions> => {
  try {
    const response = await apiClient.get('/audit-logs/filter-options');
    return response.data;
  } catch (error) {
    // Return fallback options if API fails
    return {
      actions: [
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'USER_LOGIN_SUCCESS', 
        'USER_LOGIN_FAILED',
        'LOGOUT',
        'USER_CREATED',
        'USER_UPDATED',
        'USER_SUSPENDED',
        'USER_REACTIVATED',
        'USER_DEACTIVATED',
        'DONATION_CREATED',
        'DONATION_UPDATED',
        'ORGANIZATION_REGISTERED',
        'ORGANIZATION_UPDATED',
        'REPORT_POST',
        'REPORT_PUT',
        'REPORT_DELETE',
        'AUDIT_LOGS_EXPORTED_ADVANCED',
        'PROFILE_UPDATED'
      ],
      targetTypes: [
        'Audit',
        'General',
        'HttpRequest', 
        'UserRole'
      ]
    };
  }
};
