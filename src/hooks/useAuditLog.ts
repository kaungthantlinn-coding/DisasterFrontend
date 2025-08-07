import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: 'user' | 'report' | 'system';
  targetId?: string;
  targetName?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  targetType?: 'user' | 'report' | 'system';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  startDate?: string;
  endDate?: string;
}

export interface AuditLogResponse {
  logs: AuditLogEntry[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UseAuditLogParams {
  page?: number;
  pageSize?: number;
  filters?: AuditLogFilters;
  enabled?: boolean;
}

export const useAuditLog = ({
  page = 1,
  pageSize = 20,
  filters = {},
  enabled = true
}: UseAuditLogParams = {}) => {
  const [data, setData] = useState<AuditLogResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await api.get(`/audit-logs?${params}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, pageSize, JSON.stringify(filters), enabled]);

  const refetch = () => {
    fetchAuditLogs();
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
};

// Hook for audit log statistics
export const useAuditLogStats = () => {
  const [stats, setStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    criticalLogs: 0,
    userActions: 0,
    systemActions: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/audit-logs/stats');
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch audit log statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};