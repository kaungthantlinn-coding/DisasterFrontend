import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Menu, ChevronDown, User, LogOut, Settings,
  Heart, MessageCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRoles } from '../../hooks/useRoles';
import { getUnreadChatCount, clearUnreadChatCount } from '../Chat/ChatWidget';
import Avatar from '../Common/Avatar';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import SettingsModal from '../Settings/SettingsModal';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin, isCj } = useRoles();
  const navigate = useNavigate();
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
      setIsUserDropdownOpen(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setActiveDropdown(null);
      setIsUserDropdownOpen(false);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Poll for unread chat messages for CJ users
  useEffect(() => {
    if (!isAuthenticated || !isCj()) return;

    const updateUnreadCount = () => {
      const count = getUnreadChatCount();
      setUnreadChatCount(count);
    };

    updateUnreadCount();
    const interval = setInterval(updateUnreadCount, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, isCj]);

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' }
    ];

    // Add "Contact" only if user is not CJ role
    if (!isCj()) {
      baseItems.push({ name: 'Contact', path: '/contact' });
    }

    // Add "Report" (create new report) for CJ and Admin users
    if (isAuthenticated && (isCj() || isAdmin())) {
      baseItems.push({ name: 'Report', path: '/report/new' });
    }

    // Add "View Reports" for all authenticated users (including regular users)
    if (isAuthenticated) {
      baseItems.push({ name: 'Reports', path: '/reports' });
    }

    // Add admin panel for admins
    if (isAdmin()) {
      baseItems.push({ name: 'Admin', path: '/admin' });
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
    navigate('/');
  };

  const handleChatIconClick = () => {
    clearUnreadChatCount();
    setUnreadChatCount(0);
  };

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b-2 border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <ShieldCheck 
                    size={40} 
                    className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300" 
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    GDRC
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">
                    Global Disaster Response Center
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {getNavItems().map((item) => (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                        onKeyDown={(e) => handleKeyDown(e, () => setActiveDropdown(activeDropdown === item.name ? null : item.name))}
                        className={`nav-item group ${isActivePage(item.path) ? 'active' : ''}`}
                        aria-expanded={activeDropdown === item.name}
                        aria-haspopup="true"
                      >
                        {item.name}
                        <ChevronDown 
                          size={16} 
                          className={`ml-1 transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      {activeDropdown === item.name && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.path}
                              className="flex items-start space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {dropdownItem.icon && (
                                <div className="flex-shrink-0 mt-0.5">
                                  {dropdownItem.icon}
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{dropdownItem.name}</div>
                                {dropdownItem.description && (
                                  <div className="text-sm text-gray-500 mt-1">
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
                      className={`nav-item ${isActivePage(item.path) ? 'active' : ''}`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Donate Button */}
              <Link
                to="/donate"
                className="donate-button space-x-2 group"
              >
                <Heart size={16} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Donate</span>
              </Link>

              {/* CJ Chat Button - Only show for CJ users */}
              {isAuthenticated && isCj() && (
                <Link
                  to="/cj-chat-list"
                  onClick={handleChatIconClick}
                  className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                  title="CJ Chat"
                >
                  <MessageCircle size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  {unreadChatCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 border-2 border-white animate-pulse">
                      {unreadChatCount > 99 ? '99+' : unreadChatCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                /* User Profile Dropdown */
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    onKeyDown={(e) => handleKeyDown(e, () => setIsUserDropdownOpen(!isUserDropdownOpen))}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isUserDropdownOpen}
                    aria-haspopup="true"
                  >
                    <Avatar
                      src={user?.photoUrl}
                      alt={user?.name}
                      name={user?.name}
                      size="sm"
                    />
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-400 transition-transform duration-200 ${
                        isUserDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            src={user?.photoUrl}
                            alt={user?.name}
                            name={user?.name}
                            size="md"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{user?.name}</div>
                            <div className="text-sm text-gray-500">{user?.email}</div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsSettingsOpen(true);
                          setIsUserDropdownOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Login Button */
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <User size={18} />
                    <span>Login</span>
                  </Link>
                  {isCj() && (
                    <Link
                      to="/cj-chat"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      title="CJ Chat"
                    >
                      <MessageCircle size={20} />
                      <span className="hidden sm:inline">Chat</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                <Menu size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-6 space-y-4">
              {getNavItems().map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div className="space-y-2">
                      <div className="font-medium text-gray-900 px-3 py-2">{item.name}</div>
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.path}
                          className="flex items-center space-x-3 px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropdownItem.icon}
                          <span>{dropdownItem.name}</span>
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
              <div className="pt-6 border-t border-gray-200 pb-6">
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

                    {isCj() && (
                      <Link
                        to="/cj-chat"
                        className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-left"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <MessageCircle size={20} />
                        <span className="text-lg font-medium">CJ Chat</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-left"
                    >
                      <Settings size={20} />
                      <span className="text-lg font-medium">Settings</span>
                    </button>

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
                      className="flex items-center justify-center space-x-3 w-full bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/donate"
                      className="flex items-center justify-center space-x-3 w-full bg-red-600 text-white px-8 py-4 rounded-2xl hover:bg-red-700 transition-colors duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart size={20} className="animate-pulse" />
                      <span>Donate Now</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Header;