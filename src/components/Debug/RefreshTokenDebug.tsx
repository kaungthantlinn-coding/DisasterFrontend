import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

const RefreshTokenDebug: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshToken, user, accessToken, isAuthenticated } = useAuthStore();

  const testRefreshToken = async () => {
    setIsLoading(true);
    setTestResult('Testing refresh token...');
    
    try {
      console.log('🧪 Starting refresh token test');
      console.log('🧪 Current state:', { 
        hasUser: !!user, 
        hasAccessToken: !!accessToken, 
        isAuthenticated 
      });
      
      // Test the refresh token endpoint directly
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5057/api';
      const response = await fetch(`${API_BASE_URL}/Auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🧪 Response status:', response.status);
      console.log('🧪 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('🧪 Response data:', data);
        setTestResult(`✅ Success: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorText = await response.text();
        console.log('🧪 Error response:', errorText);
        setTestResult(`❌ Failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error('🧪 Test error:', error);
      setTestResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testStoreRefreshToken = async () => {
    setIsLoading(true);
    setTestResult('Testing store refresh token method...');
    
    try {
      const result = await refreshToken();
      setTestResult(`Store refresh result: ${result ? '✅ Success' : '❌ Failed'}`);
    } catch (error) {
      setTestResult(`❌ Store refresh error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie;
    console.log('🍪 All cookies:', cookies);
    setTestResult(`Cookies: ${cookies || 'No cookies found'}`);
  };

  const testDirectLogin = async () => {
    setIsLoading(true);
    setTestResult('Testing direct login...');
    
    try {
      const response = await fetch('http://localhost:5057/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123'
        })
      });
      
      console.log('🧪 Login response status:', response.status);
      console.log('🧪 Login response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('🧪 Login response data:', data);
        setTestResult(`✅ Login Success: User ${data.user?.email}`);
        
        // Check cookies after login
        setTimeout(() => {
          const allCookies = document.cookie;
          console.log('🍪 Cookies after login:', allCookies);
          console.log('🧪 ISSUE IDENTIFIED: SameSite=None requires HTTPS!');
          console.log('🧪 SOLUTION: Backend should use SameSite=Lax for localhost development');
          setTestResult(prev => prev + `\n\n🍪 Cookies after login: ${allCookies || 'None'}\n\n🧪 ISSUE: SameSite=None requires HTTPS!\n🧪 SOLUTION: Use SameSite=Lax for localhost`);
        }, 1000);
      } else {
        const errorText = await response.text();
        setTestResult(`❌ Login Failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error('🧪 Login test error:', error);
      setTestResult(`❌ Login Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="text-lg font-bold mb-2">Refresh Token Debug</h3>
      
      <div className="mb-2 text-sm">
        <p>User: {user?.email || 'None'}</p>
        <p>Has Token: {accessToken ? 'Yes' : 'No'}</p>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={testRefreshToken}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
        >
          Test Direct Refresh
        </button>
        
        <button
          onClick={testStoreRefreshToken}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
        >
          Test Store Refresh
        </button>
        
        <button
          onClick={checkCookies}
          className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
        >
          Check Cookies
        </button>
        
        <button
          onClick={testDirectLogin}
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm"
        >
          Test Direct Login
        </button>
      </div>
      
      {testResult && (
        <div className="mt-3 p-2 bg-gray-700 rounded text-xs max-h-32 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default RefreshTokenDebug;