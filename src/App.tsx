import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './i18n'; // Initialize i18n
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import ReportImpact from './pages/ReportImpact';
import AdminPanel from './pages/admin/AdminPanel';
import About from './pages/About';
import WhatWeDo from './pages/WhatWeDo';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Partnership from './pages/Partnership';

import AvatarDebug from './components/Debug/AvatarDebug';
import TokenDebugPage from './pages/TokenDebugPage';

import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import TokenExpirationMonitor from './components/Auth/TokenExpirationMonitor';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TokenExpirationMonitor>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Public routes */}
              <Route path="/about" element={<About />} />
              <Route path="/what-we-do" element={<WhatWeDo />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/partnership" element={<Partnership />} />

              <Route path="/debug/avatar" element={<AvatarDebug />} />
              <Route path="/debug/token" element={<TokenDebugPage />} />
              {/* Reports routes - accessible to all authenticated users */}
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/:id"
                element={
                  <ProtectedRoute>
                    <ReportDetail />
                  </ProtectedRoute>
                }
              />
              {/* Report creation - hide from regular users */}
              <Route
                path="/report/new"
                element={
                  <ProtectedRoute excludeRoles={['user']}>
                    <ReportImpact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report/edit/:id"
                element={
                  <ProtectedRoute excludeRoles={['user']}>
                    <ReportImpact />
                  </ProtectedRoute>
                }
              />
              <Route path="/assistance/:id" element={<ReportDetail />} />
              <Route path="/assistance/received/:id" element={<ReportDetail />} />


              {/* Admin routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              
              {/* CJ and Admin routes */}
              <Route
                path="/verify-reports"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'cj']}>
                    <div className="p-8 text-center">Verify Reports page coming soon...</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'cj']}>
                    <div className="p-8 text-center">Analytics page coming soon...</div>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
        </TokenExpirationMonitor>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4500,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1f2937',
              border: '1px solid rgba(229, 231, 235, 0.3)',
              borderRadius: '16px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(16px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              fontSize: '15px',
              fontWeight: '500',
              padding: '16px 20px',
              minHeight: '72px',
            },
            success: {
              duration: 4500,
              style: {
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)',
                borderLeft: '5px solid rgb(16, 185, 129)',
                color: '#065f46',
              },
              iconTheme: {
                primary: 'rgb(16, 185, 129)',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5500,
              style: {
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)',
                borderLeft: '5px solid rgb(220, 38, 38)',
                color: '#7f1d1d',
              },
              iconTheme: {
                primary: 'rgb(220, 38, 38)',
                secondary: '#fff',
              },
            },
            loading: {
              duration: Infinity,
              style: {
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)',
                borderLeft: '5px solid rgb(59, 130, 246)',
                color: '#1e3a8a',
              },
              iconTheme: {
                primary: 'rgb(59, 130, 246)',
                secondary: '#fff',
              },
            },
          }}
        />
       </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App
