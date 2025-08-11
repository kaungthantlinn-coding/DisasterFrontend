import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './i18n'; // Initialize i18n
import { useAuth } from './hooks/useAuth';
import ChatWidget from './components/Chat/ChatWidget';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // This logic for modal routes might need to be adjusted with the new router setup.
  // For now, we'll keep it simple.

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
        {user && <ChatWidget currentUserId={user.userId} position="bottom-right" />}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
