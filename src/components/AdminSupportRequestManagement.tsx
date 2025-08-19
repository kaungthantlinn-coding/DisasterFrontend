import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  Shield,
  ChevronRight,
  Bell,
  Filter,
  Calendar,
  Target,
  LifeBuoy,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

import { useReports, useReportsStatistics } from '../hooks/useReports';

import AdminSupportRequestManagement from '../pages/admin/AdminSupportRequestManagement';

interface AdminStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  bgGradient: string;
  iconBg: string;
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
  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <ArrowUpRight className="w-3 h-3" />;
      case 'decrease':
        return <ArrowDownRight className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-emerald-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${bgGradient} p-6 shadow-sm border border-white/20`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-3xl font-bold tracking-tight mb-2">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-medium ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 ${iconBg} rounded-xl shadow-sm`}>
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');



  // API calls for real data
  useReports({
    page: 1,
    pageSize: 10,
    filters: { status: 'pending' }
  });

  const { data: statsData } = useReportsStatistics();
  

  


  // Process stats data
  const stats = statsData ? [
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: 'Total Reports',
      value: statsData.totalReports || 0,
      change: '+12%',
      changeType: 'increase' as const,
      bgGradient: 'bg-gradient-to-br from-blue-600 to-blue-700',
      iconBg: 'bg-white/20'
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: 'Pending Verification',
      value: statsData.pendingReports || 0,
      change: '-8%',
      changeType: 'decrease' as const,
      bgGradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      iconBg: 'bg-white/20'
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      title: 'Verified Reports',
      value: statsData.verifiedReports || 0,
      change: '+15%',
      changeType: 'increase' as const,
      bgGradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      iconBg: 'bg-white/20'
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: 'Resolved Reports',
      value: statsData.resolvedReports || 0,
      change: '+22%',
      changeType: 'increase' as const,
      bgGradient: 'bg-gradient-to-br from-purple-600 to-purple-700',
      iconBg: 'bg-white/20'
    }
  ] : [];

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

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('support-requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'support-requests'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4" />
                Support Requests
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div>
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
                    Export Data
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                  <AdminStatCard key={index} {...stat} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/admin/users" className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Manage Users</h4>
                      </div>
                      <p className="text-sm text-slate-600">Add, edit, or remove user accounts</p>
                    </Link>
                    <Link to="/admin/reports" className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 group-hover:bg-emerald-200 rounded-lg transition-colors">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">View All Reports</h4>
                      </div>
                      <p className="text-sm text-slate-600">Review and manage disaster reports</p>
                    </Link>
                    <Link to="/admin/analytics" className="group p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
                          <BarChart3 className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Analytics</h4>
                      </div>
                      <p className="text-sm text-slate-600">View detailed platform analytics</p>
                    </Link>
                    <Link to="/admin/settings" className="group p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 group-hover:bg-slate-200 rounded-lg transition-colors">
                          <Settings className="w-5 h-5 text-slate-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">System Settings</h4>
                      </div>
                      <p className="text-sm text-slate-600">Configure platform settings</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Request Management Tab */}
        {activeTab === 'support-requests' && (
          <AdminSupportRequestManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;