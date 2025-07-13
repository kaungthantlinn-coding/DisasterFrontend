import React, { useState } from 'react';
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
  RefreshCw
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

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: User['status']) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete, onStatusChange }) => {
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
      case 'active': return <UserCheck className="w-4 h-4" />;
      case 'inactive': return <Users className="w-4 h-4" />;
      case 'suspended': return <UserX className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                {user.role.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                {getStatusIcon(user.status)}
                <span>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showActions && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
              <button 
                onClick={() => { onEdit(user); setShowActions(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit User</span>
              </button>
              <button 
                onClick={() => { onStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active'); setShowActions(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                <span>{user.status === 'active' ? 'Suspend' : 'Activate'}</span>
              </button>
              <button 
                onClick={() => { onDelete(user.id); setShowActions(false); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete User</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{user.location}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Joined {user.joinDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm">
          <span className="text-gray-500">Reports: </span>
          <span className="font-semibold text-gray-900">{user.reportsCount}</span>
        </div>
        <div className="text-sm text-gray-500">
          Last active: {user.lastActive}
        </div>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);

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
      reportsCount: 12,
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
      reportsCount: 8,
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
      reportsCount: 3,
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
      reportsCount: 1,
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
      reportsCount: 15,
      lastActive: '2 weeks ago'
    }
  ];

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // Implement edit user functionality
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId);
    // Implement delete user functionality
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
                Showing {filteredUsers.length} of {users.length} users
              </span>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;