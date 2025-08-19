import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ModernAdminLayout from '../components/ModernAdminLayout';
import ModernDashboard from '../components/ModernDashboard';
import UserManagement from './UserManagement';

// Import existing admin pages (we'll keep the functionality but use new layout)
import Analytics from './Analytics';
import SystemSettings from './systemsettings';
import ReportManagement from './ReportManagement';
import AuditLogsPage from './AuditLogsPage';
import AdminSupportRequestManagement from './AdminSupportRequestManagement';
import OrganizationManagement from './OrganizationManagement';

const NewAdminPanel: React.FC = () => {
  return (
    <ModernAdminLayout>
      <Routes>
        <Route path="/" element={<ModernDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/organizations" element={<OrganizationManagement />} />
        <Route path="/reports" element={<ReportManagement />} />
        <Route path="/support-requests" element={<AdminSupportRequestManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Routes>
    </ModernAdminLayout>
  );
};

export default NewAdminPanel;
