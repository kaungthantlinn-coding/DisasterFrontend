import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  AuditSeverity
} from '../types/audit';
import { auditService, auditUtils } from '../services/auditService';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';

// Hook for fetching audit logs with filtering and pagination
export const useAuditLogs = (
  filter?: AuditLogFilter,
  page = 1,
  pageSize = 50,
  enabled = true
) => {
  const queryKey = ['auditLogs', filter, page, pageSize];
  
  return useQuery({
    queryKey,
    queryFn: () => auditService.getAuditLogs(filter, page, pageSize),
    enabled,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
};

// Hook for fetching audit log statistics
export const useAuditLogStats = (filter?: AuditLogFilter, enabled = true) => {
  return useQuery({
    queryKey: ['auditLogStats', filter],
    queryFn: () => auditService.getAuditLogStats(filter),
    enabled,
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};

// Hook for creating audit logs
export const useCreateAuditLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: CreateAuditLogRequest) => auditService.createAuditLog(request),
    onSuccess: () => {
      // Invalidate audit logs queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
    },
    onError: (error) => {
      console.error('Failed to create audit log:', error);
      toast.error('Failed to create audit log');
    }
  });
};

// Hook for exporting audit logs
export const useExportAuditLogs = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportLogs = useCallback(async (options: AuditLogExportOptions) => {
    setIsExporting(true);
    try {
      const result = await auditService.exportAuditLogs(options);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Audit logs exported successfully');
      return result;
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      toast.error('Failed to export audit logs');
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);
  
  return { exportLogs, isExporting };
};

// Hook for searching audit logs
export const useSearchAuditLogs = () => {
  const [searchResults, setSearchResults] = useState<AuditLogResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchLogs = useCallback(async (query: string, filter?: AuditLogFilter) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await auditService.searchAuditLogs(query, filter);
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Failed to search audit logs:', error);
      toast.error('Failed to search audit logs');
      throw error;
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  const clearSearch = useCallback(() => {
    setSearchResults(null);
  }, []);
  
  return {
    searchResults,
    isSearching,
    searchLogs,
    clearSearch
  };
};

// Hook for managing audit alert rules
export const useAuditAlertRules = () => {
  const queryClient = useQueryClient();
  
  const { data: alertRules, isLoading, error } = useQuery({
    queryKey: ['auditAlertRules'],
    queryFn: () => auditService.getAlertRules(),
    staleTime: 300000, // 5 minutes
  });
  
  const createRuleMutation = useMutation({
    mutationFn: (rule: Omit<AuditAlertRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => 
      auditService.createAlertRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditAlertRules'] });
      toast.success('Alert rule created successfully');
    },
    onError: (error) => {
      console.error('Failed to create alert rule:', error);
      toast.error('Failed to create alert rule');
    }
  });
  
  const updateRuleMutation = useMutation({
    mutationFn: ({ id, rule }: { id: string; rule: Partial<AuditAlertRule> }) => 
      auditService.updateAlertRule(id, rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditAlertRules'] });
      toast.success('Alert rule updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update alert rule:', error);
      toast.error('Failed to update alert rule');
    }
  });
  
  const deleteRuleMutation = useMutation({
    mutationFn: (id: string) => auditService.deleteAlertRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditAlertRules'] });
      toast.success('Alert rule deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete alert rule:', error);
      toast.error('Failed to delete alert rule');
    }
  });
  
  const testRuleMutation = useMutation({
    mutationFn: (id: string) => auditService.testAlertRule(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Alert rule test successful');
      } else {
        toast.error(`Alert rule test failed: ${result.message}`);
      }
    },
    onError: (error) => {
      console.error('Failed to test alert rule:', error);
      toast.error('Failed to test alert rule');
    }
  });
  
  return {
    alertRules: alertRules || [],
    isLoading,
    error,
    createRule: createRuleMutation.mutate,
    updateRule: updateRuleMutation.mutate,
    deleteRule: deleteRuleMutation.mutate,
    testRule: testRuleMutation.mutate,
    isCreating: createRuleMutation.isPending,
    isUpdating: updateRuleMutation.isPending,
    isDeleting: deleteRuleMutation.isPending,
    isTesting: testRuleMutation.isPending
  };
};

