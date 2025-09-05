import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  AlertTriangle,
  Shield,
  Ban,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Filter,
  RefreshCw,
  Bell,
  FileText,
  Calendar,
  BarChart3,
  Award,
  AlertCircle,
  UserCheck,
  UserX,
  UserMinus,
  Activity
} from 'lucide-react';
import { userReputationApi, reputationUtils, ReputationQueueItem, ReputationStatsDto } from '../../apis/userReputation';
import Avatar from '../../components/Common/Avatar';
import { extractPhotoUrl } from '../../utils/avatarUtils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'orange' | 'red';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend, trendValue }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-yellow-500 to-yellow-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-emerald-600" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-600" />;
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {trendValue && (
            <div className="flex items-center mt-1 space-x-1">
              {getTrendIcon()}
              <span className={`text-sm ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const UserReviewCard: React.FC<{ 
  user: ReputationQueueItem; 
  onAction: (action: string, user: ReputationQueueItem) => void 
}> = ({ user, onAction }) => {
  const statusInfo = reputationUtils.getStatusInfo(user.currentStatus);
  const suggestedStatusInfo = reputationUtils.getStatusInfo(user.suggestedStatus);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={user.photoUrl}
            alt={user.userName}
            size="md"
            className="ring-2 ring-slate-100"
          />
          <div>
            <h3 className="font-semibold text-slate-900">{user.userName}</h3>
            <p className="text-sm text-slate-500">{user.userEmail}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(user.priority)}`}>
                {user.priority.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-slate-500 mb-1">Risk Score</div>
          <div className={`text-2xl font-bold ${user.riskScore >= 70 ? 'text-red-600' : user.riskScore >= 50 ? 'text-orange-600' : user.riskScore >= 30 ? 'text-yellow-600' : 'text-emerald-600'}`}>
            {user.riskScore}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="text-sm text-slate-600 mb-1">Current Status</div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
            <span className="mr-1">{statusInfo.emoji}</span>
            {statusInfo.label}
          </span>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="text-sm text-slate-600 mb-1">Suggested Status</div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${suggestedStatusInfo.bgColor} ${suggestedStatusInfo.color}`}>
            <span className="mr-1">{suggestedStatusInfo.emoji}</span>
            {suggestedStatusInfo.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm mb-4">
        <div className="text-center">
          <div className="font-semibold text-slate-900">{user.totalReports}</div>
          <div className="text-slate-600">Total Reports</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-red-600">{user.rejectedReports}</div>
          <div className="text-slate-600">Rejected</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-orange-600">{user.rejectRatio.toFixed(1)}%</div>
          <div className="text-slate-600">Reject Ratio</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Flagged: {new Date(user.flaggedAt).toLocaleDateString()}
        </div>
        {user.lastReportDate && (
          <div className="flex items-center">
            <Activity className="w-3 h-3 mr-1" />
            Last Report: {new Date(user.lastReportDate).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onAction('view', user)}
          className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
        <button
          onClick={() => onAction('warn', user)}
          className="flex-1 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center"
        >
          <AlertTriangle className="w-4 h-4 mr-1" />
          Warn
        </button>
        <button
          onClick={() => onAction('blacklist', user)}
          className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
        >
          <Ban className="w-4 h-4 mr-1" />
          Blacklist
        </button>
      </div>
    </div>
  );
};

const UserReviewManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const queryClient = useQueryClient();

  // Fetch review queue
  const { data: reviewQueue = [], isLoading: queueLoading, error: queueError, refetch: refetchQueue } = useQuery({
    queryKey: ['reviewQueue', statusFilter, priorityFilter],
    queryFn: userReputationApi.getReviewQueue,
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch reputation statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['reputationStats'],
    queryFn: userReputationApi.getReputationStats,
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Update user reputation mutation
  const updateReputationMutation = useMutation({
    mutationFn: userReputationApi.updateUserReputation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewQueue'] });
      queryClient.invalidateQueries({ queryKey: ['reputationStats'] });
    },
  });

  // Bulk calculate reputation mutation
  const bulkCalculateMutation = useMutation({
    mutationFn: userReputationApi.bulkCalculateReputation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewQueue'] });
      queryClient.invalidateQueries({ queryKey: ['reputationStats'] });
    },
  });

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return reviewQueue.filter(user => {
      const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.suggestedStatus === statusFilter;
      const matchesPriority = priorityFilter === 'all' || user.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [reviewQueue, searchTerm, statusFilter, priorityFilter]);

  const handleUserAction = async (action: string, user: ReputationQueueItem) => {
    try {
      switch (action) {
        case 'view':
          // Open user details modal
          console.log('View user details:', user);
          break;
        case 'warn':
          await updateReputationMutation.mutateAsync({
            userId: user.userId,
            newStatus: 'warning',
            reason: `User flagged for high reject ratio (${user.rejectRatio.toFixed(1)}%) and risk score (${user.riskScore})`,
            adminNotes: 'Automated warning based on report rejection patterns'
          });
          break;
        case 'blacklist':
          await updateReputationMutation.mutateAsync({
            userId: user.userId,
            newStatus: 'blacklisted',
            reason: `User blacklisted for excessive report rejections (${user.rejectedReports} rejected out of ${user.totalReports} total)`,
            adminNotes: 'Blacklisted due to poor report quality and high rejection rate'
          });
          break;
        case 'restore':
          await updateReputationMutation.mutateAsync({
            userId: user.userId,
            newStatus: 'normal',
            reason: 'Status restored by admin review',
            adminNotes: 'Manual restoration after review'
          });
          break;
      }
    } catch (error) {
      console.error('Failed to update user reputation:', error);
    }
  };

  const handleBulkCalculate = async () => {
    try {
      await bulkCalculateMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to bulk calculate reputation:', error);
    }
  };

  if (queueLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-slate-600">Loading user review queue...</span>
        </div>
      </div>
    );
  }

  if (queueError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load review queue</h3>
        <p className="text-slate-600 mb-4">There was an error loading the user review data.</p>
        <button
          onClick={() => refetchQueue()}
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
          <h1 className="text-2xl font-bold text-slate-900">User Review Management</h1>
          <p className="text-slate-600 mt-1">Monitor and manage user reputation based on report quality</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBulkCalculate}
            disabled={bulkCalculateMutation.isPending}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {bulkCalculateMutation.isPending ? 'Calculating...' : 'Recalculate All'}
          </button>
          <button
            onClick={() => refetchQueue()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Normal Users"
            value={stats.normalUsers}
            icon={<UserCheck className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="Suspicious"
            value={stats.suspiciousUsers}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="yellow"
          />
          <StatsCard
            title="Warning"
            value={stats.warningUsers}
            icon={<UserMinus className="w-6 h-6" />}
            color="orange"
          />
          <StatsCard
            title="Blacklisted"
            value={stats.blacklistedUsers}
            icon={<UserX className="w-6 h-6" />}
            color="red"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pendingReview}
            icon={<Clock className="w-6 h-6" />}
            color="blue"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="suspicious">Suspicious</option>
              <option value="warning">Warning</option>
              <option value="blacklisted">Blacklisted</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="text-sm text-slate-600">
            {filteredUsers.length} users requiring review
          </div>
        </div>
      </div>

      {/* Review Queue */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No users requiring review</h3>
          <p className="text-slate-600">All users are in good standing or try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserReviewCard
              key={user.userId}
              user={user}
              onAction={handleUserAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviewManagement;
