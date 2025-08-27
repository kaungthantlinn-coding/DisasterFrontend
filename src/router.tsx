import { useEffect } from 'react';
import { createBrowserRouter, Navigate, redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmailOTPPage from './pages/EmailOTPPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import ReportImpact from './pages/ReportImpact';
import NewAdminPanel from './admin/pages/NewAdminPanel';
import About from './pages/About';
import WhatWeDo from './pages/WhatWeDo';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Partnership from './pages/Partnership';
import AvatarDebug from './components/Debug/AvatarDebug';
import CjChatList from './pages/CjChatList';
import { useAuthStore } from './stores/authStore';
import { useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import TokenExpirationMonitor from './components/TokenExpirationMonitor';
import GlobalLoader from './components/Common/GlobalLoader';
import './i18n/index'; // Initialize i18n for admin panel

// Create query client for admin
const adminQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Admin-only App wrapper
const AdminApp = () => {
  const { isLoading } = useAuth();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={adminQueryClient}>
        <TokenExpirationMonitor>
          <div className="min-h-screen bg-gray-50">
            <NewAdminPanel />
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
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Error fallback component
const ErrorFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">
        We're sorry, but something unexpected happened. Please try refreshing the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

const authLoader = async (options?: { requiredRoles?: string[]; excludeRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore.getState();

  if (!isAuthenticated) {
    return redirect('/login');
  }

  // Normalize roles to lowercase for robust checks (handles 'Admin' vs 'admin')
  const userRoles = (user?.roles || []).map((r) => (typeof r === 'string' ? r.toLowerCase() : r));
  const required = options?.requiredRoles?.map((r) => r.toLowerCase());
  const excluded = options?.excludeRoles?.map((r) => r.toLowerCase());

  if (required && !required.some((role) => userRoles.includes(role))) {
    return redirect('/'); // Not authorized
  }

  if (excluded && excluded.some((role) => userRoles.includes(role))) {
    return redirect('/'); // Not authorized
  }

  return null;
};

export const router = createBrowserRouter([
  // Admin routes - completely separate from main app
  {
    path: '/admin/*',
    element: <AdminApp />,
    errorElement: <ErrorFallback />,
    loader: () => authLoader({ requiredRoles: ['admin'] })
  },
  // Main application routes
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'email-otp', element: <EmailOTPPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'dashboard', element: <Dashboard />, loader: () => authLoader() },
      { path: 'about', element: <About /> },
      { path: 'what-we-do', element: <WhatWeDo /> },
      { path: 'get-involved', element: <GetInvolved /> },
      { path: 'contact', element: <Contact /> },
      { path: 'donate', element: <Donate /> },
      { path: 'partnership', element: <Partnership /> },
      { path: 'debug/avatar', element: <AvatarDebug /> },
      { path: 'cj-chat-list', element: <CjChatList onClose={() => window.history.back()} /> },
      { path: 'reports', element: <Reports />, loader: () => authLoader() },
      { path: 'reports/:id', element: <ReportDetail />, loader: () => authLoader() },
      { path: 'report/new', element: <ReportImpact authToken={localStorage.getItem("authToken") ?? ""} />, loader: () => authLoader({ excludeRoles: ['user'] }) },
      { path: 'report/edit/:id', element: <ReportImpact authToken={localStorage.getItem("authToken") ?? ""} />, loader: () => authLoader({ excludeRoles: ['user'] }) },
      { path: 'verify-reports', element: <div>Verify Reports page coming soon...</div>, loader: () => authLoader({ requiredRoles: ['admin', 'cj'] }) },
      { path: 'analytics', element: <div>Analytics page coming soon...</div>, loader: () => authLoader({ requiredRoles: ['admin', 'cj'] }) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});