// Hook for compliance reporting
export const useComplianceReports = () => {
  const queryClient = useQueryClient();
  
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['complianceReports'],
    queryFn: () => auditService.getComplianceReports(),
    staleTime: 300000, // 5 minutes
  });
  
  const generateReportMutation = useMutation({
    mutationFn: ({ reportType, period }: { 
      reportType: 'GDPR' | 'SOX' | 'HIPAA' | 'CUSTOM'; 
      period: { start: string; end: string }; 
    }) => auditService.generateComplianceReport(reportType, period),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complianceReports'] });
      toast.success('Compliance report generated successfully');
    },
    onError: (error) => {
      console.error('Failed to generate compliance report:', error);
      toast.error('Failed to generate compliance report');
    }
  });
  
  const downloadReport = useCallback(async (reportId: string) => {
    try {
      const result = await auditService.downloadComplianceReport(reportId);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Compliance report downloaded successfully');
      return result;
    } catch (error) {
      console.error('Failed to download compliance report:', error);
      toast.error('Failed to download compliance report');
      throw error;
    }
  }, []);
  
  return {
    reports: reports || [],
    isLoading,
    error,
    generateReport: generateReportMutation.mutate,
    downloadReport,
    isGenerating: generateReportMutation.isPending
  };
};

// Hook for audit analytics
export const useAuditAnalytics = (filter?: AuditLogFilter) => {
  const { data: activityTrends } = useQuery({
    queryKey: ['auditActivityTrends', 'week', filter],
    queryFn: () => auditService.getActivityTrends('week', filter),
    staleTime: 300000, // 5 minutes
  });
  
  const { data: topActors } = useQuery({
    queryKey: ['auditTopActors', filter],
    queryFn: () => auditService.getTopActors(10, filter),
    staleTime: 300000, // 5 minutes
  });
  
  const { data: failureAnalysis } = useQuery({
    queryKey: ['auditFailureAnalysis', filter],
    queryFn: () => auditService.getFailureAnalysis(filter),
    staleTime: 300000, // 5 minutes
  });
  
  return {
    activityTrends,
    topActors,
    failureAnalysis
  };
};

// Hook for real-time audit events
export const useRealtimeAuditEvents = (enabled = true) => {
  const [recentEvents, setRecentEvents] = useState<AuditLogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (!enabled) return;
    
    const unsubscribe = auditService.subscribeToAuditEvents((event) => {
      setRecentEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
      setIsConnected(true);
    });
    
    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [enabled]);
  
  return {
    recentEvents,
    isConnected
  };
};

