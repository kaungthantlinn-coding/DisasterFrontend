import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Globe,
  Heart
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRoles } from '../../hooks/useRoles';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin, isCj, isOnlyUser } = useRoles();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageDropdownOpen(false);
  };

  // Build navigation based on user role
  const getNavigation = () => {
    const nav = [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
    ];

    if (isAuthenticated) {
      // CJ and Admin can see Report (create new report)
      if (isCj() || isAdmin()) {
        nav.push({ name: 'Report', href: '/report/new' });
      }
      
      // All authenticated users can see Reports list
      nav.push({ name: 'Reports', href: '/reports' });
      nav.push({ name: 'Dashboard', href: '/dashboard' });
      
      // Only regular users see Support Request
      if (isOnlyUser()) {
        nav.push({ name: 'Support Request', href: '/support-request' });
      }
    } else {
      // Non-authenticated users
      nav.push({ name: 'Report', href: '/login' }); // Redirect to login
      nav.push({ name: 'Reports', href: '/login' }); // Redirect to login
    }

    return nav;
  };

  const navigation = getNavigation();

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">GDRC</span>
                <p className="text-xs text-gray-500 -mt-1">Global Disaster Response Center</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActiveLink(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">English</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      i18n.language === 'en' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('my')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      i18n.language === 'my' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    မြန်မာ
                  </button>
                </div>
              )}
            </div>

            {/* Donate Button */}
            <Link
              to="/donate"
              className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
            >
              <Heart className="w-4 h-4" />
              <span>Donate</span>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {user?.name?.split(' ')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role || 'Member'}</p>
                    </div>
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || user?.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        isAdmin() ? 'bg-purple-100 text-purple-700' :
                        isCj() ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user?.role || 'User'}
                      </span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block py-2 px-3 text-sm font-medium rounded-md ${
                  isActiveLink(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-4 pt-4">
              <Link
                to="/donate"
                className="block py-2 px-3 text-sm font-medium text-red-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Donate
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 text-sm font-medium text-gray-700"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 px-3 text-sm font-medium text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
