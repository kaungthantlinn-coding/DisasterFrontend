import React, { useState, useEffect } from 'react';
import useSignalRCharts from '../../hooks/useSignalRCharts';

const SignalRDebug: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const getToken = () => {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const token = parsed.state?.accessToken || null;
        setTokenInfo({
          source: 'auth-storage',
          hasToken: !!token,
          tokenLength: token?.length || 0,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
        });
        return token;
      }
    } catch (error) {
      console.warn('Failed to parse auth storage:', error);
    }
    
    const fallbackToken = localStorage.getItem('token') || localStorage.getItem('authToken') || null;
    setTokenInfo({
      source: 'fallback',
      hasToken: !!fallbackToken,
      tokenLength: fallbackToken?.length || 0,
      tokenPreview: fallbackToken ? `${fallbackToken.substring(0, 20)}...` : 'No token'
    });
    return fallbackToken;
  };

  const { chartData, isConnected, lastUpdated } = useSignalRCharts(getToken);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    addLog(`Connection status: ${isConnected ? 'Connected' : 'Disconnected'}`);
  }, [isConnected]);

  useEffect(() => {
    if (lastUpdated) {
      addLog(`Data updated at: ${lastUpdated.toLocaleTimeString()}`);
    }
  }, [lastUpdated]);

  const testConnection = async () => {
    addLog('Testing SignalR connection...');
    try {
      const token = getToken();
      addLog(`Token available: ${!!token}`);
      if (token) {
        addLog(`Token length: ${token.length}`);
      }
    } catch (error) {
      addLog(`Connection test failed: ${error}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">SignalR Debug</h3>
        <button
          onClick={testConnection}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Last Updated:</span>
          <span className="text-gray-600">
            {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
          </span>
        </div>
        
        {tokenInfo && (
          <div className="border-t pt-2">
            <div className="text-xs text-gray-500 mb-1">Token Info:</div>
            <div className="text-xs">
              <div>Source: {tokenInfo.source}</div>
              <div>Has Token: {tokenInfo.hasToken ? 'Yes' : 'No'}</div>
              <div>Length: {tokenInfo.tokenLength}</div>
              <div>Preview: {tokenInfo.tokenPreview}</div>
            </div>
          </div>
        )}
        
        {chartData && (
          <div className="border-t pt-2">
            <div className="text-xs text-gray-500 mb-1">Chart Data:</div>
            <div className="text-xs">
              <div>Monthly Data: {chartData.monthlyData?.length || 0} items</div>
              <div>Role Distribution: {chartData.roleDistribution?.length || 0} roles</div>
            </div>
          </div>
        )}
        
        <div className="border-t pt-2">
          <div className="text-xs text-gray-500 mb-1">Recent Logs:</div>
          <div className="max-h-32 overflow-y-auto text-xs space-y-1">
            {debugLogs.map((log, index) => (
              <div key={index} className="text-gray-600">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalRDebug;