import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getToken } from '../../apis/auth';
import { useAuthStore } from '../../stores/authStore';

const AuthTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const authStore = useAuthStore();
  const [testResults, setTestResults] = useState<string[]>([]);

  const runAuthTest = () => {
    const results: string[] = [];
    
    // Test 1: Check authentication status
    results.push(`✅ Authentication Status: ${isAuthenticated ? 'Authenticated' : 'Not Authenticated'}`);
    
    // Test 2: Check user data
    results.push(`✅ User Data: ${user ? `${user.name} (${user.email})` : 'No user data'}`);
    
    // Test 3: Check token from auth store
    const storeToken = authStore.accessToken;
    results.push(`✅ Store Token: ${storeToken ? `${storeToken.substring(0, 20)}... (${storeToken.length} chars)` : 'No token in store'}`);
    
    // Test 4: Check token from getToken function
    const apiToken = getToken();
    results.push(`✅ API Token: ${apiToken ? `${apiToken.substring(0, 20)}... (${apiToken.length} chars)` : 'No token from API'}`);
    
    // Test 5: Check localStorage directly
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const lsToken = parsed?.state?.accessToken;
        results.push(`✅ LocalStorage Token: ${lsToken ? `${lsToken.substring(0, 20)}... (${lsToken.length} chars)` : 'No token in localStorage'}`);
      } catch (e) {
        results.push(`❌ LocalStorage Parse Error: ${e}`);
      }
    } else {
      results.push(`❌ No auth-storage in localStorage`);
    }
    
    // Test 6: Check token expiration
    const isExpired = authStore.isTokenExpired();
    results.push(`✅ Token Expired: ${isExpired ? 'Yes' : 'No'}`);
    
    setTestResults(results);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Authentication Test</h3>
        <button
          onClick={runAuthTest}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Run Test
        </button>
      </div>
      
      {testResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Test Results:</h4>
          <div className="bg-gray-50 rounded-md p-3 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono text-gray-800 mb-1">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Quick Status:</strong></p>
        <p>• Authenticated: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{isAuthenticated ? 'Yes' : 'No'}</span></p>
        <p>• User: <span className={user ? 'text-green-600' : 'text-red-600'}>{user ? user.name : 'None'}</span></p>
        <p>• Token Available: <span className={getToken() ? 'text-green-600' : 'text-red-600'}>{getToken() ? 'Yes' : 'No'}</span></p>
      </div>
    </div>
  );
};

export default AuthTest;