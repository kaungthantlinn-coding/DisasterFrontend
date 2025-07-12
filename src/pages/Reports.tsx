import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Search,
  Filter,
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
  List
} from 'lucide-react';

// Components
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

// Data
import { mockReports } from '../data/mockData';
import { Report } from '../types';

const Reports: React.FC = () => {
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter options
  const disasterTypes = ['all', 'flood', 'fire', 'earthquake', 'storm', 'other'];
  const severityLevels = ['all', 'low', 'medium', 'high', 'critical'];
  const statusOptions = ['all', 'pending', 'verified', 'resolved'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'severity', label: 'Severity' },
    { value: 'location', label: 'Location' }
  ];

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = mockReports.filter(report => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = selectedDisasterType === 'all' || report.disasterType === selectedDisasterType;

      // Severity filter
      const matchesSeverity = selectedSeverity === 'all' || report.severity === selectedSeverity;

      // Status filter
      const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;

      // Images filter
      const matchesImages = !showOnlyWithImages || (report.photos && report.photos.length > 0);

      return matchesSearch && matchesType && matchesSeverity && matchesStatus && matchesImages;
    });

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case 'location':
          return a.location.address.localeCompare(b.location.address);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedDisasterType, selectedSeverity, selectedStatus, showOnlyWithImages, sortBy]);

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

  // Get default image for report type
  const getDefaultImage = (type: string) => {
    const defaultImages = {
      flood: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
      fire: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg',
      earthquake: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg',
      storm: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg',
      default: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg'
    };
    return defaultImages[type as keyof typeof defaultImages] || defaultImages.default;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Disaster Reports</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Browse all verified and unverified disaster reports from across the region. 
            Use filters to find specific types of incidents or search by location.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid3X3 size={18} className="mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List size={18} className="mr-2" />
                List
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                showFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Disaster Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disaster Type</label>
                  <select
                    value={selectedDisasterType}
                    onChange={(e) => setSelectedDisasterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {disasterTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Severity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {severityLevels.map(level => (
                      <option key={level} value={level}>
                        {level === 'all' ? 'All Severities' : level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showOnlyWithImages}
                      onChange={(e) => setShowOnlyWithImages(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show only reports with images</span>
                  </label>
                </div>

                <button
                  onClick={clearAllFilters}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X size={16} className="mr-1" />
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <p className="text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedReports.length)} of {filteredAndSortedReports.length} reports
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Reports Display */}
        {paginatedReports.length > 0 ? (
          viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {paginatedReports.map((report, index) => (
                <div
                  key={report.id}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={report.photos?.[0] || getDefaultImage(report.disasterType)}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>

                    {/* Severity Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${getSeverityColor(report.severity)}`}>
                      {report.severity?.toUpperCase()}
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      report.status === 'verified' ? 'bg-green-100 text-green-800' :
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status === 'verified' && <CheckCircle size={12} className="inline mr-1" />}
                      {report.status === 'pending' && <Clock size={12} className="inline mr-1" />}
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </div>

                    {/* Multiple Images Indicator */}
                    {report.photos && report.photos.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs flex items-center">
                        <ImageIcon size={12} className="mr-1" />
                        {report.photos.length}
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Main Content - grows to fill available space */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {report.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {report.description}
                        </p>
                      </div>

                      {/* Meta Information */}
                      <div className="space-y-2 mb-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin size={12} className="mr-1 text-blue-500" />
                          <span className="truncate">{report.location.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1 text-green-500" />
                          <span>{format(report.createdAt, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <User size={12} className="mr-1 text-purple-500" />
                          <span>{report.reporterName}</span>
                        </div>
                      </div>

                      {/* Disaster Type Badge */}
                      <div className="mb-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                          {report.disasterType}
                        </span>
                      </div>
                    </div>

                    {/* Action Button - always at bottom */}
                    <div className="mt-auto">
                      <Link
                        to={`/reports/${report.id}`}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center group"
                      >
                        <span>View Details</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-12">
              <div className="divide-y divide-gray-200">
                {paginatedReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="group hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="p-6 flex items-center space-x-6">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={report.photos?.[0] || getDefaultImage(report.disasterType)}
                          alt={report.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {report.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {report.description}
                            </p>
                          </div>

                          {/* Status and Severity Badges */}
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getSeverityColor(report.severity)}`}>
                              {report.severity?.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              report.status === 'verified' ? 'bg-green-100 text-green-800' :
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report.status === 'verified' && <CheckCircle size={12} className="inline mr-1" />}
                              {report.status === 'pending' && <Clock size={12} className="inline mr-1" />}
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1 text-blue-500" />
                            <span className="truncate max-w-48">{report.location.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-green-500" />
                            <span>{format(report.createdAt, 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center">
                            <User size={14} className="mr-1 text-purple-500" />
                            <span>{report.reporterName}</span>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                            {report.disasterType}
                          </span>
                          {report.photos && report.photos.length > 1 && (
                            <div className="flex items-center text-gray-400">
                              <ImageIcon size={14} className="mr-1" />
                              <span className="text-xs">{report.photos.length}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <Link
                          to={`/reports/${report.id}`}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center group"
                        >
                          <span>View Details</span>
                          <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <AlertTriangle size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600 mb-6">
                No disaster reports match your current filters. Try adjusting your search criteria or clearing the filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            {/* Pagination Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to{' '}
                  <span className="font-medium text-gray-900">
                    {Math.min(startIndex + itemsPerPage, filteredAndSortedReports.length)}
                  </span>{' '}
                  of <span className="font-medium text-gray-900">{filteredAndSortedReports.length}</span> results
                </p>
              </div>

              <div className="text-sm text-gray-500">
                Page <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
                <span className="font-medium text-gray-900">{totalPages}</span>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
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
                      className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border border-blue-600'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
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
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
