import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, ChevronDown, User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRoles } from '../../hooks/useRoles';
import Avatar from '../Common/Avatar';

interface NavItem {
  name: string;
  path: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin, isCj, hasAdminOrCjRole, isOnlyUser, formatRoleName } = useRoles();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsReportDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const disasterMenuItems = [
    {
      name: 'Lists',
      path: '/disasters/lists'
    },
    {
      name: 'Statistic',
      path: '/disasters/statistics'
    },
    {
      name: 'Response',
      path: '/disasters/response'
    }
  ];

  const getNavItems = (): NavItem[] => {
    // Base navigation items for all users
    const baseItems = [
      { name: 'Home', path: '/' },
      { name: 'View Reports', path: '/reports' },
      ...(!isOnlyUser() ? [{ name: 'Report Impact', path: '/report/new' }] : []),
    ];

    // Add role-based navigation items
    if (isAuthenticated) {
      const authItems = [
        ...(!isOnlyUser() ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
      ];

      // Add CJ and Admin specific items
      if (hasAdminOrCjRole()) {
        authItems.push(
          { name: 'Verify Reports', path: '/verify-reports' },
          { name: 'Analytics', path: '/analytics' }
        );
      }

      // Add Admin-only items
      if (isAdmin()) {
        authItems.push(
          { name: 'Admin Panel', path: '/admin' }
        );
      }

      return [...baseItems, ...authItems];
    }

    return baseItems;
  };

  const isActivePage = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    // Redirect will be handled by the auth system
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DisasterWatch</h1>
              <p className="text-xs text-gray-500 -mt-1">Community Reporting</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-gray-600 hover:text-blue-600 font-medium transition-colors ${
                  isActivePage(item.path) ? 'text-blue-600' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Disaster Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsReportDropdownOpen(!isReportDropdownOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                <span>Disaster</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isReportDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isReportDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {disasterMenuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsReportDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              /* User Profile Dropdown */
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar
                      src={user?.photoUrl}
                      alt={user?.name}
                      name={user?.name}
                      size="md"
                    />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">
                        {user?.roles?.filter(role => role).map(role => formatRoleName(role)).join(', ') || 'User'}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user?.roles?.filter(role => role).map(role => (
                          <span
                            key={role}
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              role === 'admin' ? 'bg-red-100 text-red-800' :
                              role === 'cj' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}
                          >
                            {formatRoleName(role)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {!isOnlyUser() && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={16} className="mr-3 text-gray-400" />
                        Dashboard
                      </Link>
                    )}
                    
                    {isAdmin() && (
                      <Link
                        to="/admin/roles"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Shield size={16} className="mr-3 text-gray-400" />
                        Role Management
                      </Link>
                    )}
                    
                    {hasAdminOrCjRole() && (
                      <Link
                        to="/admin/settings"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={16} className="mr-3 text-gray-400" />
                        Settings
                      </Link>
                    )}
                    
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3 text-gray-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button */
              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block text-lg font-medium transition-colors ${
                  isActivePage(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Disaster Section */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Disaster</h3>
              <div className="space-y-2">
                {disasterMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <Link
                to="/report/new"
                className="block w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-semibold text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Report Emergency
              </Link>
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                /* Mobile User Profile */
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

                  {!isOnlyUser() && (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors py-2"
                    >
                      <User size={20} />
                      <span className="text-lg font-medium">Dashboard</span>
                    </Link>
                  )}

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
                /* Mobile Login Button */
                <Link
                  to="/login"
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
