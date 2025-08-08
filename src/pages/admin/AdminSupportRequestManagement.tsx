import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Settings,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Edit3,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

// Types
interface SupportRequest {
  id: string;
  requesterName: string;
  contactPhone: string;
  contactEmail: string;
  disasterType: string;
  location: string;
  urgencyLevel: 'immediate' | 'within_24h' | 'within_week' | 'non_urgent';
  assistanceTypes: string[];
  customAssistanceType?: string;
  assistanceDescription: string;
  status: 'pending' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  adminRemarks?: string;
  assignedTo?: string;
}

interface SupportRequestMetrics {
  totalRequests: number;
  pendingRequests: number;
  verifiedRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  rejectedRequests: number;
}

interface AdminStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  bgGradient: string;
  iconBg: string;
}

interface SupportRequestCardProps {
  request: SupportRequest;
  onStatusChange: (id: string, status: SupportRequest['status']) => void;
  onAddRemarks: (id: string, remarks: string) => void;
  onViewDetails: (request: SupportRequest) => void;
}

interface SupportRequestModalProps {
  request: SupportRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: SupportRequest['status']) => void;
  onAddRemarks: (id: string, remarks: string) => void;
}

// Mock data - replace with actual API calls
const mockSupportRequests: SupportRequest[] = [
  {
    id: '1',
    requesterName: 'Aung Kyaw',
    contactPhone: '+95-9-123456789',
    contactEmail: 'aungkyaw@email.com',
    disasterType: 'Flood',
    location: 'Yangon, Myanmar',
    urgencyLevel: 'immediate',
    assistanceTypes: ['Emergency Rescue', 'Medical Assistance', 'Food & Water'],
    assistanceDescription: 'Urgent help needed for flood victims in downtown area. Multiple families trapped.',
    status: 'pending',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z'
  },
  {
    id: '2',
    requesterName: 'Thida Oo',
    contactPhone: '+95-9-987654321',
    contactEmail: 'thidaoo@email.com',
    disasterType: 'Earthquake',
    location: 'Mandalay, Myanmar',
    urgencyLevel: 'within_24h',
    assistanceTypes: ['Temporary Shelter', 'Psychological Support'],
    assistanceDescription: 'Need temporary shelter for earthquake victims. About 50 families affected.',
    status: 'verified',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    adminRemarks: 'Verified with local authorities. Shelter arrangements in progress.'
  },
  {
    id: '3',
    requesterName: 'Zaw Min',
    contactPhone: '+95-9-555666777',
    contactEmail: 'zawmin@email.com',
    disasterType: 'Fire',
    location: 'Bagan, Myanmar',
    urgencyLevel: 'within_week',
    assistanceTypes: ['Cleanup & Restoration', 'Financial Aid'],
    assistanceDescription: 'Fire damaged several houses. Need cleanup assistance and financial support.',
    status: 'in_progress',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    adminRemarks: 'Cleanup team dispatched. Financial aid assessment ongoing.',
    assignedTo: 'Admin Team A'
  }
];

const mockMetrics: SupportRequestMetrics = {
  totalRequests: 156,
  pendingRequests: 23,
  verifiedRequests: 45,
  inProgressRequests: 32,
  resolvedRequests: 48,
  rejectedRequests: 8
};

