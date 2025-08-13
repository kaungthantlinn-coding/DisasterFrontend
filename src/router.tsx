import { createBrowserRouter, Navigate, redirect } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import Dashboard from './pages/Dashboard';
import { Reports } from './pages/Reports';
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
import ErrorBoundary from './components/ErrorBoundary';
import { useAuthStore } from './stores/authStore';

const authLoader = async (options?: { requiredRoles?: string[]; excludeRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore.getState();

  if (!isAuthenticated) {
    return redirect('/login');
  }

  const userRoles = user?.roles || [];

  if (options?.requiredRoles && !options.requiredRoles.some(role => userRoles.includes(role))) {
    return redirect('/'); // Not authorized
  }

  if (options?.excludeRoles && options.excludeRoles.some(role => userRoles.includes(role))) {
    return redirect('/'); // Not authorized
  }

  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
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
      { path: 'admin/*', element: <AdminPanel />, loader: () => authLoader({ requiredRoles: ['admin'] }) },
      { path: 'verify-reports', element: <div>Verify Reports page coming soon...</div>, loader: () => authLoader({ requiredRoles: ['admin', 'cj'] }) },
      { path: 'analytics', element: <div>Analytics page coming soon...</div>, loader: () => authLoader({ requiredRoles: ['admin', 'cj'] }) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});
