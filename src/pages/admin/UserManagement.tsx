import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Mail,
  Phone,
  Calendar,
  MapPin,
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
  Clock
} from 'lucide-react';

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

interface UserRowProps {
  user: User;
  onViewProfile: (user: User) => void;
  onEdit: (user: User) => void;
  onBlacklist: (userId: string) => void;
  onStatusChange: (userId: string, status: User['status']) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onViewProfile, onEdit, onBlacklist, onStatusChange }) => {
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
            // Only CJ officers have report activity
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
            // Admin and regular users don't handle reports
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
                <button
                  onClick={() => { onBlacklist(user.id); setShowActions(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3 transition-all duration-200"
                >
                  <Ban className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Blacklist User</span>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data - replace with real API data
  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      status: 'active',
      joinDate: 'Jan 15, 2024',
      location: 'New York, NY',
      reportsCount: 0, // Admin doesn't handle reports directly
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 987-6543',
      role: 'cj',
      status: 'active',
      joinDate: 'Feb 3, 2024',
      location: 'Los Angeles, CA',
      reportsCount: 89, // CJ verifies reports
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      role: 'user',
      status: 'active',
      joinDate: 'Mar 10, 2024',
      location: 'Chicago, IL',
      reportsCount: 0, // Regular users don't handle reports
      lastActive: '3 hours ago'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 (555) 456-7890',
      role: 'user',
      status: 'suspended',
      joinDate: 'Jan 28, 2024',
      location: 'Miami, FL',
      reportsCount: 0, // Regular users don't handle reports
      lastActive: '1 week ago'
    },
    {
      id: '5',
      name: 'Robert Brown',
      email: 'robert.brown@example.com',
      role: 'cj',
      status: 'inactive',
      joinDate: 'Dec 15, 2023',
      location: 'Seattle, WA',
      reportsCount: 156, // Experienced CJ with many verifications
      lastActive: '2 weeks ago'
    },
    {
      id: '6',
      name: 'Lisa Chen',
      email: 'lisa.chen@example.com',
      phone: '+1 (555) 234-5678',
      role: 'user',
      status: 'active',
      joinDate: 'Mar 5, 2024',
      location: 'San Francisco, CA',
      reportsCount: 0, // Regular users don't handle reports
      lastActive: '5 hours ago'
    },
    {
      id: '7',
      name: 'David Martinez',
      email: 'david.martinez@example.com',
      phone: '+1 (555) 345-6789',
      role: 'cj',
      status: 'active',
      joinDate: 'Feb 20, 2024',
      location: 'Phoenix, AZ',
      reportsCount: 67, // CJ with good verification record
      lastActive: '1 hour ago'
    },
    {
      id: '8',
      name: 'Amanda Taylor',
      email: 'amanda.taylor@example.com',
      role: 'user',
      status: 'inactive',
      joinDate: 'Jan 10, 2024',
      location: 'Denver, CO',
      reportsCount: 0, // Regular users don't handle reports
      lastActive: '3 days ago'
    },
    {
      id: '9',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      phone: '+1 (555) 456-7890',
      role: 'admin',
      status: 'active',
      joinDate: 'Dec 1, 2023',
      location: 'Boston, MA',
      reportsCount: 0, // Admin doesn't handle reports directly
      lastActive: '30 minutes ago'
    },
    {
      id: '10',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1 (555) 567-8901',
      role: 'user',
      status: 'active',
      joinDate: 'Mar 15, 2024',
      location: 'Austin, TX',
      reportsCount: 0, // Regular users don't handle reports
      lastActive: '2 hours ago'
    },
    {
      id: '11',
      name: 'Kevin Lee',
      email: 'kevin.lee@example.com',
      role: 'user',
      status: 'suspended',
      joinDate: 'Feb 8, 2024',
      location: 'Portland, OR',
      reportsCount: 0, // Regular users don't handle reports
      lastActive: '2 weeks ago'
    },
    {
      id: '12',
      name: 'Rachel Green',
      email: 'rachel.green@example.com',
      phone: '+1 (555) 678-9012',
      role: 'cj',
      status: 'active',
      joinDate: 'Jan 25, 2024',
      location: 'Nashville, TN',
      reportsCount: 43, // CJ with solid verification record
      lastActive: '4 hours ago'
    },
    {
      id: '13',
      name: 'Michael Torres',
      email: 'michael.torres@example.com',
      phone: '+1 (555) 789-0123',
      role: 'cj',
      status: 'active',
      joinDate: 'Dec 10, 2023',
      location: 'Atlanta, GA',
      reportsCount: 124, // Senior CJ with high verification count
      lastActive: '1 hour ago'
    },
    {
      id: '14',
      name: 'Jennifer Kim',
      email: 'jennifer.kim@example.com',
      role: 'cj',
      status: 'active',
      joinDate: 'Feb 14, 2024',
      location: 'Portland, OR',
      reportsCount: 31, // New CJ building verification record
      lastActive: '3 hours ago'
    },
    {
      id: '15',
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@example.com',
      phone: '+1 (555) 890-1234',
      role: 'cj',
      status: 'inactive',
      joinDate: 'Nov 5, 2023',
      location: 'Dallas, TX',
      reportsCount: 78, // Inactive CJ with previous verification work
      lastActive: '1 week ago'
    }
  ];

  const handleViewProfile = (user: User) => {
    console.log('View profile:', user);
    // Implement view profile functionality
  };

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // Implement edit user functionality
  };

  const handleBlacklistUser = (userId: string) => {
    console.log('Blacklist user:', userId);
    // Implement blacklist user functionality
  };

  const handleStatusChange = (userId: string, status: User['status']) => {
    console.log('Change status:', userId, status);
    // Implement status change functionality
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length
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
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5" />
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
                onClick={() => setShowAddUser(true)}
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
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
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
                <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
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
                <p className="text-3xl font-bold text-purple-600">{stats.admins}</p>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="cj">CJ</option>
                <option value="user">User</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                {filteredUsers.length === users.length
                  ? `${users.length} total users`
                  : `${filteredUsers.length} of ${users.length} users (filtered)`
                }
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
                {paginatedUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onViewProfile={handleViewProfile}
                    onEdit={handleEditUser}
                    onBlacklist={handleBlacklistUser}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 mt-6 px-6 py-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              {/* Pagination Info */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> users
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
                    Show:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
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
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                          currentPage === pageNumber
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
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
    </div>
  );
};

export default UserManagement;