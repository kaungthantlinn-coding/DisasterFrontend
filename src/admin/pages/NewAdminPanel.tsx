import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ModernAdminLayout from '../components/ModernAdminLayout';
import ModernDashboard from '../components/ModernDashboard';

import UserManagement from './UserManagement';
import UserReviewManagement from '../components/UserReviewManagement';

// Import existing admin pages
import Analytics from './Analytics';
import SystemSettings from './systemsettings';
import ReportManagement from './ReportManagement';
import AuditLogsPage from './AuditLogsPage';
import AdminSupportRequestManagement from './AdminSupportRequestManagement';
import AdminDonationView from './AdminDonationView';

import ReportReview from './ReportReview';


const NewAdminPanel: React.FC = () => {
  
  return (
    <ModernAdminLayout>
      {/* Use Routes/Route for simpler routing or renderContent for role-based routing */}
      <Routes>
        <Route path="/" element={<ModernDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/review" element={<UserReviewManagement />} />
        <Route path="/donations" element={<AdminDonationView />} />
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