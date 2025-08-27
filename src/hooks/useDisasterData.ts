import { useState, useEffect, useCallback } from 'react';
import { disasterDataService } from '../services/disasterDataService';
import { DisasterReportDto } from '../types/DisasterReport';

interface UseDisasterDataOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  includeSignificantOnly?: boolean;
  enabled?: boolean; // Whether to fetch data at all
}

interface UseDisasterDataReturn {
  disasters: DisasterReportDto[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  statistics: {
    totalActive: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  } | null;
}

export const useDisasterData = (options: UseDisasterDataOptions = {}): UseDisasterDataReturn => {
  const {
    autoRefresh = true,
    refreshInterval = 10 * 60 * 1000, // 10 minutes default - reduced frequency
    includeSignificantOnly = true,
    enabled = true, // Default to enabled
  } = options;

  const [disasters, setDisasters] = useState<DisasterReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [statistics, setStatistics] = useState<{
    totalActive: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const disasterData = await disasterDataService.fetchAllRecentDisasters();

      const stats = disasterData.reduce(
        (acc, disaster) => {
          acc.totalActive++;
          switch (disaster.severity) {
            case 3: // Critical
              acc.critical++;
              break;
            case 2: // High
              acc.high++;
              break;
            case 1: // Medium
              acc.medium++;
              break;
            case 0: // Low
              acc.low++;
              break;
          }
          return acc;
        },
        { totalActive: 0, critical: 0, high: 0, medium: 0, low: 0 }
      );

      setDisasters(disasterData);
      setStatistics(stats);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch disaster data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [includeSignificantOnly]);

  const refresh = useCallback(async () => {
    // Clear cache to force fresh data
    disasterDataService.clearCache();
    await fetchData();
  }, [fetchData]);

  // Initial data fetch - only if enabled
  useEffect(() => {
    if (enabled) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData, enabled]);

  // Auto-refresh setup - only if enabled and autoRefresh is true
  useEffect(() => {
    if (!enabled || !autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    disasters,
    loading,
    error,
    lastUpdated,
    refresh,
    statistics,
  };
};

// Hook specifically for earthquake data
export const useEarthquakeData = (options: Omit<UseDisasterDataOptions, 'includeSignificantOnly'> = {}) => {
  return useDisasterData({ ...options, includeSignificantOnly: true });
};

// Hook for disaster statistics only
export const useDisasterStatistics = (refreshInterval: number = 5 * 60 * 1000) => {
  const [statistics, setStatistics] = useState<{
    totalActive: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    lastUpdated: Date;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await disasterDataService.getDisasterStatistics();
      setStatistics(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
      setError(errorMessage);
      console.error('Error fetching disaster statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    
    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchStats, refreshInterval]);

  return {
    statistics,
    loading,
    error,
    refresh: fetchStats,
  };
};
