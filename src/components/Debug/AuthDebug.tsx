import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';


const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const storeState = useAuthStore();
  
  // Get localStorage data for debugging
  const getLocalStorageData = () => {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      return authStorage ? JSON.parse(authStorage) : null;
    } catch (error) {
      return { error: 'Failed to parse localStorage' };
    }
  };
  
  const localStorageData = getLocalStorageData();
  
  // Helper function to mask tokens for security
  const maskToken = (token: string | null) => {
    if (!token) return 'null';
    if (token.length < 20) return token;
    return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50 text-xs">
      <h3 className="text-lg font-bold mb-2 text-yellow-400">🔍 Auth Debug Info</h3>
      
      {/* Authentication Issue Warning */}
      {isAuthenticated && (!storeState.accessToken || !storeState.refreshToken) && (
        <div className="bg-red-800 border border-red-600 p-3 mb-3 rounded">
          <div className="flex items-start">
            <span className="text-red-400 text-lg mr-2">⚠️</span>
            <div>
              <h4 className="text-red-300 font-semibold text-sm mb-1">
                Authentication Issue Detected
              </h4>
              <div className="text-red-200 text-xs">
                <p>You have stale authentication data:</p>
                <ul className="list-disc list-inside mt-1 ml-2">
                  <li>Authentication status: <strong>true</strong></li>
                  <li>Access Token: <strong>missing</strong></li>
                  <li>Refresh Token: <strong>missing</strong></li>
                </ul>
                <p className="mt-2">
                  <strong>Solution:</strong> Click the button below to reset your authentication state.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-3">
        <button
          onClick={() => {
            localStorage.removeItem('auth-storage');
            window.location.reload();
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium w-full"
        >
          🗑️ Clear Auth Storage & Reload
        </button>
      </div>
      
      <div className="mb-3">
        <h4 className="font-semibold text-blue-300">useAuth Hook:</h4>
        <div className="ml-2">
          <p><span className="text-gray-300">isAuthenticated:</span> <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>{String(isAuthenticated)}</span></p>
          <p><span className="text-gray-300">isLoading:</span> <span className={isLoading ? 'text-yellow-400' : 'text-green-400'}>{String(isLoading)}</span></p>
          <p><span className="text-gray-300">user exists:</span> <span className={user ? 'text-green-400' : 'text-red-400'}>{String(!!user)}</span></p>
        </div>
      </div>

      {user && (
        <div className="mb-3">
          <h4 className="font-semibold text-blue-300">User Object:</h4>
          <div className="ml-2">
            <p><span className="text-gray-300">userId:</span> <span className={user.userId ? 'text-green-400' : 'text-red-400'}>'{user.userId}'</span></p>
            <p><span className="text-gray-300">name:</span> <span className={user.name ? 'text-green-400' : 'text-red-400'}>'{user.name}'</span></p>
            <p><span className="text-gray-300">email:</span> <span className={user.email ? 'text-green-400' : 'text-red-400'}>'{user.email}'</span></p>
            <p><span className="text-gray-300">photoUrl:</span> <span className={user.photoUrl ? 'text-green-400' : 'text-gray-500'}>'{user.photoUrl || 'null'}'</span></p>
            <p><span className="text-gray-300">roles:</span> <span className="text-blue-400">[{user.roles?.join(', ')}]</span></p>
          </div>
        </div>
      )}

      <div className="mb-3">
        <h4 className="font-semibold text-blue-300">Store State:</h4>
        <div className="ml-2">
          <p><span className="text-gray-300">store.isAuthenticated:</span> <span className={storeState.isAuthenticated ? 'text-green-400' : 'text-red-400'}>{String(storeState.isAuthenticated)}</span></p>
          <p><span className="text-gray-300">store.user exists:</span> <span className={storeState.user ? 'text-green-400' : 'text-red-400'}>{String(!!storeState.user)}</span></p>
          <p><span className="text-gray-300">store.accessToken exists:</span> <span className={storeState.accessToken ? 'text-green-400' : 'text-red-400'}>{String(!!storeState.accessToken)}</span></p>
          <p><span className="text-gray-300">store.refreshToken exists:</span> <span className={storeState.refreshToken ? 'text-green-400' : 'text-red-400'}>{String(!!storeState.refreshToken)}</span></p>
        </div>
      </div>

      {storeState.user && (
        <div className="mb-3">
          <h4 className="font-semibold text-blue-300">Store User Object:</h4>
          <div className="ml-2">
            <p><span className="text-gray-300">userId:</span> <span className={storeState.user.userId ? 'text-green-400' : 'text-red-400'}>'{storeState.user.userId}'</span></p>
            <p><span className="text-gray-300">name:</span> <span className={storeState.user.name ? 'text-green-400' : 'text-red-400'}>'{storeState.user.name}'</span></p>
            <p><span className="text-gray-300">email:</span> <span className={storeState.user.email ? 'text-green-400' : 'text-red-400'}>'{storeState.user.email}'</span></p>
            <p><span className="text-gray-300">roles:</span> <span className="text-blue-400">[{storeState.user.roles?.join(', ')}]</span></p>
          </div>
        </div>
      )}
      
      <div className="mb-3">
        <h4 className="font-semibold text-blue-300">Token Details:</h4>
        <div className="ml-2">
          <p><span className="text-gray-300">accessToken:</span> <span className={storeState.accessToken ? 'text-green-400' : 'text-red-400'}>{maskToken(storeState.accessToken)}</span></p>
          <p><span className="text-gray-300">refreshToken:</span> <span className={storeState.refreshToken ? 'text-green-400' : 'text-red-400'}>{maskToken(storeState.refreshToken)}</span></p>
          <p><span className="text-gray-300">tokenExpiresAt:</span> <span className={storeState.tokenExpiresAt ? 'text-yellow-400' : 'text-gray-500'}>{storeState.tokenExpiresAt || 'null'}</span></p>
          <p><span className="text-gray-300">isTokenExpired:</span> <span className={storeState.isTokenExpired() ? 'text-red-400' : 'text-green-400'}>{String(storeState.isTokenExpired())}</span></p>
        </div>
      </div>
      
      <div className="mb-3">
        <h4 className="font-semibold text-blue-300">localStorage Data:</h4>
        <div className="ml-2">
          {localStorageData ? (
            <>
              <p><span className="text-gray-300">storage exists:</span> <span className="text-green-400">true</span></p>
              <p><span className="text-gray-300">stored user:</span> <span className={localStorageData.state?.user ? 'text-green-400' : 'text-red-400'}>{String(!!localStorageData.state?.user)}</span></p>
              <p><span className="text-gray-300">stored accessToken:</span> <span className={localStorageData.state?.accessToken ? 'text-green-400' : 'text-red-400'}>{String(!!localStorageData.state?.accessToken)}</span></p>
              <p><span className="text-gray-300">stored refreshToken:</span> <span className={localStorageData.state?.refreshToken ? 'text-green-400' : 'text-red-400'}>{String(!!localStorageData.state?.refreshToken)}</span></p>
              <p><span className="text-gray-300">stored isAuthenticated:</span> <span className={localStorageData.state?.isAuthenticated ? 'text-green-400' : 'text-red-400'}>{String(localStorageData.state?.isAuthenticated)}</span></p>
            </>
          ) : (
            <p><span className="text-gray-300">storage exists:</span> <span className="text-red-400">false</span></p>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-3">
        Check browser console for detailed logs
      </div>
    </div>
  );
};

export default AuthDebug;