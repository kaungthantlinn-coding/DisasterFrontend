import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  FileText,
  Building2,
  MessageSquare,
  Activity,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Shield
} from 'lucide-react';
import { userManagementApi } from '../../apis/userManagement';
import { ReportsAPI } from '../../apis/reports';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  isLoading?: boolean;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

interface RecentActivityItem {
  id: string;
  type: 'user' | 'report' | 'system' | 'organization';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  isLoading = false 
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  const changeColorClasses = {
    increase: 'text-emerald-600 bg-emerald-50',
    decrease: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50'
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
              <span className="text-2xl font-bold text-slate-300">---</span>
            </div>
          ) : (
            <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
          )}
          
          {change && !isLoading && (
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              changeColorClasses[change.type]
            }`}>
              {change.type === 'increase' ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : change.type === 'decrease' ? (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              ) : null}
              {change.value}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const QuickActionCard: React.FC<QuickActionProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group bg-white"
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${color} flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </button>
  );
};

const ActivityItem: React.FC<{ item: RecentActivityItem }> = ({ item }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'text-emerald-600 bg-emerald-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'report':
        return <FileText className="w-4 h-4" />;
      case 'organization':
        return <Building2 className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className={`p-1.5 rounded-lg ${getStatusColor(item.status)}`}>
        {getTypeIcon(item.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{item.title}</p>
        <p className="text-xs text-slate-500 mt-1">{item.description}</p>
        <p className="text-xs text-slate-400 mt-1">{item.timestamp}</p>
      </div>
    </div>
  );
};

const ModernDashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: () => userManagementApi.getUsers(),
    refetchInterval: 30000,
  });

  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports-count'],
    queryFn: () => ReportsAPI.getReports(1),
    refetchInterval: 30000,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Mock data for demonstration
  const recentActivity: RecentActivityItem[] = [
    {
      id: '1',
      type: 'user',
      title: 'New user registered',
      description: 'John Doe joined the platform',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'report',
      title: 'Emergency report submitted',
      description: 'Flood reported in Downtown area',
      timestamp: '5 minutes ago',
      status: 'warning'
    },
    {
      id: '3',
      type: 'system',
      title: 'System maintenance completed',
      description: 'Database optimization finished',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'organization',
      title: 'New organization verified',
      description: 'Red Cross Myanmar approved',
      timestamp: '2 hours ago',
      status: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg shadow-blue-500/25">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={usersData?.totalCount || 0}
          change={{ value: '+12%', type: 'increase' }}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          isLoading={usersLoading}
        />
        <StatCard
          title="Active Reports"
          value={reportsData?.reports?.length || 0}
          change={{ value: '+8%', type: 'increase' }}
          icon={<FileText className="w-6 h-6" />}
          color="green"
          isLoading={reportsLoading}
        />
        <StatCard
          title="Organizations"
          value="47"
          change={{ value: '+3%', type: 'increase' }}
          icon={<Building2 className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Support Tickets"
          value="23"
          change={{ value: '-15%', type: 'decrease' }}
          icon={<MessageSquare className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add New User"
            description="Create a new user account"
            icon={<Users className="w-5 h-5 text-white" />}
            color="bg-blue-500"
            onClick={() => console.log('Add user')}
          />
          <QuickActionCard
            title="Generate Report"
            description="Create system analytics report"
            icon={<FileText className="w-5 h-5 text-white" />}
            color="bg-emerald-500"
            onClick={() => console.log('Generate report')}
          />
          <QuickActionCard
            title="System Settings"
            description="Configure application settings"
            icon={<Shield className="w-5 h-5 text-white" />}
            color="bg-purple-500"
            onClick={() => console.log('System settings')}
          />
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-1">
            {recentActivity.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">Database</p>
                  <p className="text-sm text-emerald-600">Operational</p>
                </div>
              </div>
              <span className="text-sm font-medium text-emerald-600">99.9%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">API Services</p>
                  <p className="text-sm text-emerald-600">Operational</p>
                </div>
              </div>
              <span className="text-sm font-medium text-emerald-600">100%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Email Service</p>
                  <p className="text-sm text-orange-600">Maintenance</p>
                </div>
              </div>
              <span className="text-sm font-medium text-orange-600">95%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
