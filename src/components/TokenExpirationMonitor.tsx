import { ReactNode } from 'react';
import { useTokenRefresh } from '../hooks/useTokenRefresh';

interface TokenExpirationMonitorProps {
  children: ReactNode;
}

const TokenExpirationMonitor: React.FC<TokenExpirationMonitorProps> = ({ children }) => {
  // Use the new token refresh hook for automatic token management
  useTokenRefresh();

  return <>{children}</>;
};

export default TokenExpirationMonitor;