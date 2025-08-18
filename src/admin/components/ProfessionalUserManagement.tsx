import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  Ban,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  History
} from 'lucide-react';
import { useUserManagement } from '../../hooks/useUserManagement';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';
import { useAuthStore } from '../../stores/authStore';
import { showErrorToast } from '../../utils/notifications';
import Avatar from '../../components/Common/Avatar';
import { extractPhotoUrl } from '../../utils/avatarUtils';
import ViewProfileModal from '../../components/modals/ViewProfileModal';
import RoleEditModal from '../../components/modals/RoleEditModal';
import UserHistoryModal from '../../components/modals/UserHistoryModal';
import BlacklistHistory from '../../components/ui/BlacklistHistory';
import ExportUsersModal from '../../components/modals/ExportUsersModal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'cj' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  location?: string;
  reportsCount: number;
  lastActive: string;
  photoUrl?: string;
  roleNames?: string[];
  isBlacklisted?: boolean;
}

// Map API user to local user interface
const mapApiUserToLocal = (apiUser: any): User => {
  const roleNames = apiUser.roleNames || [];
  const hasRole = (roleName: string) =>
    roleNames.some((role: string) => role.toLowerCase() === roleName.toLowerCase());

  const primaryRole = hasRole('admin') ? 'admin' :
                     hasRole('cj') ? 'cj' : 'user';

  const status = apiUser.isBlacklisted ? 'suspended' :
                 apiUser.status ? apiUser.status : 'active';

  return {
    id: apiUser.userId,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    role: primaryRole,
    status,
    joinDate: apiUser.createdAt ? new Date(apiUser.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'Unknown',
    location: apiUser.location,
    reportsCount: apiUser.reportsCount || 0,
    lastActive: apiUser.lastActive || 'Unknown',
    photoUrl: extractPhotoUrl(apiUser),
    roleNames: roleNames,
    isBlacklisted: apiUser.isBlacklisted || false // Add this field to track blacklist status
  };
};

const ProfessionalUserManagement: React.FC = () => {
  // Modal state
  const [viewProfileModal, setViewProfileModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  const [roleEditModal, setRoleEditModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  const [userHistoryModal, setUserHistoryModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  const [blacklistHistoryModal, setBlacklistHistoryModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({ isOpen: false, userId: '', userName: '' });

  const [exportUsersModal, setExportUsersModal] = useState<{
    isOpen: boolean;
    availableRoles?: string[];
  }>({ isOpen: false, availableRoles: [] });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Use the custom hook for API integration
  const {
    users: apiUsers,
    totalCount,
    totalPages: apiTotalPages,
    currentPage,
    pageSize,
    availableRoles,
    isLoading,
    error,
    filters,
    setPage,
    setPageSize,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    refresh,
    blacklistUser,
    unblacklistUser,
    deleteUser,
    updateUser
  } = useUserManagement({
    initialPageSize: 10,
    autoRefresh: false
  });

  // Use the confirmation modal hook
  const {
    modalProps,
    showBlacklistConfirmation,
    showUnblacklistConfirmation,
    showDeleteConfirmation
  } = useConfirmationModal();

  // Convert API users to local format
  const users: User[] = (apiUsers || []).map(mapApiUserToLocal);

  // Calculate stats
  const userStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    const admins = users.filter(u => u.role === 'admin').length;

    return { total, active, suspended, admins };
  }, [users]);

  // Action handlers
  const handleViewProfile = (user: User) => {
    setViewProfileModal({ isOpen: true, user });
    setActiveDropdown(null);
  };

  const handleEditUser = (user: User) => {
    setRoleEditModal({ isOpen: true, user });
    setActiveDropdown(null);
  };

  const handleViewBlacklistHistory = (user: User) => {
    setBlacklistHistoryModal({
      isOpen: true,
      userId: user.id,
      userName: user.name
    });
    setActiveDropdown(null);
  };

  const handleBlacklistUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    const userName = user?.name || 'this user';

    // Prevent self-blacklist
    const authState = useAuthStore.getState();
    if (authState.user?.userId && authState.user.userId === userId) {
      showErrorToast('Cannot blacklist yourself.', 'Action Not Allowed');
      setActiveDropdown(null);
      return;
    }

    const result = await showBlacklistConfirmation(userName);
    if (result.isConfirmed) {
      try {
        await blacklistUser({ userId, reason: result.reason || 'Blacklisted by admin' });
      } catch (error) {
        console.error('Failed to blacklist user:', error);
      }
    }
    setActiveDropdown(null);
  };

  const handleUnblacklistUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    const userName = user?.name || 'this user';

    const result = await showUnblacklistConfirmation(userName);
    if (result.isConfirmed) {
      try {
        await unblacklistUser(userId);
      } catch (error) {
        console.error('Failed to unblacklist user:', error);
      }
    }
    setActiveDropdown(null);
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    const userName = user?.name || 'this user';

    const result = await showDeleteConfirmation(userName, 'user', 'This action cannot be undone.');
    if (result.isConfirmed) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
    setActiveDropdown(null);
  };

  const handleSaveUser = async (userId: string, userData: any) => {
    try {
      await updateUser(userId, userData);
      setRoleEditModal({ isOpen: false, user: null });
    } catch (error) {
      throw error;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-50 text-red-700 border-red-200';
      case 'cj': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-50';
      case 'suspended': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'suspended': return <Ban className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
            <p className="text-sm text-red-600 mt-1">{error.message}</p>
          </div>
          <button
            onClick={refresh}
            className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage users, roles, and permissions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={refresh}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setExportUsersModal({ isOpen: true, availableRoles })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="ml-2 text-sm font-medium text-gray-600">Total Users</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{userStats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <UserCheck className="w-5 h-5 text-green-600" />
              <span className="ml-2 text-sm font-medium text-green-600">Active Users</span>
            </div>
            <p className="text-2xl font-semibold text-green-900 mt-1">{userStats.active}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <UserX className="w-5 h-5 text-red-600" />
              <span className="ml-2 text-sm font-medium text-red-600">Suspended</span>
            </div>
            <p className="text-2xl font-semibold text-red-900 mt-1">{userStats.suspended}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="ml-2 text-sm font-medium text-blue-600">Admins</span>
            </div>
            <p className="text-2xl font-semibold text-blue-900 mt-1">{userStats.admins}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filters.role}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="cj">CJ</option>
            <option value="user">User</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reports
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-500">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          src={user.photoUrl}
                          alt={user.name}
                          size="sm"
                          className="mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.reportsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {user.phone && <div>{user.phone}</div>}
                        {user.location && <div className="text-xs text-gray-400">{user.location}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        {activeDropdown === user.id && (
                          <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleViewProfile(user)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </button>
                            <button
                              onClick={() => handleViewBlacklistHistory(user)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <History className="w-4 h-4 mr-2" />
                              Blacklist History
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            {!user.isBlacklisted ? (
                              <button
                                onClick={() => handleBlacklistUser(user.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Blacklist
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnblacklistUser(user.id)}
                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Unblacklist
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">
                  of {totalCount} results
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {apiTotalPages}
                </span>
                
                <button
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === apiTotalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewProfileModal.isOpen && viewProfileModal.user && (
        <ViewProfileModal
          isOpen={viewProfileModal.isOpen}
          onClose={() => setViewProfileModal({ isOpen: false, user: null })}
          user={viewProfileModal.user}
        />
      )}

      {roleEditModal.isOpen && roleEditModal.user && (
        <RoleEditModal
          isOpen={roleEditModal.isOpen}
          onClose={() => setRoleEditModal({ isOpen: false, user: null })}
          user={roleEditModal.user}
          availableRoles={['admin', 'cj', 'user']}
          onSave={handleSaveUser}
        />
      )}

      {userHistoryModal.isOpen && userHistoryModal.user && (
        <UserHistoryModal
          isOpen={userHistoryModal.isOpen}
          onClose={() => setUserHistoryModal({ isOpen: false, user: null })}
          user={userHistoryModal.user}
        />
      )}

      {blacklistHistoryModal.isOpen && (
        <BlacklistHistory
          isOpen={blacklistHistoryModal.isOpen}
          onClose={() => setBlacklistHistoryModal({ isOpen: false, userId: '', userName: '' })}
          userId={blacklistHistoryModal.userId}
          userName={blacklistHistoryModal.userName}
        />
      )}

      {exportUsersModal.isOpen && (
        <ExportUsersModal
          isOpen={exportUsersModal.isOpen}
          onClose={() => setExportUsersModal({ isOpen: false })}
          totalUsers={totalCount}
          availableRoles={exportUsersModal.availableRoles || []}
          
        />
      )}

      <ConfirmationModal {...modalProps} />
    </div>
  );
};

export default ProfessionalUserManagement;