// Components
const AdminStatCard: React.FC<AdminStatCardProps> = ({ 
  icon, 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  bgGradient, 
  iconBg 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <ArrowUpRight className="w-3 h-3" />;
      case 'decrease': return <ArrowDownRight className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${bgGradient} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold tracking-tight mb-1">{value}</p>
          {change && (
            <div className="flex items-center text-white/90 text-xs font-medium">
              {getChangeIcon()}
              <span className="ml-1">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 ${iconBg} rounded-xl bg-white/20 backdrop-blur-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const SupportRequestCard: React.FC<SupportRequestCardProps> = ({ 
  request, 
  onStatusChange, 
  onAddRemarks, 
  onViewDetails 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRemarks, setShowRemarks] = useState(false);
  const [remarks, setRemarks] = useState(request.adminRemarks || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: SupportRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'verified': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: SupportRequest['urgencyLevel']) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-200';
      case 'within_24h': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'within_week': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'non_urgent': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = async (newStatus: SupportRequest['status']) => {
    setIsUpdating(true);
    try {
      await onStatusChange(request.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveRemarks = async () => {
    setIsUpdating(true);
    try {
      await onAddRemarks(request.id, remarks);
      setShowRemarks(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">{request.requesterName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgencyLevel)}`}>
              {request.urgencyLevel.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              <span>{request.disasterType}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{request.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onViewDetails(request)}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-4 border-t border-slate-100 pt-4">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4" />
              <span>{request.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4" />
              <span>{request.contactEmail}</span>
            </div>
          </div>

          {/* Assistance Types */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Assistance Types:</p>
            <div className="flex flex-wrap gap-2">
              {request.assistanceTypes.map((type, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                  {type}
                </span>
              ))}
              {request.customAssistanceType && (
                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                  {request.customAssistanceType}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Description:</p>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{request.assistanceDescription}</p>
          </div>

          {/* Admin Remarks */}
          {request.adminRemarks && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Admin Remarks:</p>
              <p className="text-sm text-slate-600 bg-green-50 p-3 rounded-lg border border-green-200">{request.adminRemarks}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {/* Status Actions */}
              {request.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange('verified')}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                    Verify
                  </button>
                  <button
                    onClick={() => handleStatusChange('rejected')}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                    Reject
                  </button>
                </>
              )}
              {request.status === 'verified' && (
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  disabled={isUpdating}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                  Mark In Progress
                </button>
              )}
              {request.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange('resolved')}
                  disabled={isUpdating}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                  Mark Resolved
                </button>
              )}
            </div>

            {/* Remarks Button */}
            <button
              onClick={() => setShowRemarks(!showRemarks)}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-all"
            >
              <MessageSquare className="w-3 h-3" />
              Add Remarks
            </button>
          </div>

          {/* Remarks Input */}
          {showRemarks && (
            <div className="space-y-2">
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add your remarks here..."
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveRemarks}
                  disabled={isUpdating || !remarks.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowRemarks(false);
                    setRemarks(request.adminRemarks || '');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-all"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SupportRequestModal: React.FC<SupportRequestModalProps> = ({ 
  request, 
  isOpen, 
  onClose, 
  onStatusChange, 
  onAddRemarks 
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Support Request Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <SupportRequestCard
            request={request}
            onStatusChange={onStatusChange}
            onAddRemarks={onAddRemarks}
            onViewDetails={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

const AdminSupportRequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<SupportRequest[]>(mockSupportRequests);
  const [metrics, setMetrics] = useState<SupportRequestMetrics>(mockMetrics);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.disasterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || request.urgencyLevel === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: SupportRequest['status']) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id 
          ? { ...req, status: newStatus, updatedAt: new Date().toISOString() }
          : req
      )
    );
    
    // Update metrics
    setMetrics(prev => {
      const updatedMetrics = { ...prev };
      // This would typically be calculated from the backend
      return updatedMetrics;
    });
  };

  // Handle add remarks
  const handleAddRemarks = async (id: string, remarks: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id 
          ? { ...req, adminRemarks: remarks, updatedAt: new Date().toISOString() }
          : req
      )
    );
  };

  // Handle view details
  const handleViewDetails = (request: SupportRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-sm">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Request Management</h1>
                  <p className="text-sm text-slate-500 font-medium">Manage and respond to assistance requests</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Metrics Dashboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Dashboard Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <AdminStatCard
              icon={<FileText className="w-5 h-5" />}
              title="Total Requests"
              value={metrics.totalRequests}
              change="+12% from last week"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
              iconBg="bg-blue-400"
            />
            <AdminStatCard
              icon={<Clock className="w-5 h-5" />}
              title="Pending Requests"
              value={metrics.pendingRequests}
              change="+3 since yesterday"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-yellow-500 to-orange-500"
              iconBg="bg-yellow-400"
            />
            <AdminStatCard
              icon={<CheckCircle className="w-5 h-5" />}
              title="Verified Requests"
              value={metrics.verifiedRequests}
              change="+8% from last week"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
              iconBg="bg-blue-400"
            />
            <AdminStatCard
              icon={<Settings className="w-5 h-5" />}
              title="In Progress"
              value={metrics.inProgressRequests}
              change="+5 this week"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
              iconBg="bg-purple-400"
            />
            <AdminStatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              title="Resolved Requests"
              value={metrics.resolvedRequests}
              change="+15% this month"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-green-500 to-green-600"
              iconBg="bg-green-400"
            />
            <AdminStatCard
              icon={<XCircle className="w-5 h-5" />}
              title="Rejected Requests"
              value={metrics.rejectedRequests}
              change="-2% this month"
              changeType="decrease"
              bgGradient="bg-gradient-to-br from-red-500 to-red-600"
              iconBg="bg-red-400"
            />
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by requester name, disaster type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-400"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            {/* Urgency Filter */}
            <div className="lg:w-48">
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              >
                <option value="all">All Urgency</option>
                <option value="immediate">Immediate</option>
                <option value="within_24h">Within 24h</option>
                <option value="within_week">Within Week</option>
                <option value="non_urgent">Non-urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Support Requests List */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Support Requests</h3>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Showing {filteredRequests.length} of {requests.length} requests
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-slate-600">Loading support requests...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600 font-medium">No support requests found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <SupportRequestCard
                  key={request.id}
                  request={request}
                  onStatusChange={handleStatusChange}
                  onAddRemarks={handleAddRemarks}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <SupportRequestModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        onStatusChange={handleStatusChange}
        onAddRemarks={handleAddRemarks}
      />
    </div>
  );
};

export default AdminSupportRequestManagement;