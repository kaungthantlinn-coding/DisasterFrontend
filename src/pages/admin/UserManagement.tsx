import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ViewProfileModal from '../../components/modals/ViewProfileModal';
import EditUserModal from '../../components/modals/EditUserModal';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  MoreVertical,
  Download,
  Upload,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Ban,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useUserManagement } from '../../hooks/useUserManagement';

// Map API user to local user interface
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
  avatar?: string;
}

// Helper function to map API user to local user
const mapApiUserToLocal = (apiUser: any): User => {
  // Determine primary role
  const primaryRole = apiUser.roleNames?.includes('admin') ? 'admin' :
                     apiUser.roleNames?.includes('cj') ? 'cj' : 'user';

  // Determine status - handle both UserListItemDto and UserDetailsDto
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
    avatar: apiUser.photoUrl
  };
};

interface UserRowProps {
  user: User;
  onViewProfile: (user: User) => void;
  onEdit: (user: User) => void;
  onBlacklist: (userId: string) => void;
  onUnblacklist: (userId: string) => void;
  onDelete: (userId: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onViewProfile, onEdit, onBlacklist, onUnblacklist, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'cj': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'suspended': return <Ban className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <tr className="hover:bg-blue-50/30 transition-all duration-200 group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow duration-200">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">{user.name}</div>
            <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
          {user.role.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
          {getStatusIcon(user.status)}
          <span className="ml-1">{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          {user.role === 'cj' ? (
            <>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{user.reportsCount}</span>
                <span className="text-xs text-blue-600 font-medium">Verified</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                user.reportsCount > 50 ? 'bg-green-500' :
                user.reportsCount > 25 ? 'bg-yellow-500' :
                user.reportsCount > 0 ? 'bg-blue-500' : 'bg-gray-300'
              }`} title={`${user.reportsCount} reports verified`}></div>
            </>
          ) : (
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">N/A</span>
              <span className="text-xs text-gray-400">
                {user.role === 'admin' ? 'No report duties' : 'No report duties'}
              </span>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-blue-100 rounded-lg transition-all duration-200 group-hover:bg-blue-50"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showActions && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl z-20 min-w-[180px] overflow-hidden">
              <div className="py-1">
                <button
                  onClick={() => { onViewProfile(user); setShowActions(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-3 transition-all duration-200 border-b border-gray-100"
                >
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">View Profile</span>
                </button>
                <button
                  onClick={() => { onEdit(user); setShowActions(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center space-x-3 transition-all duration-200 border-b border-gray-100"
                >
                  <Edit className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Edit User</span>
                </button>
                {/* Conditional Blacklist/Unblacklist Button */}
                {user.status === 'suspended' ? (
                  <button
                    onClick={() => { onUnblacklist(user.id); setShowActions(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-3 transition-all duration-200 border-b border-gray-100"
                  >
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Unblacklist User</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { onBlacklist(user.id); setShowActions(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 hover:text-orange-700 flex items-center space-x-3 transition-all duration-200 border-b border-gray-100"
                  >
                    <Ban className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">Blacklist User</span>
                  </button>
                )}
                <button
                  onClick={() => { onDelete(user.id); setShowActions(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Delete User</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const UserManagement: React.FC = () => {
  // Modal state
  const [viewProfileModal, setViewProfileModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null
  });

  const [editUserModal, setEditUserModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null
  });

  // Use the custom hook for API integration
  const {
    users: apiUsers,
    totalCount,
    totalPages: apiTotalPages,
    currentPage,
    pageSize,
    stats,
    availableRoles,
    isLoading,
    isLoadingStats,
    isLoadingRoles,
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

  // Convert API users to local format - handle undefined/null apiUsers
  const users: User[] = (apiUsers || []).map(mapApiUserToLocal);

  const handleViewProfile = (user: User) => {
    setViewProfileModal({
      isOpen: true,
      user: user
    });
  };

  const handleEditUser = (user: User) => {
    setEditUserModal({
      isOpen: true,
      user: user
    });
  };

  const handleCloseViewProfile = () => {
    setViewProfileModal({
      isOpen: false,
      user: null
    });
  };

  const handleCloseEditUser = () => {
    setEditUserModal({
      isOpen: false,
      user: null
    });
  };

  const handleSaveUser = async (userId: string, userData: any) => {
    try {
      await updateUser(userId, userData);
      // Modal will close automatically on success
      handleCloseEditUser();
    } catch (error) {
      // Error handling is done in the hook via toast
      throw error;
    }
  };

  const handleBlacklistUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    const userName = user?.name || 'this user';

    if (window.confirm(`Are you sure you want to blacklist ${userName}? They will be suspended and unable to access the system.`)) {
      try {
        await blacklistUser(userId);
        console.log('✅ User blacklisted successfully:', userName);
        // The UI will automatically update due to the API response
      } catch (error) {
        console.error('❌ Failed to blacklist user:', error);
        alert('Failed to blacklist user. Please try again.');
      }
    }
  };

  const handleUnblacklistUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    const userName = user?.name || 'this user';

    if (window.confirm(`Are you sure you want to unblacklist ${userName}? They will regain access to the system.`)) {
      try {
        await unblacklistUser(userId);
        console.log('✅ User unblacklisted successfully:', userName);
        // The UI will automatically update due to the API response
      } catch (error) {
        console.error('❌ Failed to unblacklist user:', error);
        alert('Failed to unblacklist user. Please try again.');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  // Calculate pagination info - handle undefined values
  const startIndex = ((currentPage || 1) - 1) * (pageSize || 10);
  const endIndex = Math.min(startIndex + (pageSize || 10), totalCount || 0);

  // Use API stats or calculate from current data as fallback
  const displayStats = stats || {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    adminUsers: users.filter(u => u.role === 'admin').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-500 hover:text-gray-700">
                <Shield className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage users, roles, and permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refresh}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh users"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Import Users
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Users
              </button>
              <button
                onClick={() => console.log('Add user functionality to be implemented')}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                {isLoadingStats ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-lg text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{displayStats.totalUsers || 0}</p>
                )}
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                {isLoadingStats ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-lg text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-green-600">{displayStats.activeUsers || 0}</p>
                )}
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                {isLoadingStats ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-lg text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-red-600">{displayStats.suspendedUsers || 0}</p>
                )}
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                {isLoadingStats ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-lg text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-purple-600">{displayStats.adminUsers || 0}</p>
                )}
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => {
                    console.log('Search term changed:', e.target.value);
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
                {isLoading && (
                  <Loader2 className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
                )}
              </div>
              <select
                value={filters.role || 'all'}
                onChange={(e) => {
                  console.log('🔍 Role filter changed:', e.target.value);
                  console.log('🔍 Current filters before change:', filters);
                  setRoleFilter(e.target.value);
                  console.log('🔍 setRoleFilter called with:', e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoadingRoles}
              >
                <option value="all">All Roles</option>
                {isLoadingRoles ? (
                  <option disabled>Loading roles...</option>
                ) : (
                  availableRoles.map(role => (
                    <option key={role} value={role.toLowerCase()}>
                      {role}
                    </option>
                  ))
                )}
              </select>
              <select
                value={filters.status || 'all'}
                onChange={(e) => {
                  console.log('🔍 Status filter changed:', e.target.value);
                  console.log('🔍 Current filters before change:', filters);
                  setStatusFilter(e.target.value);
                  console.log('🔍 setStatusFilter called with:', e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading users...</span>
                  </div>
                ) : (
                  `${totalCount || 0} total users`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reports Activity
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  // Loading state
                  Array.from({ length: pageSize || 10 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-48"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-8 bg-gray-200 rounded w-8 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  // Error state
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load users</h3>
                          <p className="text-gray-600 mb-4">{error.message || 'An error occurred while fetching users.'}</p>
                          <button
                            onClick={refresh}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <Users className="w-12 h-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data state
                  users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onViewProfile={handleViewProfile}
                      onEdit={handleEditUser}
                      onBlacklist={handleBlacklistUser}
                      onUnblacklist={handleUnblacklistUser}
                      onDelete={handleDeleteUser}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 mt-6 px-6 py-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              {/* Pagination Info */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, users.length)}</span> of{' '}
                  <span className="font-medium">{totalCount || 0}</span> users
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
                    Show:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700">per page</span>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={(currentPage || 1) === 1}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(Math.max((currentPage || 1) - 1, 1))}
                  disabled={(currentPage || 1) === 1}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, apiTotalPages || 1) }, (_, i) => {
                    const safeTotalPages = apiTotalPages || 1;
                    const safeCurrentPage = currentPage || 1;
                    let pageNumber;
                    if (safeTotalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (safeCurrentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (safeCurrentPage >= safeTotalPages - 2) {
                      pageNumber = safeTotalPages - 4 + i;
                    } else {
                      pageNumber = safeCurrentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                          (currentPage || 1) === pageNumber
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min((currentPage || 1) + 1, apiTotalPages || 1))}
                  disabled={(currentPage || 1) === (apiTotalPages || 1)}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(apiTotalPages || 1)}
                  disabled={(currentPage || 1) === (apiTotalPages || 1)}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewProfileModal
        user={viewProfileModal.user}
        isOpen={viewProfileModal.isOpen}
        onClose={handleCloseViewProfile}
      />

      <EditUserModal
        user={editUserModal.user}
        isOpen={editUserModal.isOpen}
        onClose={handleCloseEditUser}
        onSave={handleSaveUser}
        availableRoles={availableRoles}
        isLoading={false}
      />
    </div>
  );
};

export default UserManagement;
