import { useState, useEffect, useCallback, useRef } from 'react';
import { disasterNewsService, DisasterNewsItem } from '../services/disasterNewsService';

interface UseDisasterNewsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  maxItems?: number;
  filterTypes?: DisasterNewsItem['type'][];
  minSeverity?: 'low' | 'medium' | 'high' | 'critical';
}

interface UseDisasterNewsReturn {
  news: DisasterNewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  clearCache: () => void;
}

export const useDisasterNews = (options: UseDisasterNewsOptions = {}): UseDisasterNewsReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 2 * 60 * 1000, // 2 minutes default for real-time monitoring
    maxItems = 100, // Increased for comprehensive coverage
    filterTypes,
    minSeverity
  } = options;

  const [news, setNews] = useState<DisasterNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const severityLevels = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
  };

  const filterNews = useCallback((newsItems: DisasterNewsItem[]): DisasterNewsItem[] => {
    let filtered = newsItems;

    // Filter by types if specified
    if (filterTypes && filterTypes.length > 0) {
      filtered = filtered.filter(item => filterTypes.includes(item.type));
    }

    // Filter by minimum severity if specified
    if (minSeverity) {
      const minLevel = severityLevels[minSeverity];
      filtered = filtered.filter(item => {
        const itemLevel = severityLevels[item.severity || 'low'];
        return itemLevel >= minLevel;
      });
    }

    // Limit number of items
    return filtered.slice(0, maxItems);
  }, [filterTypes, minSeverity, maxItems]);

  const fetchNews = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      const allNews = await disasterNewsService.getAllDisasterNews();
      const filteredNews = filterNews(allNews);

      if (mountedRef.current) {
        setNews(filteredNews);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch disaster news');
        console.error('Error fetching disaster news:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [filterNews]);

  const refresh = useCallback(async () => {
    disasterNewsService.clearCache();
    await fetchNews();
  }, [fetchNews]);

  const clearCache = useCallback(() => {
    disasterNewsService.clearCache();
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchNews();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchNews]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    news,
    loading,
    error,
    lastUpdated,
    refresh,
    clearCache
  };
};