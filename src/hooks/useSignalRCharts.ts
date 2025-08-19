import { useState, useEffect, useCallback } from 'react';
import signalRService, { UserStatsUpdate, ChartDataUpdate } from '../services/signalRService';

export interface TransformedChartData {
  monthlyData: Array<{
    month: string;
    users: number;
    newUsers: number;
    activeUsers: number;
    suspendedUsers: number;
  }>;
  roleDistribution: Array<{
    role: string;
    count: number;
  }>;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  newJoins: number;
}

const useSignalRCharts = (getToken: () => string | null) => {
  const [chartData, setChartData] = useState<TransformedChartData | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    newJoins: 0
  });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleChartDataUpdate = useCallback((data: ChartDataUpdate) => {
    const transformedData: TransformedChartData = {
      monthlyData: data.monthlyData?.map(item => ({
        month: item.month,
        users: item.activeUsers + item.suspendedUsers,
        newUsers: item.newJoins,
        activeUsers: item.activeUsers,
        suspendedUsers: item.suspendedUsers
      })) || [],
      roleDistribution: [
        { role: 'Admin', count: data.roleDistribution?.admin || 0 },
        { role: 'CJ', count: data.roleDistribution?.cj || 0 },
        { role: 'User', count: data.roleDistribution?.user || 0 }
      ]
    };

    // Only update if data has actually changed to prevent flooding
    setChartData(prev => {
      if (!prev || JSON.stringify(prev) !== JSON.stringify(transformedData)) {
        console.log('Chart data updated with new values');
        setLastUpdated(new Date());
        return transformedData;
      }
      return prev;
    });
  }, []);

  const handleUserStatsUpdate = useCallback((data: UserStatsUpdate) => {
    const newStats = {
      totalUsers: data.totalUsers || 0,
      activeUsers: data.activeUsers || 0,
      suspendedUsers: data.suspendedUsers || 0,
      newJoins: data.newJoins || 0
    };

    // Only update if stats have actually changed to prevent flooding
    setUserStats(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(newStats)) {
        console.log('User stats updated with new values');
        setLastUpdated(new Date());
        return newStats;
      }
      return prev;
    });
  }, []);

  const refreshData = useCallback(async () => {
    if (signalRService.isConnected) {
      await signalRService.requestDataRefresh();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const initializeSignalR = async () => {
      try {
        if (!isMounted) return;
        
        await signalRService.startConnection(getToken);
        
        if (!isMounted) return;
        
        setIsConnected(signalRService.isConnected);

        signalRService.onChartDataUpdated(handleChartDataUpdate);
        signalRService.onUserStatsUpdated(handleUserStatsUpdate);
        
        timeoutId = setTimeout(async () => {
          if (isMounted && signalRService.isConnected) {
            await signalRService.requestDataRefresh();
          }
        }, 1500);

      } catch (error) {
        console.log('Failed to initialize SignalR:', error);
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    const debounceTimeout = setTimeout(initializeSignalR, 100);

    // Set up connection state polling to keep UI in sync
    const connectionStateInterval = setInterval(() => {
      if (isMounted) {
        setIsConnected(signalRService.isConnected);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimeout);
      clearTimeout(timeoutId);
      clearInterval(connectionStateInterval);
      setIsConnected(false);
    };
  }, []);

  return {
    chartData,
    userStats,
    isConnected,
    lastUpdated,
    refreshData,
    refresh: () => signalRService.requestDataRefresh(),
    forceRefresh: () => signalRService.forceDataRefresh(),
    connectionStatus: { isConnected: signalRService.isConnected, reconnectAttempts: 0 }
  };
};

export default useSignalRCharts;