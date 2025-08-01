import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import CjChatList from './pages/CjChatList';
import ChatWidget from './components/Chat/ChatWidget';
import { useAuth } from './hooks/useAuth';
import { useRoles } from './hooks/useRoles';

import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { user } = useAuth();
  const { isCj } = useRoles();
  return (
    <ErrorBoundary>
      <Router>
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
            <Route path="/cj-chat-list" element={<CjChatList />} />
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
          {/* Only show ChatWidget if not CJ role */}
          {user && user.userId && !isCj() && <ChatWidget currentUserId={user.userId} />}
        </div>
      </Router>
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
     </ErrorBoundary>
  );
}

export default App