// Hook for audit system health
export const useAuditSystemHealth = () => {
  return useQuery({
    queryKey: ['auditSystemHealth'],
    queryFn: () => auditService.getAuditSystemHealth(),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};

// Hook for audit maintenance operations
export const useAuditMaintenance = () => {
  const queryClient = useQueryClient();
  
  const cleanupMutation = useMutation({
    mutationFn: () => auditService.cleanupExpiredLogs(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogStats'] });
      toast.success(`Cleanup completed: ${result.deletedCount} logs deleted`);
    },
    onError: (error) => {
      console.error('Failed to cleanup audit logs:', error);
      toast.error('Failed to cleanup audit logs');
    }
  });
  
  const archiveMutation = useMutation({
    mutationFn: (beforeDate: string) => auditService.archiveOldLogs(beforeDate),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogStats'] });
      toast.success(`Archive completed: ${result.archivedCount} logs archived`);
    },
    onError: (error) => {
      console.error('Failed to archive audit logs:', error);
      toast.error('Failed to archive audit logs');
    }
  });
  
  return {
    cleanupExpiredLogs: cleanupMutation.mutate,
    archiveOldLogs: archiveMutation.mutate,
    isCleaningUp: cleanupMutation.isPending,
    isArchiving: archiveMutation.isPending
  };
};

// Hook for easy audit logging with context
export const useAuditLogger = () => {
  const { user } = useAuthStore();
  const createAuditLog = useCreateAuditLog();
  
  const logAction = useCallback(async (
    action: AuditAction,
    category: AuditCategory,
    description: string,
    options?: {
      severity?: AuditSeverity;
      targetType?: string;
      targetId?: string;
      targetName?: string;
      details?: Record<string, any>;
      oldValues?: Record<string, any>;
      newValues?: Record<string, any>;
      success?: boolean;
      errorMessage?: string;
    }
  ) => {
    if (!user) {
      console.warn('Cannot create audit log: user not authenticated');
      return;
    }
    
    const request: CreateAuditLogRequest = {
      action,
      category,
      severity: options?.severity || AuditSeverity.MEDIUM,
      targetType: options?.targetType || 'unknown',
      targetId: options?.targetId,
      targetName: options?.targetName,
      description,
      details: options?.details,
      success: options?.success ?? true,
      errorMessage: options?.errorMessage,
      oldValues: options?.oldValues,
      newValues: options?.newValues
    };
    
    return createAuditLog.mutate(request);
  }, [user, createAuditLog]);
  
  // Convenience methods for common audit actions
  const logUserAction = useCallback((action: AuditAction, targetUser: { id: string; name: string }, details?: Record<string, any>) => {
    return auditUtils.logUserAction(action, targetUser, details);
  }, []);
  
  const logRoleAction = useCallback((action: AuditAction, targetRole: { id: string; name: string }, details?: Record<string, any>) => {
    return auditUtils.logRoleAction(action, targetRole, details);
  }, []);
  
  const logPermissionAction = useCallback((action: AuditAction, permission: string, target: { type: 'user' | 'role'; id: string; name: string }, details?: Record<string, any>) => {
    return auditUtils.logPermissionAction(action, permission, target, details);
  }, []);
  
  const logSystemAction = useCallback((action: AuditAction, description: string, details?: Record<string, any>, severity?: AuditSeverity) => {
    return auditUtils.logSystemAction(action, description, details, severity);
  }, []);
  
  const logSecurityEvent = useCallback((action: AuditAction, description: string, details?: Record<string, any>, success = true, errorMessage?: string) => {
    return auditUtils.logSecurityEvent(action, description, details, success, errorMessage);
  }, []);
  
  return {
    logAction,
    logUserAction,
    logRoleAction,
    logPermissionAction,
    logSystemAction,
    logSecurityEvent,
    isLogging: createAuditLog.isPending
  };
};

// Hook for filtering audit logs with advanced options
export const useAuditLogFilter = () => {
  const [filter, setFilter] = useState<AuditLogFilter>({});
  
  const updateFilter = useCallback((updates: Partial<AuditLogFilter>) => {
    setFilter(prev => ({ ...prev, ...updates }));
  }, []);
  
  const clearFilter = useCallback(() => {
    setFilter({});
  }, []);
  
  const setDateRange = useCallback((startDate: string, endDate: string) => {
    setFilter(prev => ({ ...prev, startDate, endDate }));
  }, []);
  
  const setActions = useCallback((actions: AuditAction[]) => {
    setFilter(prev => ({ ...prev, actions }));
  }, []);
  
  const setCategories = useCallback((categories: AuditCategory[]) => {
    setFilter(prev => ({ ...prev, categories }));
  }, []);
  
  const setSeverities = useCallback((severities: AuditSeverity[]) => {
    setFilter(prev => ({ ...prev, severities }));
  }, []);
  
  const setActors = useCallback((actorIds: string[]) => {
    setFilter(prev => ({ ...prev, actorIds }));
  }, []);
  
  const setTargets = useCallback((targetTypes: string[], targetIds?: string[]) => {
    setFilter(prev => ({ ...prev, targetTypes, targetIds }));
  }, []);
  
  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilter(prev => ({ ...prev, searchTerm: searchTerm || undefined }));
  }, []);
  
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filter).length > 0 && Object.values(filter).some(value => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    );
  }, [filter]);
  
  return {
    filter,
    updateFilter,
    clearFilter,
    setDateRange,
    setActions,
    setCategories,
    setSeverities,
    setActors,
    setTargets,
    setSearchTerm,
    hasActiveFilters
  };
};

export default {
  useAuditLogs,
  useAuditLogStats,
  useCreateAuditLog,
  useExportAuditLogs,
  useSearchAuditLogs,
  useAuditAlertRules,
  useComplianceReports,
  useAuditAnalytics,
  useRealtimeAuditEvents,
  useAuditSystemHealth,
  useAuditMaintenance,
  useAuditLogger,
  useAuditLogFilter
};