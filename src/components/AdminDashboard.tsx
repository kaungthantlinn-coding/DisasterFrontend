import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Settings,
  MapPin,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  Shield,
  UserCheck,
  AlertCircle,
  Globe,
  History,
  Search,
  ChevronRight,
  Bell,
  Filter,
  Calendar,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

// Hooks
import { useReports, useReportsStatistics } from '../hooks/useReports';
import { useAuditLog, useAuditLogStats, AuditLogEntry } from '../hooks/useAuditLog';

interface AdminStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  bgGradient: string;
  iconBg: string;
}

interface RecentReportProps {
  id: string;
  title: string;
  reporter: string;
  type: string;
  status: 'pending' | 'verified' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeAgo: string;
  location: string;
}

interface VerificationStepProps {
  step: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface AuditLogItemProps {
  log: AuditLogEntry;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ 
  icon, 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  bgGradient, 
  iconBg 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return '↗';
      case 'decrease': return '↘';
      default: return '→';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${bgGradient} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold mb-1">{value}</p>
          {change && (
            <p className={`text-sm flex items-center ${getChangeColor()}`}>
              <span className="mr-1">{getChangeIcon()}</span>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg} bg-white/20 backdrop-blur-sm`}>
          {icon}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
    </div>
  );
};

const RecentReportCard: React.FC<RecentReportProps> = ({ 
  title, 
  reporter, 
  type, 
  status, 
  priority, 
  timeAgo, 
  location 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified': return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500'
      };
      case 'pending': return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500'
      };
      case 'rejected': return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500'
      };
      default: return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-500'
      };
    }
  };

  const getPriorityConfig = () => {
    switch (priority) {
      case 'critical': return { bg: 'bg-red-500', text: 'Critical', textColor: 'text-red-700' };
      case 'high': return { bg: 'bg-orange-500', text: 'High', textColor: 'text-orange-700' };
      case 'medium': return { bg: 'bg-yellow-500', text: 'Medium', textColor: 'text-yellow-700' };
      case 'low': return { bg: 'bg-emerald-500', text: 'Low', textColor: 'text-emerald-700' };
      default: return { bg: 'bg-slate-500', text: 'Unknown', textColor: 'text-slate-700' };
    }
  };

  const getTypeIcon = () => {
    switch (type.toLowerCase()) {
      case 'earthquake': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'flood': return <Activity className="w-5 h-5 text-blue-600" />;
      case 'fire': return <Zap className="w-5 h-5 text-orange-600" />;
      case 'cyclone': return <Target className="w-5 h-5 text-purple-600" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const statusConfig = getStatusConfig();
  const priorityConfig = getPriorityConfig();

  return (
    <div className="group bg-white rounded-xl border border-slate-200/60 p-5 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200 hover:border-slate-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
            {getTypeIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 truncate mb-1 text-base">{title}</h4>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span className="truncate">{reporter}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${priorityConfig.bg}`} title={`${priorityConfig.text} priority`}></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
          <span className="text-xs text-slate-500 font-medium">{timeAgo}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200">
            <CheckCircle className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const VerificationStep: React.FC<VerificationStepProps> = ({ step, description, isCompleted, isActive }) => {
  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
      isActive ? 'bg-blue-50 border border-blue-200' : 
      isCompleted ? 'bg-green-50 border border-green-200' : 
      'bg-gray-50 border border-gray-200'
    }`}>
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
        isCompleted ? 'bg-green-500 text-white' :
        isActive ? 'bg-blue-500 text-white' :
        'bg-gray-300 text-gray-600'
      }`}>
        {isCompleted ? '✓' : isActive ? '•' : '○'}
      </div>
      <div className="flex-1">
        <h4 className={`font-medium ${
          isActive ? 'text-blue-900' : 
          isCompleted ? 'text-green-900' : 
          'text-gray-700'
        }`}>{step}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

const AuditLogItem: React.FC<AuditLogItemProps> = ({ log }) => {
  const getSeverityColor = () => {
    switch (log.severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = () => {
    if (log.action.includes('login') || log.action.includes('logout')) return '🔐';
    if (log.action.includes('create')) return '➕';
    if (log.action.includes('update') || log.action.includes('edit')) return '✏️';
    if (log.action.includes('delete')) return '🗑️';
    if (log.action.includes('role')) return '👤';
    return '📝';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="text-lg">{getActionIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            <span className="font-semibold">{log.userName}</span> {log.action}
            {log.targetName && (
              <span className="text-gray-600"> on {log.targetName}</span>
            )}
          </p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor()}`}>
              {log.severity}
            </span>
            <span className="text-xs text-gray-500">{formatTimestamp(log.timestamp)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-1 truncate">{log.details}</p>
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
          <span>IP: {log.ipAddress}</span>
          <span>Type: {log.targetType}</span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedFilter] = useState('all');
  const [auditLogSearch, setAuditLogSearch] = useState('');

  // API calls for real data
  const { data: reportsData } = useReports({
    page: 1,
    pageSize: 10,
    filters: { status: 'pending' }
  });

  const { data: statsData } = useReportsStatistics();
  
  // Audit log data
  const { data: auditLogData, isLoading: auditLogLoading } = useAuditLog({
    page: 1,
    pageSize: 10,
    filters: auditLogSearch ? { action: auditLogSearch } : {}
  });
  
  const { stats: auditStats } = useAuditLogStats();

  // Get stats from API or use defaults
  const stats = {
    totalReports: statsData?.totalReports || 0,
    pendingVerification: statsData?.pendingReports || 0,
    verifiedReports: statsData?.verifiedReports || 0,
    resolvedReports: statsData?.resolvedReports || 0
  };

  // Get recent reports from API data
  const recentReports = (reportsData?.reports || []).slice(0, 3).map(report => ({
    id: report.id,
    title: report.title,
    reporter: report.reporterName,
    type: report.disasterType.charAt(0).toUpperCase() + report.disasterType.slice(1),
    status: report.status as 'pending' | 'verified' | 'rejected',
    priority: report.severity as 'low' | 'medium' | 'high' | 'critical',
    timeAgo: `Reported ${new Date(report.createdAt).toLocaleDateString()}`,
    location: report.location.address
  }));

  const verificationSteps = [
    {
      step: 'Check Report Details',
      description: 'Review all provided information including disaster type, location, and impact details.',
      isCompleted: true,
      isActive: false
    },
    {
      step: 'Verify Location',
      description: 'Cross-check with official sources and maps to confirm the reported location.',
      isCompleted: true,
      isActive: false
    },
    {
      step: 'Review Media',
      description: 'Examine all uploaded photos and videos for authenticity and relevance.',
      isCompleted: false,
      isActive: true
    },
    {
      step: 'Check Public Data',
      description: 'Compare with available public data sources like USGS for earthquakes.',
      isCompleted: false,
      isActive: false
    },
    {
      step: 'User History',
      description: "Review reporter's history to identify potential fake reports.",
      isCompleted: false,
      isActive: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
                  <p className="text-sm text-slate-500 font-medium">DisasterResponse Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <button className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Overview Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Dashboard Overview</h2>
              <p className="text-slate-600 font-medium">Monitor and manage disaster reports across the platform</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-medium">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <AdminStatCard
              icon={<FileText className="w-5 h-5" />}
              title="Total Reports"
              value={stats.totalReports.toLocaleString()}
              change="+12% from last week"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
              iconBg="bg-blue-400"
            />
            <AdminStatCard
              icon={<Clock className="w-5 h-5" />}
              title="Pending Verification"
              value={stats.pendingVerification}
              change="+5 since yesterday"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-amber-500 to-orange-500"
              iconBg="bg-amber-400"
            />
            <AdminStatCard
              icon={<CheckCircle className="w-5 h-5" />}
              title="Verified Reports"
              value={stats.verifiedReports}
              change="+8% from last week"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
              iconBg="bg-emerald-400"
            />
            <AdminStatCard
              icon={<AlertTriangle className="w-5 h-5" />}
              title="Resolved Reports"
              value={stats.resolvedReports}
              change="+2 this month"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-red-500 to-red-600"
              iconBg="bg-red-400"
            />
          </div>
          
          {/* Audit Log Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Audit Logs</p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">{auditStats.totalLogs.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <History className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Today's Activity</p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">{auditStats.todayLogs}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Critical Events</p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">{auditStats.criticalLogs}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Recent Reports Needing Verification</h3>
                  <p className="text-sm text-slate-600 font-medium">Review and verify these reports</p>
                </div>
                <Link 
                  to="/verify-reports" 
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 flex items-center"
                >
                  View All
                  <TrendingUp className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <RecentReportCard key={report.id} {...report} />
                ))}
              </div>
            </div>
          </div>

          {/* Verification Process */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Verification Process</h3>
                  <p className="text-sm text-slate-600 font-medium">Current workflow status</p>
                </div>
                <button className="px-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 text-sm font-semibold">
                  View Guidelines
                </button>
              </div>
              <div className="space-y-4">
                {verificationSteps.map((step, index) => (
                  <VerificationStep key={index} {...step} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  to="/admin/users" 
                  className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-blue-50 rounded-lg mr-4 group-hover:bg-blue-100 transition-colors">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-slate-700 font-medium group-hover:text-slate-900">Manage Users</span>
                </Link>
                <Link 
                  to="/admin/reports" 
                  className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-emerald-50 rounded-lg mr-4 group-hover:bg-emerald-100 transition-colors">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-slate-700 font-medium group-hover:text-slate-900">All Reports</span>
                </Link>
                <Link 
                  to="/admin/analytics" 
                  className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-purple-50 rounded-lg mr-4 group-hover:bg-purple-100 transition-colors">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-slate-700 font-medium group-hover:text-slate-900">Analytics</span>
                </Link>
                <Link 
                  to="/admin/audit-logs" 
                  className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-orange-50 rounded-lg mr-4 group-hover:bg-orange-100 transition-colors">
                    <History className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-slate-700 font-medium group-hover:text-slate-900">Audit Logs</span>
                </Link>
                <Link 
                  to="/admin/settings" 
                  className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-slate-100 rounded-lg mr-4 group-hover:bg-slate-200 transition-colors">
                    <Settings className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className="text-slate-700 font-medium group-hover:text-slate-900">System Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 flex items-center">
                  <History className="w-6 h-6 mr-3 text-blue-600" />
                  Audit Log History
                </h3>
                <p className="text-sm text-slate-600 font-medium">Recent system activities and security events</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search audit logs..."
                    value={auditLogSearch}
                    onChange={(e) => setAuditLogSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                  />
                </div>
                <Link 
                  to="/admin/audit-logs" 
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 flex items-center"
                >
                  View All Logs
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            
            {auditLogLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading audit logs...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {auditLogData?.logs?.slice(0, 8).map((log) => (
                  <AuditLogItem key={log.id} log={log} />
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No audit logs found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Disaster Impact Map */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-8 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Disaster Impact Map</h3>
                <p className="text-sm text-slate-600 font-medium">Real-time disaster locations and impact zones</p>
              </div>
              <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25">
                View Full Map
              </button>
            </div>
            <div className="bg-slate-50 rounded-2xl h-64 flex items-center justify-center border border-slate-100">
              <div className="text-center">
                <Globe className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Interactive map showing disaster locations</p>
                <p className="text-sm text-slate-400 mt-1">Real-time disaster tracking and visualization</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-slate-700 font-medium">Earthquake</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-slate-700 font-medium">Flood</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-slate-700 font-medium">Fire</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-slate-700 font-medium">Other</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-8 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Recent Activity</h3>
                <p className="text-sm text-slate-600 font-medium">Latest system activities and user actions</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center px-4 py-2.5 hover:bg-blue-50 rounded-xl transition-all duration-200">
                View All Activity
                <Activity className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-5">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 leading-relaxed"><strong>Sarah M.</strong> reported a flood in coastal region</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">You verified an earthquake report</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 leading-relaxed"><strong>John D.</strong> updated assistance details</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 leading-relaxed"><strong>Robert T.</strong> endorsed assistance received</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;