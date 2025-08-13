import { useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface TokenExpirationMonitorProps {
  children: ReactNode;
}

const TokenExpirationMonitor: React.FC<TokenExpirationMonitorProps> = ({ children }) => {
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        // Decode JWT token to check expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // Check if token is expired or will expire in the next 5 minutes
        if (payload.exp && payload.exp < currentTime + 300) {
          console.log('Token expired or expiring soon, logging out...');
          logout();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        // If we can't decode the token, it's probably invalid
        logout();
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  return <>{children}</>;
};

export default TokenExpirationMonitor;