import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Edit,
  Eye,
  Trash2,
  Ban,
  Mail,
  Phone,
  Calendar,
  MoreVertical
} from 'lucide-react';

// Import our clean components
import CleanTable from '../../components/ui/CleanTable';
import CleanPagination from '../../components/ui/CleanPagination';
import CleanFilters from '../../components/ui/CleanFilters';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'admin' as const,
    status: 'active' as const,
    joinDate: '2024-01-15',
    lastActive: '2024-01-20',
    reportsCount: 0,
    photoUrl: null
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    role: 'cj' as const,
    status: 'active' as const,
    joinDate: '2024-01-10',
    lastActive: '2024-01-19',
    reportsCount: 45,
    photoUrl: null
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 456-7890',
    role: 'user' as const,
    status: 'suspended' as const,
    joinDate: '2024-01-05',
    lastActive: '2024-01-18',
    reportsCount: 0,
    photoUrl: null
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 321-0987',
    role: 'user' as const,
    status: 'active' as const,
    joinDate: '2024-01-12',
    lastActive: '2024-01-20',
    reportsCount: 0,
    photoUrl: null
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+1 (555) 654-3210',
    role: 'cj' as const,
    status: 'active' as const,
    joinDate: '2024-01-08',
    lastActive: '2024-01-19',
    reportsCount: 32,
    photoUrl: null
  }
];

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'cj' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
  reportsCount: number;
  photoUrl?: string | null;
}

const CleanUserManagement: React.FC = () => {
  const [users] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc'
  });
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all'
  });

  // Filter and sort logic
  React.useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof User];
      const bValue = b[sortConfig.key as keyof User];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, filters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', role: 'all', status: 'all' });
  };

  // Get role badge styling
  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-50 text-red-700 border-red-200',
      cj: 'bg-blue-50 text-blue-700 border-blue-200',
      user: 'bg-green-50 text-green-700 border-green-200'
    };
    return `inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${styles[role as keyof typeof styles]}`;
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-200',
      inactive: 'bg-slate-50 text-slate-700 border-slate-200',
      suspended: 'bg-red-50 text-red-700 border-red-200'
    };
    return `inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${styles[status as keyof typeof styles]}`;
  };

  // Table columns configuration
  const columns = [
    {
      key: 'user',
      header: 'User',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-900 truncate">{user.name}</div>
            <div className="text-xs text-slate-500 truncate flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {user.email}
            </div>
            {user.phone && (
              <div className="text-xs text-slate-400 truncate flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {user.phone}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (user: User) => (
        <span className={getRoleBadge(user.role)}>
          <Shield className="w-3 h-3 mr-1" />
          {user.role.toUpperCase()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (user: User) => (
        <span className={getStatusBadge(user.status)}>
          {user.status === 'active' && <UserCheck className="w-3 h-3 mr-1" />}
          {user.status === 'suspended' && <Ban className="w-3 h-3 mr-1" />}
          {user.status === 'inactive' && <UserX className="w-3 h-3 mr-1" />}
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      )
    },
    {
      key: 'joinDate',
      header: 'Joined',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center text-sm text-slate-600">
          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
          {new Date(user.joinDate).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'reportsCount',
      header: 'Reports',
      sortable: true,
      align: 'center' as const,
      render: (user: User) => (
        <div className="text-center">
          {user.role === 'cj' ? (
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-slate-900">{user.reportsCount}</span>
              <span className="text-xs text-blue-600">Verified</span>
            </div>
          ) : (
            <span className="text-sm text-slate-400">N/A</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (user: User) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="More Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Filter fields configuration
  const filterFields = [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const,
      placeholder: 'Search by name, email, or phone...',
      value: filters.search,
      onChange: (value: string) => handleFilterChange('search', value)
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'CJ', value: 'cj' },
        { label: 'User', value: 'user' }
      ],
      value: filters.role,
      onChange: (value: string) => handleFilterChange('role', value)
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' }
      ],
      value: filters.status,
      onChange: (value: string) => handleFilterChange('status', value)
    }
  ];

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-slate-500 hover:text-slate-700">
                <Shield className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">User Management</h1>
                <p className="text-sm text-slate-500">Manage users, roles, and permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="flex items-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
              <button className="flex items-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
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
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <CleanFilters
          fields={filterFields}
          onClear={clearFilters}
          className="mb-6"
        />

        {/* Table */}
        <CleanTable
          data={paginatedUsers}
          columns={columns}
          sortConfig={sortConfig}
          onSort={handleSort}
          className="mb-6"
        />

        {/* Pagination */}
        <CleanPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default CleanUserManagement;