import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck, Menu, X, ChevronDown, User, LogOut, Settings, Shield,
  Heart, Globe, Users, Target, Award, HandHeart, Phone,
  AlertTriangle, Info, HelpCircle, MapPin, Zap, BookOpen, FileText,
  Languages, DollarSign, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useRoles } from '../../hooks/useRoles';
import Avatar from '../Common/Avatar';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

interface NavItem {
  name: string;
  path: string;
  dropdown?: DropdownItem[];
}

interface DropdownItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin, isCj, hasAdminOrCjRole, isOnlyUser, formatRoleName } = useRoles();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { name: t('navigation.home'), path: '/' },
      { name: t('navigation.about'), path: '/about' }
    ];

    // Add "Volunteer" only if user is not CJ role
    if (!isCj()) {
      baseItems.push({ name: 'Volunteer', path: '/volunteer/opportunities' });
    }

    // Add "Contact" only if user is not CJ role
    if (!isCj()) {
      baseItems.push({ name: t('navigation.contact'), path: '/contact' });
    }

    // Add "Report" (create new report) only for authenticated users who are NOT regular users
    if (isAuthenticated && !isOnlyUser()) {
      baseItems.splice(2, 0, { name: 'Report', path: '/report/new' });
    }

    // Add "View Reports" for all authenticated users (including regular users)
    if (isAuthenticated) {
      baseItems.splice(isOnlyUser() ? 2 : 3, 0, { name: t('navigation.reports'), path: '/reports' });
    }

    // Add role-based navigation items for authenticated users
    if (isAuthenticated) {
      const authItems = [];

      // Add Dashboard for non-admin users
      if (!isOnlyUser() && !isAdmin()) {
        authItems.push({ name: t('navigation.dashboard'), path: '/dashboard' });
      }

      // Add Admin-only items
      if (isAdmin()) {
        authItems.push({ name: 'Admin Panel', path: '/admin' });
      }

      return [...baseItems, ...authItems];
    }

    return baseItems;
  };

  const isActivePage = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsUserDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 glass-navbar navbar-shadow-lg border-b border-white/20"
        role="banner"
        aria-label="Main navigation"
      >
        {/* Main Navigation */}
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
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">{t('header.brand.name')}</h1>
              <p className="text-xs text-gray-600 font-medium -mt-0.5 tracking-wide">{t('header.brand.subtitle')}</p>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-2"
            ref={dropdownRef}
            role="navigation"
            aria-label="Primary navigation"
          >
            {getNavItems().map((item) => (
              <div key={item.path} className="relative">
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                      onKeyDown={(e) => handleKeyDown(e, () => setActiveDropdown(activeDropdown === item.name ? null : item.name))}
                      className={`nav-item space-x-2 ${
                        isActivePage(item.path) ? 'active' : ''
                      }`}
                      aria-expanded={activeDropdown === item.name}
                      aria-haspopup="true"
                      aria-label={`${item.name} menu`}
                      tabIndex={0}
                    >
                      <span className="font-semibold">{item.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === item.name && (
                      <div
                        className="dropdown-menu"
                        role="menu"
                        aria-label={`${item.name} submenu`}
                      >
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.path}
                            to={dropdownItem.path}
                            onClick={() => setActiveDropdown(null)}
                            className="dropdown-item space-x-3 group"
                            role="menuitem"
                            aria-label={dropdownItem.description || dropdownItem.name}
                          >
                            <div className="text-blue-600 mt-0.5 group-hover:scale-110 transition-transform duration-300 relative z-10">
                              {dropdownItem.icon}
                            </div>
                            <div className="relative z-10">
                              <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                {dropdownItem.name}
                              </div>
                              {dropdownItem.description && (
                                <div className="text-xs text-gray-600 mt-1 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                  {dropdownItem.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-item font-semibold ${
                      isActivePage(item.path) ? 'active' : ''
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
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
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
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
                      {user?.roles?.filter(role => role).map(role => formatRoleName(role)).join(', ') || 'User'}
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 text-gray-400 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 glass-dropdown rounded-2xl py-2 z-50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                      <div className="text-sm font-bold text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-600 font-medium">{user?.email}</div>
                    </div>

                    {!isOnlyUser() && !isAdmin() && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="dropdown-item space-x-3 mx-2 my-1"
                      >
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">Dashboard</span>
                      </Link>
                    )}

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
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden glass-button p-3 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-300"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden glass-navbar border-t border-white/20 shadow-xl"
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <div className="px-6 py-6 space-y-4">
            {getNavItems().map((item) => (
              <div key={item.path}>
                {item.dropdown ? (
                  <div className="space-y-3">
                    <div className="text-gray-900 font-bold text-lg px-4 py-2 border-l-4 border-blue-500 bg-blue-50/50 rounded-r-lg">
                      {item.name}
                    </div>
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.path}
                        to={dropdownItem.path}
                        className="dropdown-item space-x-3 mx-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="text-blue-600">
                          {dropdownItem.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{dropdownItem.name}</div>
                          {dropdownItem.description && (
                            <div className="text-xs text-gray-500 mt-1">{dropdownItem.description}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-item w-full justify-start text-base ${
                      isActivePage(item.path) ? 'active' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

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
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors py-2 w-full text-left"
                  >
                    <LogOut size={20} />
                    <span className="text-lg font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/donate"
                    className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white px-8 py-4 rounded-2xl hover:from-red-700 hover:via-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart size={20} className="animate-pulse" />
                    <span>{t('header.topBar.donateNow')}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;
