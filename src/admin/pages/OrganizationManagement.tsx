import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  MapPin,
  Users,
  Heart,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import {
  showSuccessToast,
  showErrorToast
} from '../../utils/notifications';
import { apiService } from '../../services/api';

// Organization interface
interface Organization {
  id: string;
  name: string;
  logo: string;
  mission: string;
  description: string;
  verified: boolean;
  totalDonated: string;
  donorCount: number;
  lastUpdated: string;
  donationUrl: string;
  categories: string[];
  impact: string;
  founded: string;
  location: string;
  website: string;
  programs: string[];
  achievements: string[];
  status: 'active' | 'inactive' | 'suspended';
  hasCustomDonationPage: boolean;
  customDonationPageUrl?: string;
}

// Sorting and filtering types
type SortField = 'name' | 'location' | 'founded' | 'totalDonated' | 'donorCount' | 'lastUpdated' | 'status';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface FilterConfig {
  search: string;
  category: string;
  status: string;
  verified: string;
  location: string;
}

// Organization management component using real API endpoints

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create' | 'donation'>('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Sorting and filtering state
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    search: '',
    category: 'all',
    status: 'all',
    verified: 'all',
    location: 'all'
  });

  // Form state for editing/creating organizations
  const [formData, setFormData] = useState<Partial<Organization>>({});
  const [donationPageData, setDonationPageData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    currentAmount: '',
    featuredImage: '',
    customContent: ''
  });

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const data = await apiService.organizations.getAll();
      setOrganizations(data);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      showErrorToast('Failed to load organizations');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Handle sorting
  const handleSort = useCallback((field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Handle filtering
  const handleFilterChange = useCallback((key: keyof FilterConfig, value: string) => {
    setFilterConfig(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  // Filtered and sorted organizations
  const filteredAndSortedOrganizations = useMemo(() => {
    let filtered = organizations.filter(org => {
      const matchesSearch = filterConfig.search === '' || 
        org.name.toLowerCase().includes(filterConfig.search.toLowerCase()) ||
        org.mission.toLowerCase().includes(filterConfig.search.toLowerCase()) ||
        org.location.toLowerCase().includes(filterConfig.search.toLowerCase());
      
      const matchesCategory = filterConfig.category === 'all' || 
        org.categories.some(cat => cat.toLowerCase().includes(filterConfig.category.toLowerCase()));
      
      const matchesStatus = filterConfig.status === 'all' || org.status === filterConfig.status;
      const matchesVerified = filterConfig.verified === 'all' || 
        (filterConfig.verified === 'verified' && org.verified) ||
        (filterConfig.verified === 'unverified' && !org.verified);
      
      const matchesLocation = filterConfig.location === 'all' || 
        org.location.toLowerCase().includes(filterConfig.location.toLowerCase());

      return matchesSearch && matchesCategory && matchesStatus && matchesVerified && matchesLocation;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      const { field, direction } = sortConfig;
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Handle special cases for sorting
      if (field === 'totalDonated') {
        aValue = parseInt(a.totalDonated.replace(/[$,]/g, ''));
        bValue = parseInt(b.totalDonated.replace(/[$,]/g, ''));
      } else if (field === 'lastUpdated' || field === 'founded') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [organizations, filterConfig, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganizations = filteredAndSortedOrganizations.slice(startIndex, endIndex);

  // Modal handlers
  const handleView = useCallback((org: Organization) => {
    setSelectedOrganization(org);
    setModalMode('view');
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((org: Organization) => {
    setSelectedOrganization(org);
    setFormData(org);
    setModalMode('edit');
    setShowModal(true);
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedOrganization(null);
    setFormData({
      name: '',
      mission: '',
      description: '',
      location: '',
      website: '',
      categories: [],
      status: 'active',
      verified: false,
      hasCustomDonationPage: false
    });
    setModalMode('create');
    setShowModal(true);
  }, []);

  const handleManageDonationPage = useCallback((org: Organization) => {
    setSelectedOrganization(org);
    setDonationPageData({
      title: `Support ${org.name}`,
      description: org.mission,
      goalAmount: '',
      currentAmount: org.totalDonated,
      featuredImage: org.logo,
      customContent: ''
    });
    setModalMode('donation');
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (orgId: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      setLoading(true);
      try {
        await apiService.organizations.delete(orgId);
        setOrganizations(prev => prev.filter(org => org.id !== orgId));
        showSuccessToast('Organization deleted successfully');
      } catch (error) {
        console.error('Failed to delete organization:', error);
        showErrorToast('Failed to delete organization');
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      if (modalMode === 'create') {
        const organizationData = {
          ...formData,
          totalDonated: '$0',
          donorCount: 0,
          lastUpdated: new Date().toISOString().split('T')[0],
          donationUrl: `https://donate.example.com/${formData.name?.toLowerCase().replace(/\s+/g, '-')}`,
          programs: formData.programs || [],
          achievements: formData.achievements || [],
          impact: formData.impact || 'New organization'
        };
        const newOrg = await apiService.organizations.create(organizationData);
        setOrganizations(prev => [...prev, newOrg]);
        showSuccessToast('Organization created successfully');
      } else if (modalMode === 'edit' && selectedOrganization) {
        const updatedOrg = await apiService.organizations.update(selectedOrganization.id, formData);
        setOrganizations(prev => prev.map(org => 
          org.id === selectedOrganization.id ? updatedOrg : org
        ));
        showSuccessToast('Organization updated successfully');
      } else if (modalMode === 'donation' && selectedOrganization) {
        // Handle donation page creation/update
        const updateData = {
          hasCustomDonationPage: true,
          customDonationPageUrl: `/donate/${selectedOrganization.name.toLowerCase().replace(/\s+/g, '-')}`
        };
        const updatedOrg = await apiService.organizations.update(selectedOrganization.id, updateData);
        setOrganizations(prev => prev.map(org => 
          org.id === selectedOrganization.id ? updatedOrg : org
        ));
        showSuccessToast('Donation page updated successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
      showErrorToast('Failed to save changes');
    } finally {
      setLoading(false);
    }
  }, [modalMode, formData, selectedOrganization, donationPageData]);

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600 mt-1">Manage verified organizations and their donation pages</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOrganizations}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Organization
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={filterConfig.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterConfig.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="medical">Medical Aid</option>
              <option value="education">Education</option>
              <option value="emergency">Emergency Response</option>
              <option value="child">Child Protection</option>
              <option value="community">Community Development</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterConfig.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
            <select
              value={filterConfig.verified}
              onChange={(e) => handleFilterChange('verified', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={filterConfig.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Locations</option>
              <option value="yangon">Yangon</option>
              <option value="mandalay">Mandalay</option>
              <option value="naypyidaw">Naypyidaw</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Organization</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('location')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Location</span>
                    {getSortIcon('location')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('totalDonated')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Total Donated</span>
                    {getSortIcon('totalDonated')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('donorCount')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Donors</span>
                    {getSortIcon('donorCount')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donation Page
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && isInitialLoad ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-48"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : currentOrganizations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Building2 className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
                      <p className="text-gray-500 mb-4">Get started by adding your first organization.</p>
                      <button
                        onClick={() => {
                          setModalMode('create');
                          setFormData({});
                          setShowModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Organization
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img className="h-12 w-12 rounded-full object-cover" src={org.logo} alt={org.name} />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{org.name}</div>
                          {org.verified && (
                            <CheckCircle className="ml-2 w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{org.mission}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {org.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{org.totalDonated}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      {org.donorCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(org.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {org.hasCustomDonationPage ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <XCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">None</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(org)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(org)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Edit Organization"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleManageDonationPage(org)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Manage Donation Page"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      {org.hasCustomDonationPage && (
                        <a
                          href={org.customDonationPageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                          title="View Donation Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(org.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Organization"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredAndSortedOrganizations.length)}</span> of{' '}
                  <span className="font-medium">{filteredAndSortedOrganizations.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'view' && 'Organization Details'}
                {modalMode === 'edit' && 'Edit Organization'}
                {modalMode === 'create' && 'Create New Organization'}
                {modalMode === 'donation' && 'Manage Donation Page'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {modalMode === 'view' && selectedOrganization && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedOrganization.logo} 
                      alt={selectedOrganization.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{selectedOrganization.name}</h4>
                      <p className="text-gray-600">{selectedOrganization.mission}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Basic Information</h5>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Location:</span> {selectedOrganization.location}</div>
                        <div><span className="font-medium">Founded:</span> {selectedOrganization.founded}</div>
                        <div><span className="font-medium">Website:</span> 
                          <a href={selectedOrganization.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                            {selectedOrganization.website}
                          </a>
                        </div>
                        <div><span className="font-medium">Status:</span> {getStatusBadge(selectedOrganization.status)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Impact Statistics</h5>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Total Donated:</span> {selectedOrganization.totalDonated}</div>
                        <div><span className="font-medium">Donor Count:</span> {selectedOrganization.donorCount.toLocaleString()}</div>
                        <div><span className="font-medium">Impact:</span> {selectedOrganization.impact}</div>
                        <div><span className="font-medium">Last Updated:</span> {selectedOrganization.lastUpdated}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                    <p className="text-gray-600 text-sm">{selectedOrganization.description}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Categories</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrganization.categories.map((category, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Programs</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {selectedOrganization.programs.map((program, index) => (
                        <li key={index}>{program}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Recent Achievements</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {selectedOrganization.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {(modalMode === 'edit' || modalMode === 'create') && (
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement *</label>
                    <input
                      type="text"
                      value={formData.mission || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={formData.website || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                      <input
                        type="text"
                        value={formData.founded || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'suspended' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                      <input
                        type="url"
                        value={formData.logo || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={formData.verified || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="verified" className="ml-2 block text-sm text-gray-900">
                      Verified Organization
                    </label>
                  </div>
                </form>
              )}

              {modalMode === 'donation' && selectedOrganization && (
                <form className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="text-sm font-medium text-blue-900">Donation Page Management</h4>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Create or update a custom donation page for {selectedOrganization.name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Title *</label>
                    <input
                      type="text"
                      value={donationPageData.title}
                      onChange={(e) => setDonationPageData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={donationPageData.description}
                      onChange={(e) => setDonationPageData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Goal Amount</label>
                      <input
                        type="text"
                        value={donationPageData.goalAmount}
                        onChange={(e) => setDonationPageData(prev => ({ ...prev, goalAmount: e.target.value }))}
                        placeholder="e.g., $100,000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Amount</label>
                      <input
                        type="text"
                        value={donationPageData.currentAmount}
                        onChange={(e) => setDonationPageData(prev => ({ ...prev, currentAmount: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                    <input
                      type="url"
                      value={donationPageData.featuredImage}
                      onChange={(e) => setDonationPageData(prev => ({ ...prev, featuredImage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Content</label>
                    <textarea
                      value={donationPageData.customContent}
                      onChange={(e) => setDonationPageData(prev => ({ ...prev, customContent: e.target.value }))}
                      rows={6}
                      placeholder="Add any additional content, stories, or specific donation instructions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Preview URL</h5>
                    <p className="text-sm text-gray-600">
                      {selectedOrganization.customDonationPageUrl || `/donate/${selectedOrganization.name.toLowerCase().replace(/\s+/g, '-')}`}
                    </p>
                  </div>
                </form>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {modalMode === 'create' ? 'Create Organization' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;