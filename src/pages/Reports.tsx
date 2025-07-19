import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Search,
  MapPin,
  Calendar,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  ImageIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  Grid3X3,
  List,
  Map,
  Shield,
  Activity,
  Flame,
  Waves,
  Mountain,
  Wind,
  Truck,
  RefreshCw,
  BarChart3,
  Sparkles,
  Heart
} from 'lucide-react';

// Components
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ReportMap from '../components/Map/ReportMap';

// Hooks
import { useRoles } from '../hooks/useRoles';

// Data
import { mockReports } from '../data/mockData';

// Types
import { Report } from '../types';

const Reports: React.FC = () => {
  // Navigation
  const navigate = useNavigate();

  // Auth and roles
  const { isAdmin, isCj, isOnlyUser } = useRoles();

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisasterType, setSelectedDisasterType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showOnlyWithImages, setShowOnlyWithImages] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Role-based permissions
  const canViewSensitiveInfo = isAdmin() || isCj();
  const isRegularUser = isOnlyUser();

  // Image loading states
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});
  const [imageErrorStates, setImageErrorStates] = useState<{[key: string]: boolean}>({});

  // Filter options
  const disasterTypes = ['all', 'flood', 'fire', 'earthquake', 'storm', 'landslide', 'accident', 'other'];
  const severityLevels = ['all', 'low', 'medium', 'high', 'critical'];
  // Status options based on user role
  const statusOptions = isRegularUser
    ? ['all', 'verified'] // Regular users only see verified reports
    : ['all', 'pending', 'verified', 'resolved']; // Admin/CJ see all statuses
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'severity', label: 'Severity' },
    { value: 'location', label: 'Location' }
  ];

  // Filter and sort reports based on user role
  const filteredAndSortedReports = useMemo(() => {
    let filtered = mockReports.filter(report => {
      // Role-based filtering: Regular users only see verified reports
      if (isRegularUser && report.status !== 'verified') {
        return false;
      }

      // Search filter
      if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !report.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !report.location.address.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Disaster type filter
      if (selectedDisasterType !== 'all' && report.disasterType !== selectedDisasterType) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'all' && report.severity !== selectedSeverity) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && report.status !== selectedStatus) {
        return false;
      }

      // Images filter
      if (showOnlyWithImages && (!report.photos || report.photos.length === 0)) {
        return false;
      }

      return true;
    });

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'severity':
          const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return (severityOrder[b.severity as keyof typeof severityOrder] || 0) -
                 (severityOrder[a.severity as keyof typeof severityOrder] || 0);
        case 'location':
          return a.location.address.localeCompare(b.location.address);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockReports, searchTerm, selectedDisasterType, selectedSeverity, selectedStatus, showOnlyWithImages, sortBy, isRegularUser]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredAndSortedReports.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDisasterType, selectedSeverity, selectedStatus, showOnlyWithImages, sortBy]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDisasterType('all');
    setSelectedSeverity('all');
    setSelectedStatus('all');
    setShowOnlyWithImages(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Get disaster type icon component
  const getDisasterIcon = (type: string) => {
    const iconProps = { size: 16, className: "text-white" };
    switch (type) {
      case 'flood': return <Waves {...iconProps} />;
      case 'fire': return <Flame {...iconProps} />;
      case 'earthquake': return <Mountain {...iconProps} />;
      case 'storm': return <Wind {...iconProps} />;
      case 'landslide': return <Mountain {...iconProps} />;
      case 'accident': return <Truck {...iconProps} />;
      default: return <AlertTriangle {...iconProps} />;
    }
  };

  // Get disaster type color
  const getDisasterColor = (type: string) => {
    switch (type) {
      case 'flood': return 'from-blue-500 to-blue-600';
      case 'fire': return 'from-red-500 to-orange-500';
      case 'earthquake': return 'from-yellow-600 to-orange-600';
      case 'storm': return 'from-gray-500 to-gray-600';
      case 'landslide': return 'from-amber-600 to-yellow-600';
      case 'accident': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Get disaster type display name
  const getDisasterTypeName = (type: string) => {
    switch (type) {
      case 'flood': return 'Flood';
      case 'fire': return 'Fire';
      case 'earthquake': return 'Earthquake';
      case 'storm': return 'Storm';
      case 'landslide': return 'Landslide';
      case 'accident': return 'Accident';
      default: return 'Other';
    }
  };

  // Get severity color classes
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Enhanced default image handling with optimized quality and aspect ratios
  const getDefaultImage = (type: string) => {
    const defaultImages = {
      flood: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      fire: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      earthquake: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      storm: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      landslide: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      accident: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      other: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
    };
    return defaultImages[type as keyof typeof defaultImages] || defaultImages.other;
  };

  const handleImageLoad = (reportId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [reportId]: false }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, disasterType: string, reportId: string) => {
    const target = e.target as HTMLImageElement;
    target.src = getDefaultImage(disasterType);
    setImageErrorStates(prev => ({ ...prev, [reportId]: true }));
    setImageLoadingStates(prev => ({ ...prev, [reportId]: false }));
  };

  const handleImageLoadStart = (reportId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [reportId]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Professional Page Header */}
        <div className="text-center mb-16">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors duration-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <Activity size={16} className="mr-2" />
              Live Reports
            </div>
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
              title="Refresh Reports"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold">
              <Sparkles size={16} className="mr-2" />
              Enhanced UI
            </div>
          </div>

          {/* Main Title */}
          <div className="relative mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {isRegularUser ? 'Community' : 'Emergency'}
              <br />
              <span className="text-blue-600">
                {isRegularUser ? 'Safety Updates' : 'Reports Hub'}
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            {isRegularUser
              ? 'Stay informed about verified disaster reports and safety updates in your community. Access reliable information to keep yourself and your family safe.'
              : 'Real-time disaster reports from communities worldwide. Browse verified incidents, track emergency responses, and stay informed about ongoing situations in your area.'
            }
          </p>

          {/* Statistics Cards - Matching Design */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {/* Total Reports Card */}
            <div className="group relative bg-blue-50/80 rounded-2xl p-6 border border-blue-100/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">
                  {filteredAndSortedReports.length}
                </div>
                <div className="text-gray-900 font-bold text-base mb-1">Total Reports</div>
                <div className="text-sm text-blue-600 font-medium">Currently displayed</div>
              </div>
            </div>

            {/* Verified Reports Card */}
            <div className="group relative bg-blue-50/80 rounded-2xl p-6 border border-blue-100/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">
                  {filteredAndSortedReports.filter(r => r.status === 'verified').length}
                </div>
                <div className="text-gray-900 font-bold text-base mb-1">Verified Reports</div>
                <div className="text-sm text-blue-600 font-medium">
                  {filteredAndSortedReports.length > 0 ? Math.round((filteredAndSortedReports.filter(r => r.status === 'verified').length / filteredAndSortedReports.length) * 100) : 0}% of total
                </div>
              </div>
            </div>

            {/* High Priority Card */}
            <div className="group relative bg-blue-50/80 rounded-2xl p-6 border border-blue-100/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">
                  {filteredAndSortedReports.filter(r => r.severity === 'critical' || r.severity === 'high').length}
                </div>
                <div className="text-gray-900 font-bold text-base mb-1">High Priority</div>
                <div className="text-sm text-blue-600 font-medium">Critical & High severity</div>
              </div>
            </div>

            {/* Active Response Card */}
            <div className="group relative bg-blue-50/80 rounded-2xl p-6 border border-blue-100/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">
                  {filteredAndSortedReports.filter(r => r.assistanceLog && r.assistanceLog.length > 0).length}
                </div>
                <div className="text-gray-900 font-bold text-base mb-1">Active Response</div>
                <div className="text-sm text-blue-600 font-medium">Reports with assistance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Role-based Information Banner */}
        {isRegularUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                  Community Safety Information
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  You are viewing verified disaster reports and safety updates. All information has been reviewed by our emergency response team to ensure accuracy and reliability for community safety.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
          <div className="flex flex-col xl:flex-row gap-6 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search reports by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 size={18} className="mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={18} className="mr-2" />
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  viewMode === 'map'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map size={18} className="mr-2" />
                Map
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                showFilters
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal size={18} className="mr-2" />
              Filters
            </button>
          </div>

          {/* Enhanced Filter Controls */}
          {showFilters && (
              <div className="border-t border-gray-200/60 pt-8 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Disaster Type Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Disaster Type</label>
                    <select
                      value={selectedDisasterType}
                      onChange={(e) => setSelectedDisasterType(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 text-gray-700 font-medium shadow-sm"
                    >
                      {disasterTypes.map(type => (
                        <option key={type} value={type}>
                          {type === 'all' ? 'All Types' : getDisasterTypeName(type)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Severity Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Severity Level</label>
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 text-gray-700 font-medium shadow-sm"
                    >
                      {severityLevels.map(level => (
                        <option key={level} value={level}>
                          {level === 'all' ? 'All Severities' : level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Report Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 text-gray-700 font-medium shadow-sm"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Sort Order</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 text-gray-700 font-medium shadow-sm"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Enhanced Additional Options */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-gray-200/60">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="group flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={showOnlyWithImages}
                          onChange={(e) => setShowOnlyWithImages(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                          showOnlyWithImages
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                          {showOnlyWithImages && (
                            <CheckCircle size={12} className="text-white absolute inset-0.5" />
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                        Show only reports with images
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Enhanced Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40">
          <div className="mb-4 sm:mb-0">
            <p className="text-gray-700 font-medium">
              Showing <span className="font-bold text-blue-600">{startIndex + 1}</span>-<span className="font-bold text-blue-600">{Math.min(startIndex + itemsPerPage, filteredAndSortedReports.length)}</span> of <span className="font-bold text-blue-600">{filteredAndSortedReports.length}</span> reports
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {filteredAndSortedReports.length === mockReports.length ? 'All reports displayed' : 'Filtered results'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-600">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Refined Reports Display - Brand Consistent */}
        {paginatedReports.length > 0 ? (
          viewMode === 'map' ? (
            /* Professional Map View */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden mb-20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Reports Map View</h3>
                  <div className="text-sm text-gray-600">
                    Showing {filteredAndSortedReports.length} reports on map
                  </div>
                </div>
                <ReportMap
                  reports={filteredAndSortedReports}
                  selectedReport={selectedReport}
                  onReportSelect={(report) => {
                    setSelectedReport(report);
                    // Navigate to report detail when a report is selected on the map
                    navigate(`/reports/${report.id}`);
                  }}
                  height="600px"
                />
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* Enhanced Professional Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-20">
              {paginatedReports.map((report, index) => (
                <article
                  key={report.id}
                  className="group relative bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Professional Image Section with Aspect Ratio */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Loading skeleton */}
                    {imageLoadingStates[report.id] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer"></div>
                      </div>
                    )}

                    <img
                      src={report.photos && report.photos.length > 0 ? report.photos[0] : getDefaultImage(report.disasterType)}
                      alt={report.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onLoadStart={() => handleImageLoadStart(report.id)}
                      onLoad={() => handleImageLoad(report.id)}
                      onError={(e) => handleImageError(e, report.disasterType, report.id)}
                    />

                    {/* Subtle overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Image quality indicator */}
                    {imageErrorStates[report.id] && (
                      <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
                        Default Image
                      </div>
                    )}

                    {/* Professional Severity Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getSeverityColor(report.severity)}`}>
                        <div className={`w-2 h-2 rounded-full mr-1.5 ${
                          report.severity === 'critical' ? 'bg-red-400 animate-pulse' :
                          report.severity === 'high' ? 'bg-orange-400' :
                          report.severity === 'medium' ? 'bg-yellow-400' :
                          'bg-green-400'
                        }`}></div>
                        <span>{report.severity?.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Professional Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        report.status === 'verified' ? 'bg-green-100/90 text-green-800' :
                        report.status === 'pending' ? 'bg-yellow-100/90 text-yellow-800' :
                        report.status === 'resolved' ? 'bg-blue-100/90 text-blue-800' :
                        'bg-gray-100/90 text-gray-800'
                      }`}>
                        {report.status === 'verified' && <CheckCircle size={12} className="mr-1" />}
                        {report.status === 'pending' && <Clock size={12} className="mr-1" />}
                        <span>{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
                      </div>
                    </div>

                    {/* Multiple Images Indicator */}
                    {report.photos && report.photos.length > 1 && (
                      <div className="absolute bottom-3 right-3 z-10">
                        <div className="inline-flex items-center px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-md text-xs font-medium">
                          <ImageIcon size={12} className="mr-1" />
                          <span>{report.photos.length}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Professional Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Main Content - grows to fill available space */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                          {report.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {report.description}
                        </p>
                      </div>

                      {/* Professional Meta Information */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={14} className="text-blue-600 mr-2 flex-shrink-0" />
                          <span className="truncate">{report.location.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="text-indigo-600 mr-2 flex-shrink-0" />
                          <span>{format(report.createdAt, 'MMM d, yyyy')}</span>
                        </div>
                        {canViewSensitiveInfo && (
                          <div className="flex items-center text-sm text-gray-600">
                            <User size={14} className="text-blue-700 mr-2 flex-shrink-0" />
                            <span className="truncate">{report.reporterName}</span>
                          </div>
                        )}
                      </div>

                      {/* Professional Disaster Type Badge */}
                      <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${getDisasterColor(report.disasterType)} text-white`}>
                          {getDisasterIcon(report.disasterType)}
                          <span className="ml-1.5">{getDisasterTypeName(report.disasterType)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Professional Action Button - always at bottom */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link
                        to={`/reports/${report.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      >
                        View Details
                        <ArrowRight size={16} className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Professional List View */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden mb-20">
              <div className="divide-y divide-gray-100">
                {paginatedReports.map((report, index) => (
                  <article
                    key={report.id}
                    className="group hover:bg-gray-50/80 transition-all duration-200"
                    style={{
                      animationDelay: `${index * 30}ms`,
                      animation: 'fadeInUp 0.4s ease-out forwards'
                    }}
                  >
                    <div className="p-6 flex items-start space-x-6">
                      {/* Professional Thumbnail */}
                      <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        {/* Loading skeleton for thumbnails */}
                        {imageLoadingStates[report.id] && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer"></div>
                          </div>
                        )}

                        <img
                          src={report.photos && report.photos.length > 0 ? report.photos[0] : getDefaultImage(report.disasterType)}
                          alt={report.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onLoadStart={() => handleImageLoadStart(report.id)}
                          onLoad={() => handleImageLoad(report.id)}
                          onError={(e) => handleImageError(e, report.disasterType, report.id)}
                        />

                        {/* Multiple images indicator for thumbnails */}
                        {report.photos && report.photos.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs font-medium flex items-center">
                            <ImageIcon size={10} className="mr-1" />
                            {report.photos.length}
                          </div>
                        )}

                        {/* Image quality indicator for thumbnails */}
                        {imageErrorStates[report.id] && (
                          <div className="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs font-medium">
                            Default
                          </div>
                        )}
                      </div>

                      {/* Professional Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-6">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
                              {report.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                              {report.description}
                            </p>
                          </div>

                          {/* Professional Status and Severity Badges */}
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(report.severity)}`}>
                              {report.severity?.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              report.status === 'verified' ? 'bg-green-100 text-green-800' :
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              report.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report.status === 'verified' && <CheckCircle size={12} className="inline mr-1" />}
                              {report.status === 'pending' && <Clock size={12} className="inline mr-1" />}
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Professional Meta Information */}
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin size={14} className="mr-1.5 text-blue-600" />
                            <span className="truncate max-w-48">{report.location.address}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar size={14} className="mr-1.5 text-indigo-600" />
                            <span>{format(report.createdAt, 'MMM d, yyyy')}</span>
                          </div>
                          {canViewSensitiveInfo && (
                            <div className="flex items-center text-sm text-gray-600">
                              <User size={14} className="mr-1.5 text-blue-700" />
                              <span className="truncate">{report.reporterName}</span>
                            </div>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${getDisasterColor(report.disasterType)} text-white`}>
                            {getDisasterIcon(report.disasterType)}
                            <span className="ml-1.5">{getDisasterTypeName(report.disasterType)}</span>
                          </span>
                          {report.photos && report.photos.length > 1 && (
                            <div className="flex items-center text-sm text-gray-600">
                              <ImageIcon size={14} className="mr-1.5 text-blue-600" />
                              <span>{report.photos.length} photos</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Professional Action Button */}
                      <div className="flex-shrink-0 ml-auto">
                        <Link
                          to={`/reports/${report.id}`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          View Details
                          <ArrowRight size={16} className="ml-2" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )
        ) : (
          /* Refined Empty State */
          <div className="text-center py-32">
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-16">
                <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 rounded-full w-48 h-48 flex items-center justify-center mx-auto shadow-2xl">
                  <Search size={64} className="text-blue-600" />
                </div>
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-indigo-400/30 to-blue-500/30 rounded-full opacity-60 animate-pulse delay-1000"></div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-6">No Reports Found</h3>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                We couldn't find any reports matching your current search criteria. Try adjusting your filters or search terms.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <button
                  onClick={clearAllFilters}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative">Clear All Filters</span>
                </button>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 shadow-xl">
                <h4 className="text-xl font-bold text-gray-800 mb-6">Current Search Criteria:</h4>
                <div className="flex flex-wrap gap-4 justify-center">
                  <span className="px-5 py-3 bg-blue-100/80 text-blue-800 rounded-xl text-base font-bold">
                    Search: {searchTerm || 'All reports'}
                  </span>
                  {selectedDisasterType !== 'all' && (
                    <span className="px-5 py-3 bg-indigo-100/80 text-indigo-800 rounded-xl text-base font-bold">
                      Type: {getDisasterTypeName(selectedDisasterType)}
                    </span>
                  )}
                  {selectedSeverity !== 'all' && (
                    <span className="px-5 py-3 bg-blue-200/60 text-blue-800 rounded-xl text-base font-bold">
                      Severity: {selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)}
                    </span>
                  )}
                  {selectedStatus !== 'all' && (
                    <span className="px-5 py-3 bg-indigo-200/60 text-indigo-800 rounded-xl text-base font-bold">
                      Status: {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Pagination */}
        {totalPages > 1 && (
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 mb-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-purple-500/3"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full translate-x-16 -translate-y-16"></div>

            <div className="relative">
              {/* Enhanced Pagination Info */}
              <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
                <div className="mb-6 lg:mb-0">
                  <p className="text-lg text-gray-700 font-semibold mb-2">
                    Showing <span className="font-black text-blue-600 text-xl">{startIndex + 1}</span>-<span className="font-black text-blue-600 text-xl">{Math.min(startIndex + itemsPerPage, filteredAndSortedReports.length)}</span> of{' '}
                    <span className="font-black text-blue-600 text-xl">{filteredAndSortedReports.length}</span> reports
                  </p>
                  <p className="text-sm text-gray-500">
                    {filteredAndSortedReports.length === mockReports.length ? 'All available reports' : 'Filtered results based on your criteria'}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-lg text-gray-700 font-semibold">
                    Page <span className="font-black text-blue-600 text-xl">{currentPage}</span> of{' '}
                    <span className="font-black text-blue-600 text-xl">{totalPages}</span>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="text-sm text-gray-500">
                    {Math.ceil((currentPage / totalPages) * 100)}% complete
                  </div>
                </div>
              </div>

              {/* Enhanced Pagination Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  <ChevronLeft size={18} className={`mr-2 ${currentPage === 1 ? '' : 'group-hover:-translate-x-1'} transition-transform`} />
                  Previous
                </button>

                {/* Enhanced Page Numbers */}
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-110 ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-2 border-blue-500'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  Next
                  <ChevronRight size={18} className={`ml-2 ${currentPage === totalPages ? '' : 'group-hover:translate-x-1'} transition-transform`} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Reports;