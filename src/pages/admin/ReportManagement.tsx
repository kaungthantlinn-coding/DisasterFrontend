import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  User,
  MoreVertical,
  Image,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'earthquake' | 'flood' | 'fire' | 'cyclone' | 'landslide' | 'other';
  status: 'pending' | 'verified' | 'rejected' | 'investigating';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  coordinates: [number, number];
  submittedBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: {
    id: string;
    name: string;
  };
  description: string;
  images: string[];
  comments: number;
  priority: number;
  affectedPeople?: number;
  estimatedDamage?: string;
}

interface FilterState {
  status: string;
  type: string;
  severity: string;
  dateRange: string;
  location: string;
}

const ReportManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    type: 'all',
    severity: 'all',
    dateRange: 'all',
    location: ''
  });

  // Mock data - replace with real API data
  const mockReports: Report[] = [
    {
      id: 'RPT-001',
      title: 'Major Earthquake in Downtown Area',
      type: 'earthquake',
      status: 'pending',
      severity: 'critical',
      location: 'San Francisco, CA',
      coordinates: [37.7749, -122.4194],
      submittedBy: {
        id: 'user-1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      submittedAt: '2024-01-15T10:30:00Z',
      description: 'Strong earthquake felt across the downtown area. Multiple buildings showing structural damage.',
      images: ['image1.jpg', 'image2.jpg'],
      comments: 5,
      priority: 9,
      affectedPeople: 1500,
      estimatedDamage: '$2.5M'
    },
    {
      id: 'RPT-002',
      title: 'Flash Flood in Residential Area',
      type: 'flood',
      status: 'verified',
      severity: 'high',
      location: 'Austin, TX',
      coordinates: [30.2672, -97.7431],
      submittedBy: {
        id: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com'
      },
      submittedAt: '2024-01-14T15:45:00Z',
      verifiedAt: '2024-01-14T16:30:00Z',
      verifiedBy: {
        id: 'admin-1',
        name: 'Admin User'
      },
      description: 'Sudden flash flood affecting multiple residential streets. Water levels rising rapidly.',
      images: ['flood1.jpg'],
      comments: 3,
      priority: 7,
      affectedPeople: 800,
      estimatedDamage: '$1.2M'
    },
    {
      id: 'RPT-003',
      title: 'Wildfire Spreading Near Highway',
      type: 'fire',
      status: 'investigating',
      severity: 'high',
      location: 'Los Angeles, CA',
      coordinates: [34.0522, -118.2437],
      submittedBy: {
        id: 'user-3',
        name: 'Mike Davis',
        email: 'mike.davis@email.com'
      },
      submittedAt: '2024-01-13T09:15:00Z',
      description: 'Large wildfire visible from Highway 101. Smoke affecting visibility.',
      images: ['fire1.jpg', 'fire2.jpg', 'fire3.jpg'],
      comments: 8,
      priority: 8,
      affectedPeople: 2000,
      estimatedDamage: '$5M'
    },
    {
      id: 'RPT-004',
      title: 'Minor Landslide on Mountain Road',
      type: 'landslide',
      status: 'rejected',
      severity: 'low',
      location: 'Denver, CO',
      coordinates: [39.7392, -104.9903],
      submittedBy: {
        id: 'user-4',
        name: 'Lisa Wilson',
        email: 'lisa.w@email.com'
      },
      submittedAt: '2024-01-12T14:20:00Z',
      description: 'Small landslide blocking part of mountain access road.',
      images: [],
      comments: 1,
      priority: 3,
      affectedPeople: 50
    },
    {
      id: 'RPT-005',
      title: 'Severe Storm Damage',
      type: 'cyclone',
      status: 'verified',
      severity: 'medium',
      location: 'Miami, FL',
      coordinates: [25.7617, -80.1918],
      submittedBy: {
        id: 'user-5',
        name: 'Carlos Rodriguez',
        email: 'carlos.r@email.com'
      },
      submittedAt: '2024-01-11T18:00:00Z',
      verifiedAt: '2024-01-11T19:15:00Z',
      verifiedBy: {
        id: 'admin-2',
        name: 'Jane Admin'
      },
      description: 'Severe storm causing power outages and tree damage across the city.',
      images: ['storm1.jpg'],
      comments: 4,
      priority: 6,
      affectedPeople: 1200,
      estimatedDamage: '$800K'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earthquake': return '🌍';
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'cyclone': return '🌪️';
      case 'landslide': return '⛰️';
      default: return '⚠️';
    }
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports.length === mockReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(mockReports.map(report => report.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on reports:`, selectedReports);
    // Implement bulk actions
    setSelectedReports([]);
  };

  const handleStatusChange = (reportId: string, newStatus: string) => {
    console.log(`Changing status of ${reportId} to ${newStatus}`);
    // Implement status change
  };

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || report.status === filters.status;
    const matchesType = filters.type === 'all' || report.type === filters.type;
    const matchesSeverity = filters.severity === 'all' || report.severity === filters.severity;
    const matchesLocation = !filters.location || report.location.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType && matchesSeverity && matchesLocation;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'submittedAt':
        aValue = new Date(a.submittedAt).getTime();
        bValue = new Date(b.submittedAt).getTime();
        break;
      case 'priority':
        aValue = a.priority || 0;
        bValue = b.priority || 0;
        break;
      case 'severity':
        const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        aValue = severityOrder[a.severity] || 0;
        bValue = severityOrder[b.severity] || 0;
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      default:
        aValue = a[sortBy as keyof Report] || '';
        bValue = b[sortBy as keyof Report] || '';
    }
    
    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
    if (bValue == null) return sortOrder === 'asc' ? 1 : -1;
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-500 hover:text-gray-700">
                <Shield className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Report Management</h1>
                <p className="text-sm text-gray-500">Manage and verify disaster reports</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reports, locations, or submitters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="submittedAt">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="severity">Sort by Severity</option>
                <option value="status">Sort by Status</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="investigating">Investigating</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="flood">Flood</option>
                    <option value="fire">Fire</option>
                    <option value="cyclone">Cyclone</option>
                    <option value="landslide">Landslide</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters({...filters, severity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Filter by location"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedReports.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('verify')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleBulkAction('investigate')}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Investigate
                </button>
                <button
                  onClick={() => setSelectedReports([])}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedReports.length === mockReports.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleSelectReport(report.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getTypeIcon(report.type)}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">{report.title}</p>
                            {report.priority >= 8 && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{report.id}</p>
                          {report.images.length > 0 && (
                            <div className="flex items-center mt-1">
                              <Image className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">{report.images.length} image{report.images.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {report.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {report.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {report.status === 'investigating' && <Activity className="w-3 h-3 mr-1" />}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(report.severity)}`}></div>
                        <span className="text-sm text-gray-900 capitalize">{report.severity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{report.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {report.submittedBy.avatar ? (
                          <img
                            src={report.submittedBy.avatar}
                            alt={report.submittedBy.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.submittedBy.name}</p>
                          <p className="text-xs text-gray-500">{report.submittedBy.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(report.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(report.submittedAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowReportModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(report.id, 'verified')}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Verify"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(report.id, 'rejected')}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedReports.length)} of {sortedReports.length} results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedReport.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Type:</span>
                      <span className="text-sm text-gray-900 capitalize">{selectedReport.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Severity:</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(selectedReport.severity)}`}></div>
                        <span className="text-sm text-gray-900 capitalize">{selectedReport.severity}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <span className="text-sm text-gray-900">{selectedReport.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Submitted:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(selectedReport.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    {selectedReport.affectedPeople && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">Affected People:</span>
                        <span className="text-sm text-gray-900">{selectedReport.affectedPeople.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedReport.estimatedDamage && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">Estimated Damage:</span>
                        <span className="text-sm text-gray-900">{selectedReport.estimatedDamage}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-sm text-gray-700 mb-4">{selectedReport.description}</p>
                  
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Submitted By</h4>
                  <div className="flex items-center space-x-3 mb-4">
                    {selectedReport.submittedBy.avatar ? (
                      <img
                        src={selectedReport.submittedBy.avatar}
                        alt={selectedReport.submittedBy.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedReport.submittedBy.name}</p>
                      <p className="text-xs text-gray-500">{selectedReport.submittedBy.email}</p>
                    </div>
                  </div>

                  {selectedReport.images.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Attachments</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedReport.images.map((image, index) => (
                          <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                            <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-600">{image}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedReport.status === 'pending' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, 'verified');
                        setShowReportModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Report
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, 'investigating');
                        setShowReportModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Mark as Investigating
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, 'rejected');
                        setShowReportModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;