import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Building2,
  MessageSquare,
  History,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Zap,
  Shield,
  Activity,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NotificationAPI } from '../../services/Notification';
import type { NotificationDTO } from '../../types/Notification';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  path, 
  badge, 
  isActive = false,
  onClick 
}) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      <div className={`flex-shrink-0 w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </div>
      <span className="ml-3 truncate">{label}</span>
      {badge && (
        <span className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
          isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-blue-100 text-blue-600'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
};

const ModernAdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      path: '/admin',
      badge: undefined
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Users',
      path: '/admin/users',
      badge: undefined
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Donations',
      path: '/admin/donations',
      badge: undefined
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      label: 'Donation Verification',
      path: '/admin/donation-verification',
      badge: undefined
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Reports',
      path: '/admin/reports',
      badge: undefined
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Support',
      path: '/admin/support-requests',
      badge: undefined
    },
    {
      icon: <History className="w-5 h-5" />,
      label: 'Audit Logs',
      path: '/admin/audit-logs',
      badge: undefined
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      path: '/admin/settings',
      badge: undefined
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const {
    data: adminNotifications = [],
    isLoading: notifLoading,
    refetch: refetchNotifications
  } = useQuery<NotificationDTO[]>({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      try {
        return await NotificationAPI.getAdminNotifications();
      } catch (e) {
        console.warn('Admin notifications failed, falling back to user notifications:', e);
        try {
          return await NotificationAPI.getUserNotifications();
        } catch (e2) {
          console.error('Both admin and user notifications failed:', e2);
          return [];
        }
      }
    },
    refetchInterval: 15000,
    initialData: [],
  });

  const unreadCount = useMemo(
    () => adminNotifications.filter(n => !n.isRead).length,
    [adminNotifications]
  );

  useEffect(() => {
    if (showNotifications) {
      refetchNotifications();
    }
  }, [showNotifications, refetchNotifications]);

  return (
    <div className={`min-h-screen bg-slate-50 ${darkMode ? 'dark' : ''}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              badge={item.badge}
              isActive={location.pathname === item.path}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search bar */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  onClick={() => setShowNotifications(s => !s)}
                  aria-label="Notifications"
                  title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center border-2 border-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  ) : (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                    <div className="p-3 flex items-center justify-between border-b">
                      <span className="text-sm font-semibold text-slate-900">Notifications</span>
                      <button
                        className="text-xs text-blue-600 hover:text-blue-700"
                        onClick={async () => {
                          try {
                            await NotificationAPI.markAllAsRead();
                            await refetchNotifications();
                          } catch (e) {
                            console.warn('Failed to mark all as read:', e);
                          }
                        }}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-auto">
                      {notifLoading ? (
                        <div className="p-4 text-sm text-slate-500">Loading...</div>
                      ) : adminNotifications && adminNotifications.length > 0 ? (
                        adminNotifications.map((n) => (
                          <div
                            key={n.id}
                            className="p-3 hover:bg-slate-50 flex cursor-pointer"
                            onClick={async () => {
                              try {
                                await NotificationAPI.markAsRead(n.id);
                                await refetchNotifications();
                              } catch (e) {}
                              setShowNotifications(false);
                                              if (n.disasterReportId) {
                                navigate(`/admin/reports/review/${n.disasterReportId}`);
                              } else {
                                navigate('/admin/reports');
                              }
                            }}
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${n.isRead ? 'bg-slate-300' : 'bg-red-500'}`} />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900">{n.title || 'Notification'}</div>
                              <div className="text-xs text-slate-600 mt-0.5">{n.message}</div>
                              <div className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-slate-500">No notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ModernAdminLayout;
