import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ModernAdminLayout from '../components/ModernAdminLayout';
import ModernDashboard from '../components/ModernDashboard';

import UserManagement from './UserManagement';
import AdvancedUserManagement from './AdvancedUserManagement';

// Import existing admin pages
import Analytics from './Analytics';
import SystemSettings from './systemsettings';
import ReportManagement from './ReportManagement';
import AuditLogsPage from './AuditLogsPage';
import AdminSupportRequestManagement from './AdminSupportRequestManagement';
import OrganizationManagement from './OrganizationManagement';

// Import SuperAdmin components
import UserAnalyticsDashboard from '../../components/admin/UserAnalyticsDashboard';
import UserSessionManager from '../../components/admin/UserSessionManager';
import AuditLogViewer from '../../components/admin/AuditLogViewer';
import RoleManagement from './RoleManagement';
import PermissionManagement from './PermissionManagement';
import SystemHealth from './SystemHealth';

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
      // Use AdvancedUserManagement for SuperAdmin, regular UserManagement for Admin
      return isSuperAdmin ? <AdvancedUserManagement /> : <UserManagement />;
    } else if (path.includes('/admin/user-analytics')) {
      return isSuperAdmin ? <UserAnalyticsDashboard /> : <ModernDashboard />;
    } else if (path.includes('/admin/sessions')) {
      return isSuperAdmin ? <UserSessionManager /> : <ModernDashboard />;
    } else if (path.includes('/admin/audit-logs')) {
      return isSuperAdmin ? <AuditLogViewer /> : <AuditLogsPage />;
    } else if (path.includes('/admin/roles')) {
      return isSuperAdmin ? <RoleManagement /> : <ModernDashboard />;
    } else if (path.includes('/admin/permissions')) {
      return isSuperAdmin ? <PermissionManagement /> : <ModernDashboard />;
    } else if (path.includes('/admin/system-health')) {
      return isSuperAdmin ? <SystemHealth /> : <ModernDashboard />;
    } else if (path.includes('/admin/organizations')) {
      return <OrganizationManagement />;
    } else if (path.includes('/admin/reports')) {
      return <ReportManagement />;
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
      {renderContent()}
    </ModernAdminLayout>
  );
};

export default NewAdminPanel;
