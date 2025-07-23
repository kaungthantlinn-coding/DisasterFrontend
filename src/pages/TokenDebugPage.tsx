/**
 * Token Debug Page - For testing JWT token expiration functionality
 */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { tokenExpirationService } from '../services/tokenExpirationService';
import { 
  decodeJwtToken, 
  isTokenExpired, 
  getTokenTimeRemaining, 
  getTokenExpirationDate,
  formatTimeRemaining,
  debugToken
} from '../utils/jwtUtils';

const TokenDebugPage: React.FC = () => {
  const { accessToken, isAuthenticated, logout } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [, setTick] = useState(0);

  // Update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick => tick + 1);
      updateDebugInfo();
    }, 1000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const updateDebugInfo = () => {
    if (!accessToken) {
      setDebugInfo(null);
      return;
    }

    const payload = decodeJwtToken(accessToken);
    const expired = isTokenExpired(accessToken);
    const timeRemaining = getTokenTimeRemaining(accessToken);
    const expirationDate = getTokenExpirationDate(accessToken);

    setDebugInfo({
      payload,
      expired,
      timeRemaining,
      expirationDate,
      formattedTimeRemaining: formatTimeRemaining(timeRemaining),
      isMonitoring: tokenExpirationService.isActive(),
      currentTime: new Date().toLocaleString(),
    });
  };

  useEffect(() => {
    updateDebugInfo();
  }, [accessToken]);

  const handleStartMonitoring = () => {
    tokenExpirationService.startMonitoring();
    updateDebugInfo();
  };

  const handleStopMonitoring = () => {
    tokenExpirationService.stopMonitoring();
    updateDebugInfo();
  };

  const handleForceCheck = () => {
    tokenExpirationService.forceCheck();
    updateDebugInfo();
  };

  const handleDebugToken = () => {
    debugToken(accessToken);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">JWT Token Debug Page</h1>
        
        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Authenticated:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isAuthenticated ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Has Token:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${accessToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {accessToken ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Token Information */}
        {accessToken && debugInfo && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Token Information</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Token Expired:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${debugInfo.expired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {debugInfo.expired ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Time Remaining:</span>
                <span className="ml-2 font-mono">{debugInfo.formattedTimeRemaining}</span>
              </div>
              <div>
                <span className="font-medium">Expiration Date:</span>
                <span className="ml-2">{debugInfo.expirationDate?.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium">Current Time:</span>
                <span className="ml-2">{debugInfo.currentTime}</span>
              </div>
              {debugInfo.payload && (
                <div>
                  <span className="font-medium">User ID:</span>
                  <span className="ml-2">{debugInfo.payload.sub}</span>
                </div>
              )}
              {debugInfo.payload && (
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{debugInfo.payload.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Monitoring Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Monitoring Status</h2>
          <div className="mb-4">
            <span className="font-medium">Monitoring Active:</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm ${debugInfo?.isMonitoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {debugInfo?.isMonitoring ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="space-x-2">
            <button
              onClick={handleStartMonitoring}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Start Monitoring
            </button>
            <button
              onClick={handleStopMonitoring}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Stop Monitoring
            </button>
            <button
              onClick={handleForceCheck}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Force Check
            </button>
            <button
              onClick={handleDebugToken}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Debug Token (Console)
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Manual Logout
            </button>
          </div>
        </div>

        {/* Raw Token (truncated) */}
        {accessToken && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Raw Token (First 100 chars)</h2>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
              {accessToken.substring(0, 100)}...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenDebugPage;
