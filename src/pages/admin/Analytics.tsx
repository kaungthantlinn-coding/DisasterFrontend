import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  Shield,
  Activity,
  Globe,
  Zap,
  Target,
  PieChart,
  LineChart
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon, color }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4" />;
      case 'decrease': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

const SimpleBarChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-20 text-sm text-gray-600 truncate">{item.name}</div>
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${item.color || 'bg-blue-500'}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-gray-900 text-right">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SimplePieChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${item.color || 'bg-blue-500'}`}></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('reports');

  // Mock data - replace with real API data
  const metrics = {
    totalReports: { value: 1248, change: '+12.5%', changeType: 'increase' as const },
    verifiedReports: { value: 1164, change: '+8.3%', changeType: 'increase' as const },
    pendingReports: { value: 84, change: '-5.2%', changeType: 'decrease' as const },
    totalUsers: { value: 2847, change: '+15.7%', changeType: 'increase' as const },
    activeUsers: { value: 156, change: '+3.1%', changeType: 'increase' as const },
    responseTime: { value: '2.3h', change: '-12.5%', changeType: 'decrease' as const },
    systemUptime: { value: '99.9%', change: '+0.1%', changeType: 'increase' as const },
    userSatisfaction: { value: '4.8/5', change: '+0.2', changeType: 'increase' as const }
  };

  const reportsByType = [
    { name: 'Earthquake', value: 425, color: 'bg-red-500' },
    { name: 'Flood', value: 312, color: 'bg-blue-500' },
    { name: 'Fire', value: 198, color: 'bg-orange-500' },
    { name: 'Cyclone', value: 156, color: 'bg-purple-500' },
    { name: 'Landslide', value: 89, color: 'bg-yellow-500' },
    { name: 'Other', value: 68, color: 'bg-gray-500' }
  ];

  const reportsByStatus = [
    { name: 'Verified', value: 1164, color: 'bg-green-500' },
    { name: 'Pending', value: 84, color: 'bg-yellow-500' },
    { name: 'Rejected', value: 23, color: 'bg-red-500' }
  ];

  const usersByRole = [
    { name: 'Users', value: 2789, color: 'bg-blue-500' },
    { name: 'CJ Officers', value: 45, color: 'bg-purple-500' },
    { name: 'Admins', value: 13, color: 'bg-red-500' }
  ];

  const monthlyReports = [
    { name: 'Jan', value: 89 },
    { name: 'Feb', value: 124 },
    { name: 'Mar', value: 156 },
    { name: 'Apr', value: 198 },
    { name: 'May', value: 234 },
    { name: 'Jun', value: 267 },
    { name: 'Jul', value: 298 }
  ];

  const topLocations = [
    { name: 'California', value: 234, color: 'bg-blue-500' },
    { name: 'Texas', value: 189, color: 'bg-green-500' },
    { name: 'Florida', value: 156, color: 'bg-yellow-500' },
    { name: 'New York', value: 134, color: 'bg-purple-500' },
    { name: 'Washington', value: 98, color: 'bg-red-500' }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'High volume of earthquake reports',
      location: 'California',
      time: '2 hours ago',
      type: 'alert',
      severity: 'high'
    },
    {
      id: 2,
      action: 'System performance optimized',
      location: 'Global',
      time: '4 hours ago',
      type: 'system',
      severity: 'info'
    },
    {
      id: 3,
      action: 'New user registration spike',
      location: 'Texas',
      time: '6 hours ago',
      type: 'user',
      severity: 'medium'
    },
    {
      id: 4,
      action: 'Verification backlog cleared',
      location: 'Florida',
      time: '8 hours ago',
      type: 'report',
      severity: 'low'
    }
  ];

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
                <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Comprehensive insights and metrics</p>
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
                <option value="1y">Last year</option>
              </select>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Reports"
              value={metrics.totalReports.value.toLocaleString()}
              change={metrics.totalReports.change}
              changeType={metrics.totalReports.changeType}
              icon={<FileText className="w-6 h-6 text-white" />}
              color="bg-blue-500"
            />
            <MetricCard
              title="Verified Reports"
              value={metrics.verifiedReports.value.toLocaleString()}
              change={metrics.verifiedReports.change}
              changeType={metrics.verifiedReports.changeType}
              icon={<CheckCircle className="w-6 h-6 text-white" />}
              color="bg-green-500"
            />
            <MetricCard
              title="Active Users"
              value={metrics.activeUsers.value.toLocaleString()}
              change={metrics.activeUsers.change}
              changeType={metrics.activeUsers.changeType}
              icon={<Users className="w-6 h-6 text-white" />}
              color="bg-purple-500"
            />
            <MetricCard
              title="Avg Response Time"
              value={metrics.responseTime.value}
              change={metrics.responseTime.change}
              changeType={metrics.responseTime.changeType}
              icon={<Clock className="w-6 h-6 text-white" />}
              color="bg-orange-500"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleBarChart data={reportsByType} title="Reports by Disaster Type" />
          <SimplePieChart data={reportsByStatus} title="Reports by Status" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleBarChart data={topLocations} title="Top Affected Locations" />
          <SimplePieChart data={usersByRole} title="Users by Role" />
        </div>

        {/* Trends and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Monthly Trends */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Report Trends</h3>
                <div className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">7-month view</span>
                </div>
              </div>
              <div className="space-y-4">
                {monthlyReports.map((month, index) => {
                  const maxValue = Math.max(...monthlyReports.map(m => m.value));
                  const percentage = (month.value / maxValue) * 100;
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 text-sm text-gray-600">{month.name}</div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 text-sm font-medium text-gray-900 text-right">{month.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const getSeverityColor = (severity: string) => {
                  switch (severity) {
                    case 'high': return 'bg-red-100 text-red-600';
                    case 'medium': return 'bg-yellow-100 text-yellow-600';
                    case 'low': return 'bg-green-100 text-green-600';
                    default: return 'bg-blue-100 text-blue-600';
                  }
                };

                const getTypeIcon = (type: string) => {
                  switch (type) {
                    case 'alert': return <AlertTriangle className="w-4 h-4" />;
                    case 'system': return <Zap className="w-4 h-4" />;
                    case 'user': return <Users className="w-4 h-4" />;
                    case 'report': return <FileText className="w-4 h-4" />;
                    default: return <Activity className="w-4 h-4" />;
                  }
                };

                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{activity.location}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Health Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">All Systems Operational</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{metrics.systemUptime.value}</p>
              <p className="text-sm text-gray-600">System Uptime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{metrics.userSatisfaction.value}</p>
              <p className="text-sm text-gray-600">User Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{metrics.responseTime.value}</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{metrics.activeUsers.value}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;