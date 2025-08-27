import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ModernAdminLayout from '../components/ModernAdminLayout';
import ModernDashboard from '../components/ModernDashboard';

import UserManagement from './UserManagement';

// Import existing admin pages
import Analytics from './Analytics';
import SystemSettings from './systemsettings';
import ReportManagement from './ReportManagement';
import AuditLogsPage from './AuditLogsPage';
import AdminSupportRequestManagement from './AdminSupportRequestManagement';
import OrganizationManagement from './OrganizationManagement';
import ReportReview from './ReportReview';

const NewAdminPanel: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if user is SuperAdmin
  const isSuperAdmin = user?.roles?.some(role => 
    typeof role === 'string' 
      ? role.toLowerCase() === 'superadmin' 
      : role === 'superadmin'
  );
  
  // Determine which component to render based on the current path
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/admin' || path === '/admin/') {
      return <ModernDashboard />;
    } else if (path.includes('/admin/users')) {
      return <UserManagement />;
    } else if (path.includes('/admin/audit-logs')) {
      return <AuditLogsPage />;
    } else if (path.includes('/admin/organizations')) {
      return <OrganizationManagement />;
    } else if (path.includes('/admin/reports')) {
      return <ReportManagement />;
    } else if (path.includes('/admin/reports/review/')) {
      // Deep-link review route (nested under /admin)
      return <ReportReview />;
    } else if (path.includes('/admin/support-requests')) {
      return <AdminSupportRequestManagement />;
    } else if (path.includes('/admin/analytics')) {
      return <Analytics />;
    } else if (path.includes('/admin/settings')) {
      return <SystemSettings />;
    } else {
      return <ModernDashboard />;
    }
  };
  
  return (
    <ModernAdminLayout>
      {/* Use Routes/Route for simpler routing or renderContent for role-based routing */}
      <Routes>
        <Route path="/" element={<ModernDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/organizations" element={<OrganizationManagement />} />
        <Route path="/reports" element={<ReportManagement />} />
        {/* Deep-link review route (nested under /admin) */}
        <Route path="reports/review/:id" element={<ReportReview />} />
        <Route path="/support-requests" element={<AdminSupportRequestManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Routes>
    </ModernAdminLayout>
  );
};

export default NewAdminPanel;