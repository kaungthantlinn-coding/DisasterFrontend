import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  AlertCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useAuditLog, useAuditLogStats, AuditLogEntry, AuditLogFilters } from '../../hooks/useAuditLog';

interface AuditLogTableRowProps {
  log: AuditLogEntry;
  onViewDetails: (log: AuditLogEntry) => void;
}

const AuditLogTableRow: React.FC<AuditLogTableRowProps> = ({ log, onViewDetails }) => {

  const getHumanFriendlyAction = (action: string) => {
    if (action.includes('login')) return 'Login';
    if (action.includes('logout')) return 'Logout';
    if (action.includes('create') || action.includes('add')) return 'Create';
    if (action.includes('update') || action.includes('edit') || action.includes('modify')) return 'Edit';
    if (action.includes('delete') || action.includes('remove')) return 'Delete';
    if (action.includes('suspend')) return 'Suspend';
    if (action.includes('role')) return 'Role Update';
    if (action.includes('audit')) return 'Accessed Audit Logs';
    if (action.includes('profile')) return 'Updated Profile';
    return action;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* User Column - Name with UUID tooltip */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900" title={log.userId}>
          {log.userName}
        </div>
      </td>
      
      {/* Action Column - Human-friendly words */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {getHumanFriendlyAction(log.action)}
        </div>
      </td>
      
      {/* Description Column - Key details */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 truncate max-w-xs" title={log.details}>
          {log.details || 'No additional details'}
        </div>
      </td>
      
      {/* Target Column - System/Module */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {log.targetType || 'System'}
        </div>
        {log.targetName && (
          <div className="text-xs text-gray-500 mt-1">{log.targetName}</div>
        )}
      </td>
      
      {/* Time Column - Short readable date with AM/PM */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatTimestamp(log.timestamp)}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onViewDetails(log)}
          className="text-blue-600 hover:text-blue-900 flex items-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
      </td>
    </tr>
  );
};

const AuditLogsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // API calls
  const { data: auditLogData, isLoading, error, refetch } = useAuditLog({
    page: currentPage,
    pageSize,
    filters: {
      ...filters,
      ...(searchTerm && { action: searchTerm })
    }
  });

  const { stats: auditStats, refetch: refetchStats } = useAuditLogStats();

  // Mock data for demonstration (replace with actual API data)
  const mockAuditLogs: AuditLogEntry[] = [
    {
      id: '1',
      userId: 'user-123-456-789',
      userName: 'Kaung Kaung Thant Linn',
      action: 'user_login',
      targetType: 'system',
      targetName: 'Auth Service',
      details: 'Successful login via /api/auth/login',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date().toISOString(),
      severity: 'low'
    },
    {
      id: '2',
      userId: 'admin-456-789-123',
      userName: 'Test Admin',
      action: 'user_create',
      targetType: 'user',
      targetName: 'User Service',
      details: 'Added new user with role: user',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      severity: 'low'
    },
    {
      id: '3',
      userId: 'admin-456-789-123',
      userName: 'Test Admin',
      action: 'user_edit',
      targetType: 'user',
      targetName: 'User Service',
      details: 'Updated user profile information',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      severity: 'low'
    },
    {
      id: '4',
      userId: 'admin-456-789-123',
      userName: 'Test Admin',
      action: 'user_suspend',
      targetType: 'user',
      targetName: 'User Service',
      details: 'Suspended user account for policy violation',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      severity: 'medium'
    },
    {
      id: '5',
      userId: 'admin-456-789-123',
      userName: 'Test Admin',
      action: 'user_delete',
      targetType: 'user',
      targetName: 'User Service',
      details: 'Permanently deleted user account',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      severity: 'high'
    },
    {
      id: '6',
      userId: 'user-789-123-456',
      userName: 'John Smith',
      action: 'audit_access',
      targetType: 'system',
      targetName: 'Admin Panel',
      details: 'Accessed audit logs section',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      severity: 'low'
    }
  ];

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      // This would typically call an API endpoint to generate and download a CSV/Excel file
      console.log('Exporting audit logs...');
      // Implementation would depend on your backend API
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleRefresh = () => {
    refetch();
    refetchStats();
  };

  const totalPages = auditLogData?.totalPages || 1;
  // Use mock data for demonstration (replace with: auditLogData?.logs || [])
  const logs = mockAuditLogs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <History className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Audit Logs</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <History className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Logs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {auditStats.totalLogs.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {auditStats.todayLogs}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">User Actions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {auditStats.userActions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search actions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                    showFilters
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-500">per page</span>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action
                    </label>
                    <select
                      value={filters.action || ''}
                      onChange={(e) => handleFilterChange('action', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Actions</option>
                      <option value="user_login">Login</option>
                      <option value="user_logout">Logout</option>
                      <option value="user_create">Create</option>
                      <option value="user_edit">Edit</option>
                      <option value="user_delete">Delete</option>
                      <option value="user_suspend">Suspend</option>
                      <option value="audit_access">Accessed Audit Logs</option>
                      <option value="profile_update">Updated Profile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Type
                    </label>
                    <select
                      value={filters.targetType || ''}
                      onChange={(e) => handleFilterChange('targetType', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="user">User</option>
                      <option value="report">Report</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.startDate || ''}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.endDate || ''}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                      <p className="text-gray-500">Loading audit logs...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                      <p className="text-red-600">Error loading audit logs: {error}</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-gray-500">No audit logs found</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <AuditLogTableRow
                      key={log.id}
                      log={log}
                      onViewDetails={setSelectedLog}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * pageSize + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, auditLogData?.totalCount || 0)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{auditLogData?.totalCount || 0}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Audit Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLog.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLog.userId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Action</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Type</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{selectedLog.targetType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IP Address</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLog.ipAddress}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Details</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLog.details}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;