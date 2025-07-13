import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Globe,
  UserCheck,
  Database,
  Bell,

  Home,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRoles } from '../../hooks/useRoles';

// Import admin pages
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import SystemSettings from './systemsettings';
import ReportManagement from './ReportManagement';



interface AdminStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  bgGradient: string;
  iconBg: string;
  onClick?: () => void;
}

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ 
  icon, 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  bgGradient, 

  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-emerald-400';
      case 'decrease': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-3 h-3" />;
      case 'decrease': return <TrendingUp className="w-3 h-3 rotate-180" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-3xl ${bgGradient} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${onClick ? 'cursor-pointer' : ''} border border-white/20`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 group-hover:scale-125 transition-transform duration-700"></div>
      
      {/* Sparkle effects */}
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <Sparkles className="w-4 h-4 text-white/60" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white/70 text-sm font-medium mb-3 tracking-wide uppercase">{title}</p>
            <p className="text-4xl font-black mb-2 tracking-tight">{value}</p>
            {change && (
              <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
                {getChangeIcon()}
                <span className="font-medium">{change}</span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300`}>
            <div className="group-hover:rotate-12 transition-transform duration-300">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionCard: React.FC<QuickActionProps> = ({ icon, title, description, link, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={link}
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-500 hover:border-blue-300/50 hover:-translate-y-1 hover:bg-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating particles effect */}
      <div className={`absolute top-2 right-2 transition-all duration-700 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <Star className="w-3 h-3 text-yellow-400" />
      </div>
      <div className={`absolute bottom-2 left-2 transition-all duration-700 delay-100 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Zap className="w-3 h-3 text-blue-400" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start space-x-4">
          <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
            <div className="group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 text-lg">{title}</h3>
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">{description}</p>
            
            {/* Animated arrow */}
            <div className="mt-3 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
              <span className="text-sm font-medium mr-1">Explore</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [timeRange, setTimeRange] = useState('7d');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if we're on the main admin panel page
  const isMainPanel = location.pathname === '/admin' || location.pathname === '/admin/';

  // Navigation items with CMS functionality
  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: <Home className="w-5 h-5" />,
      active: isMainPanel
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: <Users className="w-5 h-5" />,
      active: location.pathname.includes('/admin/users')
    },
    {
      title: 'Report Management',
      href: '/admin/reports',
      icon: <FileText className="w-5 h-5" />,
      active: location.pathname.includes('/admin/reports')
    },

    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      active: location.pathname.includes('/admin/analytics')
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
      active: location.pathname.includes('/admin/settings')
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Mock data - replace with real API data
  const stats = {
    totalUsers: 2847,
    totalReports: 1248,
    pendingVerification: 84,
    systemHealth: 98.5,
    activeUsers: 156,
    verifiedReports: 1164,
    blacklistedUsers: 17,
    serverUptime: '99.9%'
  };

  const quickActions = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      link: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: 'Report Management',
      description: 'Review and verify disaster reports',
      link: '/admin/reports',
      color: 'bg-green-500'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: 'Analytics Dashboard',
      description: 'View detailed analytics and insights',
      link: '/admin/analytics',
      color: 'bg-purple-500'
    },
    {
      icon: <Settings className="w-6 h-6 text-white" />,
      title: 'System Settings',
      description: 'Configure system parameters and settings',
      link: '/admin/settings',
      color: 'bg-gray-600'
    },
    {
      icon: <Database className="w-6 h-6 text-white" />,
      title: 'Database Management',
      description: 'Monitor and manage database operations',
      link: '/admin/database',
      color: 'bg-indigo-500'
    },
    {
      icon: <Bell className="w-6 h-6 text-white" />,
      title: 'Notifications',
      description: 'Manage system notifications and alerts',
      link: '/admin/notifications',
      color: 'bg-yellow-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New user registration',
      user: 'Sarah Johnson',
      time: '2 minutes ago',
      type: 'user',
      icon: <UserCheck className="w-4 h-4" />
    },
    {
      id: 2,
      action: 'Report verified',
      user: 'Admin',
      time: '15 minutes ago',
      type: 'report',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: 3,
      action: 'System backup completed',
      user: 'System',
      time: '1 hour ago',
      type: 'system',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 4,
      action: 'Critical alert resolved',
      user: 'Admin Team',
      time: '2 hours ago',
      type: 'alert',
      icon: <AlertTriangle className="w-4 h-4" />
    }
  ];

  const AdminDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white overflow-hidden relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm font-medium">System Online</span>
                  <span className="text-white/60 text-sm">{currentTime.toLocaleTimeString()}</span>
                </div>
                <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'Admin'}! ✨
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed mb-4">
                  Here's what's happening with your disaster response platform today.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <span className="text-sm font-medium">All systems operational</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Users className="w-4 h-4 text-blue-300" />
                    <span className="text-sm font-medium">{stats.activeUsers} active users</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl">
                    <Activity className="w-16 h-16 text-white animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl opacity-50"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span>Platform Analytics</span>
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="transform transition-all duration-500 hover:scale-105" style={{animationDelay: '0ms'}}>
              <AdminStatCard
                icon={<Users className="w-6 h-6" />}
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                change="+12% from last month"
                changeType="increase"
                bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
                iconBg="bg-blue-400"
                onClick={() => window.location.href = '/admin/users'}
              />
            </div>
            <div className="transform transition-all duration-500 hover:scale-105" style={{animationDelay: '100ms'}}>
              <AdminStatCard
                icon={<FileText className="w-6 h-6" />}
                title="Total Reports"
                value={stats.totalReports.toLocaleString()}
                change="+8% from last week"
                changeType="increase"
                bgGradient="bg-gradient-to-br from-green-500 to-emerald-600"
                iconBg="bg-green-400"
                onClick={() => window.location.href = '/admin/reports'}
              />
            </div>
            <div className="transform transition-all duration-500 hover:scale-105" style={{animationDelay: '200ms'}}>
              <AdminStatCard
                icon={<Clock className="w-6 h-6" />}
                title="Pending Verification"
                value={stats.pendingVerification}
                change="-5 since yesterday"
                changeType="decrease"
                bgGradient="bg-gradient-to-br from-yellow-500 to-orange-500"
                iconBg="bg-yellow-400"
                onClick={() => window.location.href = '/verify-reports'}
              />
            </div>
            <div className="transform transition-all duration-500 hover:scale-105" style={{animationDelay: '300ms'}}>
              <AdminStatCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="System Health"
                value={`${stats.systemHealth}%`}
                change="Excellent performance"
                changeType="increase"
                bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
                iconBg="bg-purple-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-3xl opacity-60"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Zap className="w-6 h-6 text-indigo-600" />
                <span>Quick Actions</span>
              </h3>
              <p className="text-gray-600 mt-1">Streamline your workflow with these powerful tools</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              <span>Pro Tools</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div key={index} className="transform transition-all duration-700 hover:scale-105" style={{animationDelay: `${index * 150}ms`}}>
                <QuickActionCard {...action} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Recent Activity</span>
              </h3>
              <Link 
                to="/admin/activity" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-all"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-blue-200 group/item">
                  <div className={`p-2 rounded-lg group-hover/item:scale-110 transition-transform ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'report' ? 'bg-green-100 text-green-600' :
                    activity.type === 'system' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover/item:text-blue-900 transition-colors">{activity.action}</p>
                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <span>by {activity.user}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>System Status</span>
              </h3>
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">All Systems Operational</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all group/status">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                  <Globe className="w-5 h-5 text-green-600 group-hover/status:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-900">Server Uptime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-bold">{stats.serverUptime}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-md transition-all group/status">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                  <Activity className="w-5 h-5 text-blue-600 group-hover/status:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-900">Active Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-bold">{stats.activeUsers}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 hover:shadow-md transition-all group/status">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse"></div>
                  <CheckCircle className="w-5 h-5 text-purple-600 group-hover/status:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-900">Verified Reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700 font-bold">{stats.verifiedReports}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 hover:shadow-md transition-all group/status">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                  <AlertTriangle className="w-5 h-5 text-red-600 group-hover/status:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-900">Blacklisted Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 font-bold">{stats.blacklistedUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">DisasterResponse</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main</h3>
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${item.active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                  </div>
                  <span>{item.title}</span>
                </div>
                {item.active && (
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                )}
              </Link>
            ))}
          </div>

          {/* System Section */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">System</h3>
            {navItems.slice(3).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  item.active
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${item.active ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                  </div>
                  <span>{item.title}</span>
                </div>
                {item.active && (
                  <ChevronRight className="w-4 h-4 text-purple-600" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {navItems.find(item => item.active)?.title || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">Manage your disaster response platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
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
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/reports" element={<ReportManagement />} />

              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<SystemSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;