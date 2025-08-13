import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Settings,
  Home,
  FileText,
  BarChart,
  HelpCircle,
  Heart,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useRoles } from '../../hooks/useRoles';
import Avatar from '../Common/Avatar';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin, isCj, isOnlyUser, formatRoleName } = useRoles();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  // Dynamic navigation based on user role
  const navigation = useMemo(() => {
    const baseNav = [
      { name: t('navigation.home'), href: '/', icon: Home },
      { name: t('navigation.about'), href: '/about', icon: FileText },
      { name: t('navigation.reports'), href: '/reports', icon: FileText },
    ];

    // Role-based navigation items
    if (isCj()) {
      // CJ users see "Report Impact" instead of "Support Request"
      baseNav.push({ name: 'Report Impact', href: '/report/new', icon: AlertTriangle });
    } else {
      // Regular users and non-authenticated users see "Support Request"
      baseNav.push({ name: 'Support Request', href: '/support-request', icon: HelpCircle });
    }

    baseNav.push({ name: t('navigation.contact'), href: '/contact', icon: FileText });
    
    return baseNav;
  }, [isCj, t]);

  const userNavigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: BarChart },
    { name: t('navigation.reports'), href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActivePage = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-navbar navbar-shadow-lg border-b border-white/20" role="banner" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="logo-container text-white">
                <ShieldCheck size={26} className="drop-shadow-sm" />
              </div>
              <div className="logo-status-indicator"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">{t('header.brand.name') || 'GDRC'}</h1>
              <p className="text-xs text-gray-600 font-medium -mt-0.5 tracking-wide">{t('header.brand.subtitle') || 'Global Disaster Response Center'}</p>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center space-x-2" role="navigation" aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item font-semibold ${
                  isActivePage(item.href) ? 'active' : ''
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
            
            {/* Donation Button */}
            <Link
              to="/donate"
              className="donate-button space-x-2 group"
            >
              <Heart size={16} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">{t('navigation.donate')}</span>
            </Link>

            {isAuthenticated ? (
              /* User Profile Dropdown */
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="glass-button flex items-center space-x-3 px-4 py-2.5 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-300 shadow-sm"
                >
                  <Avatar
                    src={user?.photoUrl}
                    alt={user?.name}
                    name={user?.name}
                    size="sm"
                  />
                  <div className="text-left hidden xl:block">
                    <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500 font-medium">
                      {user?.roles?.filter((role: string) => role).map((role: string) => formatRoleName(role)).join(', ') || 'User'}
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 text-gray-400 ${
                      isProfileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 glass-dropdown rounded-2xl py-2 z-50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                      <div className="text-sm font-bold text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-600 font-medium">{user?.email}</div>
                    </div>

                    {!isOnlyUser() && !isAdmin() && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="dropdown-item space-x-3 mx-2 my-1"
                      >
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="dropdown-item space-x-3 mx-2 my-1"
                    >
                      <Settings size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700 font-medium">Settings</span>
                    </Link>

                    <div className="mx-2 my-2 border-t border-gray-200/50"></div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item space-x-3 mx-2 my-1 w-full"
                    >
                      <LogOut size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700 font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button */
              <Link
                to="/login"
                className="glass-button flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold text-sm shadow-sm"
              >
                <User size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden glass-button p-2 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-300"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass-navbar border-t border-white/20 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item w-full justify-start text-base ${
                      isActivePage(item.href) ? 'active' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Language Switcher */}
              <div className="pt-6 border-t border-white/20 pb-6">
                <LanguageSwitcher />
              </div>

              {/* Mobile Auth Section */}
              <div className="pt-6 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar
                        src={user?.photoUrl}
                        alt={user?.name}
                        name={user?.name}
                        size="lg"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-bold shadow-lg"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/donate"
                      className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white px-8 py-4 rounded-2xl hover:from-red-700 hover:via-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart size={20} className="animate-pulse" />
                      <span>{t('navigation.donate')}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
