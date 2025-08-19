import React, { useState, useEffect } from 'react';
import { History, User, Calendar, AlertCircle, CheckCircle, X } from 'lucide-react';
import { userManagementApi, BlacklistHistoryDto } from '../../apis/userManagement';
import { showErrorToast } from '../../utils/notifications';

interface BlacklistHistoryProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

const BlacklistHistory: React.FC<BlacklistHistoryProps> = ({ 
  userId, 
  userName, 
  isOpen, 
  onClose 
}) => {
  const [history, setHistory] = useState<BlacklistHistoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchBlacklistHistory();
    }
  }, [isOpen, userId]);

  const fetchBlacklistHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userManagementApi.getBlacklistHistory(userId);
      setHistory(response.data);
    } catch (error: any) {
      console.error('Failed to fetch blacklist history:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch blacklist history';
      setError(errorMessage);
      showErrorToast(errorMessage, 'History Load Failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Blacklist History</h2>
              <p className="text-purple-100 text-sm">{userName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading history...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load History</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchBlacklistHistory}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Blacklist History</h3>
              <p className="text-gray-600">This user has never been blacklisted.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">History Records</h3>
                <p className="text-sm text-gray-600">
                  Complete audit trail of all blacklist actions for this user.
                </p>
              </div>

              <div className="space-y-4">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className={`border rounded-lg p-4 ${
                      record.isActive 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    {/* Status Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {record.isActive ? (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="font-semibold text-red-800">Active Blacklist</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-800">Resolved</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 font-mono">
                        ID: {record.id.slice(0, 8)}...
                      </span>
                    </div>

                    {/* Reason */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Reason</h4>
                      <p className="text-gray-700 bg-white p-3 rounded border text-sm">
                        {record.reason}
                      </p>
                    </div>

                    {/* Blacklist Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Blacklisted By
                        </h5>
                        <div className="bg-white p-3 rounded border">
                          <p className="font-medium text-gray-900">{record.blacklistedBy.name}</p>
                          <p className="text-sm text-gray-600">{record.blacklistedBy.email}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Blacklisted Date
                        </h5>
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm text-gray-900">
                            {formatDate(record.blacklistedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Unblacklist Details (if resolved) */}
                    {!record.isActive && record.unblacklistedBy && record.unblacklistedAt && (
                      <div className="border-t pt-4">
                        <h5 className="font-medium text-gray-900 mb-2 text-green-800">
                          Resolution Details
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-gray-700 mb-1 flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              Restored By
                            </h6>
                            <div className="bg-white p-3 rounded border">
                              <p className="font-medium text-gray-900">{record.unblacklistedBy.name}</p>
                              <p className="text-sm text-gray-600">{record.unblacklistedBy.email}</p>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium text-gray-700 mb-1 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Restored Date
                            </h6>
                            <div className="bg-white p-3 rounded border">
                              <p className="text-sm text-gray-900">
                                {formatDate(record.unblacklistedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlacklistHistory;