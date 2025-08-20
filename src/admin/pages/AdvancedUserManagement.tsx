import React from 'react';
import UserManagement from './UserManagement';

const AdvancedUserManagement: React.FC = () => {
  // This component serves as a wrapper for the main UserManagement component.
  // It can be extended with additional features exclusive to super admins in the future.
  return <UserManagement />;
};

export default AdvancedUserManagement;
