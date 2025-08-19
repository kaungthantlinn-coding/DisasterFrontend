import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './i18n/index'; // Initialize i18n
import { useAuth } from './hooks/useAuth';
import ChatWidget from './components/Chat/ChatWidget';
import ErrorBoundary from './components/ErrorBoundary';
import TokenExpirationMonitor from './components/TokenExpirationMonitor';
import { useLocation } from 'react-router-dom';
import GlobalLoader from './components/Common/GlobalLoader';
import { useRoles } from './hooks/useRoles';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { isOnlyUser } = useRoles();
  const isHome = location.pathname === '/';
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TokenExpirationMonitor>
          <div className="min-h-screen bg-gray-50">
            <Outlet />
            {user && isOnlyUser() && isHome && (
              <ChatWidget currentUserId={user.userId} position="bottom-right" />
            )}
          </div>
        </TokenExpirationMonitor>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4500,
            style: {
              background: "rgba(255, 255, 255, 0.95)",
              color: "#1f2937",
              border: "1px solid rgba(229, 231, 235, 0.3)",
              borderRadius: "16px",
              boxShadow: "0 12px 28px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.08)",
              backdropFilter: "blur(16px) saturate(1.3)",
              WebkitBackdropFilter: "blur(16px) saturate(1.3)",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              fontSize: "15px",
              fontWeight: "500",
              padding: "16px 20px",
              minHeight: "72px",
            },
            success: {
              duration: 4500,
              style: {
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)",
                borderLeft: "5px solid rgb(16, 185, 129)",
                color: "#065f46",
              },
              iconTheme: {
                primary: "rgb(16, 185, 129)",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5500,
              style: {
                background: "linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)",
                borderLeft: "5px solid rgb(220, 38, 38)",
                color: "#7f1d1d",
              },
              iconTheme: {
                primary: "rgb(220, 38, 38)",
                secondary: "#fff",
              },
            },
            loading: {
              duration: Infinity,
              style: {
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)",
                borderLeft: "5px solid rgb(59, 130, 246)",
                color: "#1e3a8a",
              },
              iconTheme: {
                primary: "rgb(59, 130, 246)",
                secondary: "#fff",
              },
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;