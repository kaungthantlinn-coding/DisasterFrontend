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
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  UserCheck,
  AlertCircle,
  Zap,
  Globe
} from 'lucide-react';

// Hooks
import { useReports, useReportsStatistics } from '../hooks/useReports';

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
        <div className={`p-4 rounded-xl ${iconBg} bg-white/20 backdrop-blur-sm`}>
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
  const getStatusColor = () => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = () => {
    switch (type.toLowerCase()) {
      case 'earthquake': return '🏠';
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'cyclone': return '🌪️';
      default: return '⚠️';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl">{getTypeIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <UserCheck className="w-3 h-3 mr-1" />
              {reporter}
            </p>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {location}
            </p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${getPriorityColor()}`} title={`${priority} priority`}></div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        <div className="flex space-x-1">
          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <CheckCircle className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const VerificationStep: React.FC<VerificationStepProps> = ({ step, description, isCompleted, isActive }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isCompleted ? 'bg-green-100 text-green-600' : 
        isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
      }`}>
        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
      </div>
      <div className="flex-1">
        <h4 className={`font-medium ${
          isCompleted ? 'text-green-900' : 
          isActive ? 'text-blue-900' : 'text-gray-500'
        }`}>{step}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // API calls for real data
  const { data: reportsData, isLoading: reportsLoading } = useReports({
    page: 1,
    pageSize: 10,
    filters: { status: 'pending' }
  });

  const { data: statsData, isLoading: statsLoading } = useReportsStatistics();

  // Get stats from API or use defaults
  const stats = {
    totalReports: statsData?.totalReports || 0,
    pendingVerification: statsData?.pendingReports || 0,
    assistanceRequests: statsData?.assistanceRequests || 0,
    blacklistedUsers: 0 // This would come from a user management API
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">DisasterResponse Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminStatCard
              icon={<FileText className="w-6 h-6" />}
              title="Total Reports"
              value={stats.totalReports.toLocaleString()}
              change="+12% from last week"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
              iconBg="bg-blue-400"
            />
            <AdminStatCard
              icon={<Clock className="w-6 h-6" />}
              title="Pending Verification"
              value={stats.pendingVerification}
              change="+5 since yesterday"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-yellow-500 to-orange-500"
              iconBg="bg-yellow-400"
            />
            <AdminStatCard
              icon={<Users className="w-6 h-6" />}
              title="Assistance Requests"
              value={stats.assistanceRequests}
              change="+8% from last week"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-green-500 to-emerald-600"
              iconBg="bg-green-400"
            />
            <AdminStatCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Blacklisted Users"
              value={stats.blacklistedUsers}
              change="+2 this month"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-red-500 to-red-600"
              iconBg="bg-red-400"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Reports Needing Verification</h3>
                <Link 
                  to="/verify-reports" 
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                >
                  View all pending reports
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Verification Process</h3>
              <div className="space-y-4">
                {verificationSteps.map((step, index) => (
                  <VerificationStep key={index} {...step} />
                ))}
              </div>
              <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                📋 View Verification Guidelines
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/admin/users" 
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5 mr-3 text-blue-600" />
                  Manage Users
                </Link>
                <Link 
                  to="/admin/reports" 
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5 mr-3 text-green-600" />
                  All Reports
                </Link>
                <Link 
                  to="/admin/analytics" 
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 mr-3 text-purple-600" />
                  Analytics
                </Link>
                <Link 
                  to="/admin/settings" 
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 mr-3 text-gray-600" />
                  System Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Disaster Impact Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Disaster Impact Map</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                🗺️ View Full Map
              </button>
            </div>
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive map showing disaster locations</p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  🗺️ View Full Map
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Earthquake</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Flood</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Fire</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Other</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                View All Activity
                <Activity className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900"><strong>Sarah M.</strong> reported a flood in coastal region</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">You verified an earthquake report</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900"><strong>John D.</strong> updated assistance details</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900"><strong>Robert T.</strong> endorsed assistance received</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
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