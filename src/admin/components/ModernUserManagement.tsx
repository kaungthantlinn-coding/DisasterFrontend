import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  Ban,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Grid3X3,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BarChart3
} from 'lucide-react';
import { userManagementApi } from '../../apis/userManagement';
import Avatar from '../../components/Common/Avatar';
import { extractPhotoUrl } from '../../utils/avatarUtils';
import UserManagementCharts from './UserManagementCharts';

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
}

type SortField = 'name' | 'email' | 'role' | 'status' | 'joinDate' | 'reportsCount';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple';
  change?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, change }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className="text-sm text-emerald-600 mt-1">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const UserCard: React.FC<{ user: User; onAction: (action: string, user: User) => void }> = ({ 
  user, 
  onAction 
}) => {
  const [showActions, setShowActions] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'cj': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'suspended': return <Ban className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={user.photoUrl}
            alt={user.name}
            size="md"
            className="ring-2 ring-slate-100"
          />
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {user.name}
            </h3>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
              <button
                onClick={() => { onAction('view', user); setShowActions(false); }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Profile</span>
              </button>
              <button
                onClick={() => { onAction('edit', user); setShowActions(false); }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit User</span>
              </button>
              {user.status === 'active' ? (
                <button
                  onClick={() => { onAction('suspend', user); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Ban className="w-4 h-4" />
                  <span>Suspend</span>
                </button>
              ) : (
                <button
                  onClick={() => { onAction('activate', user); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Activate</span>
                </button>
              )}
              <hr className="my-2" />
              <button
                onClick={() => { onAction('delete', user); setShowActions(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
            <Shield className="w-3 h-3 mr-1" />
            {user.role.toUpperCase()}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
            {getStatusIcon(user.status)}
            <span className="ml-1">{user.status}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-slate-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{user.joinDate}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{user.reportsCount} reports</span>
          </div>
          {user.phone && (
            <div className="flex items-center text-slate-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>{user.phone}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center text-slate-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{user.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserTableRow: React.FC<{ user: User; onAction: (action: string, user: User) => void }> = ({ 
  user, 
  onAction 
}) => {
  const [showActions, setShowActions] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'cj': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'suspended': return <Ban className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={user.photoUrl}
            alt={user.name}
            size="sm"
            className="ring-2 ring-slate-100"
          />
          <div>
            <div className="font-medium text-slate-900">{user.name}</div>
            <div className="text-sm text-slate-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
          <Shield className="w-3 h-3 mr-1" />
          {user.role.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
          {getStatusIcon(user.status)}
          <span className="ml-1">{user.status}</span>
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {user.joinDate}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          {user.reportsCount}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        {user.phone && (
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            {user.phone}
          </div>
        )}
        {user.location && (
          <div className="flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-2" />
            {user.location}
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
              <button
                onClick={() => { onAction('view', user); setShowActions(false); }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Profile</span>
              </button>
              <button
                onClick={() => { onAction('edit', user); setShowActions(false); }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit User</span>
              </button>
              {user.status === 'active' ? (
                <button
                  onClick={() => { onAction('suspend', user); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Ban className="w-4 h-4" />
                  <span>Suspend</span>
                </button>
              ) : (
                <button
                  onClick={() => { onAction('activate', user); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Activate</span>
                </button>
              )}
              <hr className="my-2" />
              <button
                onClick={() => { onAction('delete', user); setShowActions(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="bg-white px-6 py-4 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-slate-600">per page</span>
          </div>
          <div className="text-sm text-slate-600">
            Showing {startItem} to {endItem} of {totalItems} results
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1">
            {totalPages > 1 && getVisiblePages().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={index} className="px-3 py-2 text-sm text-slate-400">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ModernUserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [showCharts, setShowCharts] = useState(true);


  // Fetch users data
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['users', searchTerm, roleFilter, statusFilter],
    queryFn: () => userManagementApi.getUsers(),
    refetchInterval: 30000,
  });

  // Map API data to local format
  const users: User[] = useMemo(() => {
    if (!usersData?.users) return [];
    
    return usersData.users.map((apiUser: any) => ({
      id: apiUser.userId,
      name: apiUser.name,
      email: apiUser.email,
      phone: apiUser.phone,
      role: apiUser.roleNames?.includes('admin') ? 'admin' : 
            apiUser.roleNames?.includes('cj') ? 'cj' : 'user',
      status: apiUser.isBlacklisted ? 'suspended' : 'active',
      joinDate: new Date(apiUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      location: apiUser.location,
      reportsCount: apiUser.reportsCount || 0,
      lastActive: apiUser.lastActive || 'Unknown',
      photoUrl: extractPhotoUrl(apiUser),
      roleNames: apiUser.roleNames
    }));
  }, [usersData]);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortConfig]);

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  // Calculate stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const suspendedUsers = users.filter(u => u.status === 'suspended').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;

    return { totalUsers, activeUsers, suspendedUsers, adminUsers };
  }, [users]);

  const handleUserAction = (action: string, user: User) => {
    console.log(`Action: ${action}`, user);
    // Implement action handlers here
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-slate-600">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load users</h3>
        <p className="text-slate-600 mb-4">There was an error loading the user data.</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
              showCharts 
                ? 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' 
                : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg shadow-blue-500/25">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<UserCheck className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Suspended"
          value={stats.suspendedUsers}
          icon={<UserX className="w-6 h-6" />}
          color="red"
        />
        <StatsCard
          title="Admins"
          value={stats.adminUsers}
          icon={<Shield className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="cj">CJ</option>
                <option value="user">User</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">
              {filteredAndSortedUsers.length} total users
            </span>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                  viewMode === 'table' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Content */}
      {filteredAndSortedUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
          <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center space-x-2 text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>User</span>
                      {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('role')}
                      className="flex items-center space-x-2 text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>Role</span>
                      {getSortIcon('role')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center space-x-2 text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>Status</span>
                      {getSortIcon('status')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('joinDate')}
                      className="flex items-center space-x-2 text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>Join Date</span>
                      {getSortIcon('joinDate')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('reportsCount')}
                      className="flex items-center space-x-2 text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>Reports</span>
                      {getSortIcon('reportsCount')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onAction={handleUserAction}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onAction={handleUserAction}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
    </div>
  );
};

export default ModernUserManagement;
