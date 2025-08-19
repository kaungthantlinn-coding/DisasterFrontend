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
  AlertTriangle,
  Grid3X3,
  List,
  Map,
  Activity,
  Flame,
  Waves,
  Mountain,
  Wind,
  Truck,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Heart,
  Eye,
  Filter,
  Star,
  CheckCircle
} from 'lucide-react';

// Components
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

// Hooks
import { useReports } from '../hooks/useReports';
import { SeverityLevel } from '../types/DisasterReport';

const Reports: React.FC = () => {
  const navigate = useNavigate();

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // API call to fetch reports
  const { data: reportsData, isLoading, refetch } = useReports();
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'severity', label: 'By Severity' },
    { value: 'location', label: 'By Location' }
  ];

  // Get reports from API data
  const reports = reportsData || [];

  // Filter and sort reports (client-side filtering for search and images only)
  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports.filter(report => {
      // Search filter (client-side for real-time search)
      if (searchTerm && !report.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !report.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !report.address?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Images filter (client-side)
      if (showOnlyWithImages && (!report.photoUrls || report.photoUrls.length === 0)) {
        return false;
      }

      // Disaster Type filter
      if (selectedDisasterType !== 'all' && report.disasterTypeName.toLowerCase() !== selectedDisasterType) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'all' && report.severity.toString().toLowerCase() !== selectedSeverity) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && report.status.toLowerCase() !== selectedStatus) {
        return false;
      }

      return true;
    });

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'severity':
          const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return (severityOrder[b.severity.toString().toLowerCase() as keyof typeof severityOrder] || 0) -
                 (severityOrder[a.severity.toString().toLowerCase() as keyof typeof severityOrder] || 0);
        case 'location':
          return a.address.localeCompare(b.address);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedDisasterType, selectedSeverity, selectedStatus, showOnlyWithImages, sortBy, reports]);

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

  // Get disaster type icon
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

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section - Matching your design system */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Floating background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium mb-8">
                <Activity size={16} className="mr-2 text-cyan-300" />
                <span className="text-white/90">Live Reports</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="block mb-2">Disaster</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                  Response Reports
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                Real-time disaster reports from around the world. Stay informed about emergency situations
                and response efforts in your area and globally.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => document.getElementById('reports-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Eye size={20} className="mr-2" />
                  View Reports
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/report/new"
                  className="group bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  <AlertTriangle size={20} className="mr-2" />
                  Report Emergency
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Matching your design system */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <TrendingUp size={16} className="mr-2" />
                Live Statistics
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Emergency Overview</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md mb-6">
                  <BarChart3 size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{filteredAndSortedReports.length}</div>
                <div className="text-gray-600 font-medium">Total Reports</div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md mb-6">
                  <CheckCircle size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {filteredAndSortedReports.filter(r => r.status === 'Accepted').length}
                </div>
                <div className="text-gray-600 font-medium">Verified Reports</div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md mb-6">
                  <AlertTriangle size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {filteredAndSortedReports.filter(r => r.severity === SeverityLevel.Critical || r.severity === SeverityLevel.High).length}
                </div>
                <div className="text-gray-600 font-medium">High Priority</div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md mb-6">
                  <Heart size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {filteredAndSortedReports.filter(r => r.impactDetails && r.impactDetails.length > 0).length}
                </div>
                <div className="text-gray-600 font-medium">Active Response</div>
              </div>
            </div>
          </div>
        </section>  

        {/* Reports Section */}
        <section id="reports-section" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
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
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
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
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
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
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
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
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
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
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
                    showFilters
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <Filter size={18} className="mr-2" />
                  Filters
                </button>
              </div>

              {/* Filter Controls */}
              {showFilters && (
                <div className="border-t border-gray-200 pt-8 mt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Disaster Type Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Disaster Type</label>
                      <select
                        value={selectedDisasterType}
                        onChange={(e) => setSelectedDisasterType(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="all">All Types</option>
                        <option value="flood">Flood</option>
                        <option value="fire">Fire</option>
                        <option value="earthquake">Earthquake</option>
                        <option value="storm">Storm</option>
                        <option value="landslide">Landslide</option>
                        <option value="accident">Accident</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Severity Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Severity Level</label>
                      <select
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="all">All Severities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Report Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnlyWithImages}
                          onChange={(e) => setShowOnlyWithImages(e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          Show only reports with images
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div>
                <p className="text-gray-700 font-medium">
                  Showing <span className="font-bold text-blue-600">{startIndex + 1}</span>-<span className="font-bold text-blue-600">{Math.min(startIndex + itemsPerPage, filteredAndSortedReports.length)}</span> of <span className="font-bold text-blue-600">{filteredAndSortedReports.length}</span> reports
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => {
                    setIsRefreshing(true);
                    refetch().finally(() => {
                      setIsRefreshing(false);
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  disabled={isRefreshing}
                >
                  <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading reports...</p>
                </div>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedDisasterType !== 'all' || selectedSeverity !== 'all' || selectedStatus !== 'all'
                    ? 'No reports match your current filters. Try adjusting your search criteria.'
                    : 'No disaster reports have been submitted yet.'}
                </p>
                <button
                  onClick={() => navigate('/report')}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit First Report
                </button>
              </div>
            ) : (
              <>
                {/* Reports Grid/List/Map */}
                {viewMode === 'map' ? (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports Map View</h3>
                      <p className="text-gray-600">Interactive map showing disaster report locations</p>
                    </div>
                    <div className="relative">
                      {/* Map Container */}
                      <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Map size={32} className="text-blue-600" />
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h4>
                          <p className="text-gray-600 mb-6 max-w-md">
                            Map integration would show all {filteredAndSortedReports.length} reports with interactive markers
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from(new Set(filteredAndSortedReports.map(r => r.disasterTypeName))).map(type => (
                              <div key={type} className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getDisasterColor(type)} text-white text-sm font-semibold`}>
                                {getDisasterIcon(type)}
                                <span className="ml-2 capitalize">{type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Map Legend */}
                      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                        <h5 className="font-semibold text-gray-900 mb-3">Legend</h5>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Critical ({filteredAndSortedReports.filter(r => r.severity === 3).length})</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">High ({filteredAndSortedReports.filter(r => r.severity === 2).length})</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Medium ({filteredAndSortedReports.filter(r => r.severity === 1).length})</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Low ({filteredAndSortedReports.filter(r => r.severity === 0).length})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Map Controls */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <MapPin size={16} className="mr-2" />
                            Show All Markers
                          </button>
                          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                            <Filter size={16} className="mr-2" />
                            Filter by Severity
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          Showing {filteredAndSortedReports.length} reports on map
                        </div>
                      </div>
                    </div>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedReports.map((report) => (
                      <div
                        key={report.id}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 cursor-pointer"
                        onClick={() => navigate(`/reports/${report.id}`)}
                      >
                        {/* Image */}
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img
                            src={report.photoUrls?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                            alt={report.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Disaster Type Badge */}
                          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${getDisasterColor(report.disasterTypeName)} text-white text-sm font-semibold flex items-center shadow-lg`}>
                            {getDisasterIcon(report.disasterTypeName)}
                            <span className="ml-2 capitalize">{report.disasterTypeName}</span>
                          </div>

                          {/* Severity Badge */}
                          <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getSeverityColor(report.severity.toString())} shadow-lg`}></div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Status Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(report.timestamp), 'MMM dd, yyyy')}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {report.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {report.description}
                          </p>

                          {/* Location */}
                          <div className="flex items-center text-gray-500 mb-4">
                            <MapPin size={16} className="mr-2" />
                            <span className="text-sm">{report.address}</span>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center text-gray-500">
                              <User size={16} className="mr-2" />
                              <span className="text-sm">{report.userName}</span>
                            </div>
                            <div className="flex items-center text-blue-600 font-medium">
                              <span className="text-sm">View Details</span>
                              <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {paginatedReports.map((report) => (
                      <div
                        key={report.id}
                        className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/80 cursor-pointer"
                        onClick={() => navigate(`/reports/${report.id}`)}
                      >
                        <div className="flex items-start space-x-6">
                          {/* Image */}
                          <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={report.photoUrls?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                              alt={report.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDisasterColor(report.disasterTypeName)} text-white text-sm font-semibold flex items-center`}>
                                  {getDisasterIcon(report.disasterTypeName)}
                                  <span className="ml-2 capitalize">{report.disasterTypeName}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                </span>
                              </div>
                              <div className={`w-3 h-3 rounded-full ${getSeverityColor(report.severity.toString())}`}></div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {report.title}
                            </h3>

                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {report.description}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <MapPin size={16} className="mr-1" />
                                  {report.address}
                                </div>
                                <div className="flex items-center">
                                  <Calendar size={16} className="mr-1" />
                                  {format(new Date(report.timestamp), 'MMM dd, yyyy')}
                                </div>
                                <div className="flex items-center">
                                  <User size={16} className="mr-1" />
                                  {report.userName}
                                </div>
                              </div>
                              <div className="flex items-center text-blue-600 font-medium">
                                <span>View Details</span>
                                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Advanced Real-World Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    {/* Items per page selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white rounded-xl p-6 border border-gray-100">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <span className="text-sm font-medium text-gray-700">Show:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value={6}>6 per page</option>
                          <option value={12}>12 per page</option>
                          <option value={24}>24 per page</option>
                          <option value={48}>48 per page</option>
                        </select>
                      </div>

                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedReports.length)} of {filteredAndSortedReports.length} results
                      </div>
                    </div>

                    {/* Main Pagination Controls */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Previous/Next Navigation */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="First page"
                          >
                            <ChevronLeft size={18} />
                            <ChevronLeft size={18} className="-ml-2" />
                          </button>

                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft size={18} className="mr-1" />
                            Previous
                          </button>
                        </div>

                        {/* Page Numbers with Smart Ellipsis */}
                        <div className="flex items-center justify-center space-x-1">
                          {(() => {
                            const pages = [];
                            const showEllipsis = totalPages > 7;

                            if (!showEllipsis) {
                              // Show all pages if 7 or fewer
                              for (let i = 1; i <= totalPages; i++) {
                                pages.push(
                                  <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                      currentPage === i
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  >
                                    {i}
                                  </button>
                                );
                              }
                            } else {
                              // Smart pagination with ellipsis
                              // Always show first page
                              pages.push(
                                <button
                                  key={1}
                                  onClick={() => setCurrentPage(1)}
                                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    currentPage === 1
                                      ? 'bg-blue-600 text-white shadow-md'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  1
                                </button>
                              );

                              // Show ellipsis if current page is far from start
                              if (currentPage > 4) {
                                pages.push(
                                  <span key="ellipsis1" className="px-2 py-2 text-gray-400">
                                    ...
                                  </span>
                                );
                              }

                              // Show pages around current page
                              const start = Math.max(2, currentPage - 1);
                              const end = Math.min(totalPages - 1, currentPage + 1);
                              
                              for (let i = start; i <= end; i++) {
                                if (i !== 1 && i !== totalPages) {
                                  pages.push(
                                    <button
                                      key={i}
                                      onClick={() => setCurrentPage(i)}
                                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        currentPage === i
                                          ? 'bg-blue-600 text-white shadow-md'
                                          : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      {i}
                                    </button>
                                  );
                                }
                              }

                              // Show ellipsis if current page is far from end
                              if (currentPage < totalPages - 3) {
                                pages.push(
                                  <span key="ellipsis2" className="px-2 py-2 text-gray-400">
                                    ...
                                  </span>
                                );
                              }

                              // Always show last page
                              if (totalPages > 1) {
                                pages.push(
                                  <button
                                    key={totalPages}
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                      currentPage === totalPages
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  >
                                    {totalPages}
                                  </button>
                                );
                              }
                            }

                            return pages;
                          })()}
                        </div>

                        {/* Next/Last Navigation */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                            <ChevronRight size={18} className="ml-1" />
                          </button>

                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Last page"
                          >
                            <ChevronRight size={18} />
                            <ChevronRight size={18} className="-ml-2" />
                          </button>
                        </div>
                      </div>

                      {/* Page Jump Input */}
                      <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Go to page:</span>
                          <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                              const page = parseInt(e.target.value);
                              if (page >= 1 && page <= totalPages) {
                                setCurrentPage(page);
                              }
                            }}
                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-sm"
                          />
                          <span className="text-sm text-gray-600">of {totalPages}</span>
                        </div>
                      </div>

                      {/* Mobile-friendly page info */}
                      <div className="flex items-center justify-center mt-4 lg:hidden">
                        <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                          Page {currentPage} of {totalPages}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Featured Reports Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
                <Star size={16} className="mr-2" />
                Featured Reports
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Critical <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Emergency Situations</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                High-priority disaster reports requiring immediate attention and response efforts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reports.filter(r => r.severity === 3 || r.severity === 2).slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={report.photoUrls?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDisasterColor(report.disasterTypeName)} text-white text-sm font-semibold flex items-center shadow-lg`}>
                        {getDisasterIcon(report.disasterTypeName)}
                        <span className="ml-2 capitalize">{report.disasterTypeName}</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                        <AlertTriangle size={14} className="mr-1" />
                        {['Low', 'Medium', 'High', 'Critical'][report.severity]}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{report.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{report.description}</p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin size={16} className="mr-2" />
                      <span className="text-sm">{report.address}</span>
                    </div>
                    <Link
                      to={`/reports/${report.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Matching your design system */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Stay Informed, Stay Safe
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Join our community of informed citizens helping to build safer, more resilient communities worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/report/new"
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <AlertTriangle size={20} className="mr-3" />
                  Report Emergency
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Reports;