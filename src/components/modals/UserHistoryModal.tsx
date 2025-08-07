import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  User,
  Calendar,
  Clock,
  Activity,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuditLog } from '../../hooks/useAuditLog';

// User interface definition (matching UserManagement.tsx)
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
}

interface UserHistoryModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserHistoryModal: React.FC<UserHistoryModalProps> = ({ user, isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch audit logs for the specific user
  const { data, isLoading, error } = useAuditLog({
    page: currentPage,
    pageSize,
    filters: {
      userId: user?.id,
      action: actionFilter || undefined
    },
    enabled: isOpen && !!user
  });

  // Reset filters when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen && user) {
      setSearchQuery('');
      setActionFilter('');
      setCurrentPage(1);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'edit':
      case 'update':
      case 'updated':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'delete':
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'suspend':
      case 'suspended':
      case 'blacklist':
      case 'blacklisted':
        return <UserX className="w-4 h-4 text-orange-500" />;
      case 'activate':
      case 'activated':
      case 'unblacklist':
      case 'unblacklisted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const filteredLogs = data?.logs?.filter(log => 
    searchQuery === '' || 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalPages = data?.totalPages || 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <History className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">User History</h2>
                <p className="text-blue-100 text-sm">
                  Audit log for {user.name} ({user.email})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search actions, details, or admin name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Filter */}
            <div className="sm:w-48">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="edit">Edit</option>
                <option value="delete">Delete</option>
                <option value="suspend">Suspend</option>
                <option value="activate">Activate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading audit logs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-500">Failed to load audit logs</p>
                <p className="text-sm text-gray-400 mt-2">Please try again later</p>
              </div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No audit logs found</p>
                <p className="text-sm text-gray-400 mt-2">
                  {searchQuery || actionFilter ? 'Try adjusting your filters' : 'No activity recorded for this user'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const { date, time } = formatDateTime(log.timestamp);
                return (
                  <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      {/* Action Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getActionIcon(log.action)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Action and Admin */}
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-gray-900">
                                {log.action}
                              </span>
                              <span className="text-gray-500">by</span>
                              <span className="font-medium text-blue-600">
                                {log.userName}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                                {log.severity}
                              </span>
                            </div>

                            {/* Details */}
                            <p className="text-gray-700 mb-3">{log.details}</p>

                            {/* Target Info */}
                            {log.targetName && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                <User className="w-4 h-4" />
                                <span>Target: {log.targetName}</span>
                              </div>
                            )}

                            {/* IP Address */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>IP: {log.ipAddress}</span>
                              <span>•</span>
                              <span>ID: {log.id.slice(0, 8)}...</span>
                            </div>
                          </div>

                          {/* Timestamp */}
                          <div className="flex-shrink-0 text-right">
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && filteredLogs.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages} ({data?.totalCount || 0} total entries)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHistoryModal;