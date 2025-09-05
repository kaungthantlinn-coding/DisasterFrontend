import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  MessageSquare,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  Settings,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  X,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

import { showErrorToast, showSuccessToast } from "../../utils/notifications";

import { SupportRequest } from "../../types/supportRequest";
import { SupportRequestService } from "../../services/supportRequestService";
import { useAuthStore } from "../../stores/authStore";

// Types

interface SupportRequestMetrics {
  totalRequests: number;
  pendingRequests: number;
  verifiedRequests: number;
  rejectedRequests: number;
}

interface AdminStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  bgGradient: string;
  iconBg: string;
}

interface SupportRequestCardProps {
  request: SupportRequest;
  onStatusChange: (
    id: number,
    status: "verified" | "rejected"
  ) => Promise<void>;
  onViewDetails: (request: SupportRequest) => void;
  onDelete: (id: number) => Promise<void>;
  canDelete: boolean;
  isUpdating: boolean;
  updatingIds: Set<number>;
  defaultExpanded?: boolean;
}

interface SupportRequestModalProps {
  request: SupportRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (
    id: number,
    status: "verified" | "rejected"
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isUpdating?: boolean;
  updatingIds?: Set<number>;
}

// Components
const AdminStatCard: React.FC<AdminStatCardProps> = ({
  icon,
  title,
  value,
  change,
  changeType = "neutral",
  bgGradient,
  iconBg,
}) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case "increase":
        return <ArrowUpRight className="w-3 h-3" />;
      case "decrease":
        return <ArrowDownRight className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  // Handle NaN values by converting them to "0"
  const displayValue = isNaN(Number(value)) ? "0" : value;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${bgGradient} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold tracking-tight mb-1">{displayValue}</p>
          {change && (
            <div className="flex items-center text-white/90 text-xs font-medium">
              {getChangeIcon()}
              <span className="ml-1">{change}</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 ${iconBg} rounded-xl bg-white/20 backdrop-blur-sm`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const SupportRequestCard: React.FC<SupportRequestCardProps> = ({
  request,
  onStatusChange,
  onViewDetails,
  onDelete,
  canDelete,
  isUpdating,
  updatingIds,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getStatusColor = (status: any) => {
    const statusStr =
      typeof status === "number"
        ? status === 0
          ? "pending"
          : status === 1
          ? "verified"
          : "rejected"
        : String(status).toLowerCase();

    switch (statusStr) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isPending = () => {
    const status = request.status;
    return typeof status === "number"
      ? status === 0
      : String(status).toLowerCase() === "pending";
  };

  const getUrgencyColor = (urgency: any) => {
    const urgencyStr =
      typeof urgency === "number"
        ? urgency === 1
          ? "immediate"
          : urgency === 2
          ? "within_24h"
          : urgency === 3
          ? "within_week"
          : "non_urgent"
        : String(urgency).toLowerCase();

    switch (urgencyStr) {
      case "immediate":
        return "bg-red-100 text-red-800 border-red-200";
      case "within_24h":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "within_week":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "non_urgent":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {request.fullName}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                request.status
              )}`}
            >
              {(() => {
                const status = request.status;
                if (typeof status === "number") {
                  return status === 0
                    ? "Pending"
                    : status === 1
                    ? "Verified"
                    : "Rejected";
                }
                return (
                  String(status || "pending")
                    .charAt(0)
                    .toUpperCase() +
                  String(status || "pending")
                    .slice(1)
                    .replace("_", " ")
                );
              })()}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                request.urgencyLevel
              )}`}
            >
              {(() => {
                const urgency = request.urgencyLevel;
                if (typeof urgency === "number") {
                  switch (urgency) {
                    case 1:
                      return "Immediate";
                    case 2:
                      return "Within 24h";
                    case 3:
                      return "Within Week";
                    case 4:
                      return "Non-urgent";
                    default:
                      return "Unknown";
                  }
                }
                return String(urgency || "non_urgent").replace("_", " ");
              })()}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{request.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {request.createdAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
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
              <Mail className="w-4 h-4" />
              <span>{request.email}</span>
            </div>
          </div>

          {/* Assistance Types */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Assistance Types:
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(request.assistanceTypes) ? (
                request.assistanceTypes.map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                  >
                    {type}
                  </span>
                ))
              ) : request.assistanceTypes ? (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                  {request.assistanceTypes}
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  No assistance types
                </span>
              )}
            </div>
          </div>
          {/* Description */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Description:
            </p>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              {request.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
            {isPending() && (
              <>
                <button
                  onClick={() => {
                    console.log("Debug - request.id:", request.id);
                    console.log("Debug - request.id type:", typeof request.id);
                    console.log(
                      "Debug - Number(request.id):",
                      Number(request.id)
                    );
                    console.log("Debug - Full request object:", request);
                    onStatusChange(Number(request.id), "verified");
                  }}
                  disabled={isUpdating || updatingIds.has(Number(request.id))}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  {updatingIds.has(Number(request.id)) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Accept
                </button>
                <button
                  onClick={() => {
                    console.log("Debug - request.id:", request.id);
                    console.log("Debug - request.id type:", typeof request.id);
                    console.log(
                      "Debug - Number(request.id):",
                      Number(request.id)
                    );
                    onStatusChange(Number(request.id), "rejected");
                  }}
                  disabled={isUpdating || updatingIds.has(Number(request.id))}
                  className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {updatingIds.has(Number(request.id)) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </button>
              </>
            )}
            {canDelete && (
              <button
                onClick={() => {
                  onDelete(Number(request.id));
                }}
                disabled={isUpdating || updatingIds.has(Number(request.id))}
                className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                {updatingIds.has(Number(request.id)) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
                Delete
              </button>
            )}
          </div>
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
  onDelete,
  isUpdating = false,
  updatingIds = new Set(),
}) => {
  const { user } = useAuthStore();

  if (!isOpen || !request) return null;

  const canDelete = (): boolean => {
    console.log("🔍 Modal canDelete check - User:", user);
    console.log("🔍 Modal canDelete check - Request userId:", request.userId);
    if (!user) return false;
    const isAdmin =
      user.roles.includes("Admin") || user.roles.includes("admin");
    console.log("🔍 Modal canDelete check - Is Admin:", isAdmin);
    const isOwner = request.userId === user.userId;
    console.log("🔍 Modal canDelete check - Is Owner:", isOwner);
    return isAdmin || isOwner;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Support Request Details
            </h2>
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
            onViewDetails={() => {}}
            onDelete={onDelete}
            canDelete={canDelete()}
            isUpdating={isUpdating}
            updatingIds={updatingIds}
            defaultExpanded={true}
          />
        </div>
      </div>
    </div>
  );
};

const AdminSupportRequestManagement: React.FC = () => {
  const { user, accessToken } = useAuthStore();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [metrics, setMetrics] = useState<SupportRequestMetrics>({
    totalRequests: 0,
    pendingRequests: 0,
    verifiedRequests: 0,
    rejectedRequests: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadSupportRequests();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const hasFilters =
        searchTerm.trim() !== "" ||
        statusFilter !== "all" ||
        urgencyFilter !== "all";
      if (hasFilters) {
        searchSupportRequests();
      } else {
        loadSupportRequests();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter, urgencyFilter]);

  const loadSupportRequests = async () => {
    try {
      setIsLoading(true);
      const data = await SupportRequestService.getAllRequests();
      setRequests(data);
      const metricsData = await SupportRequestService.getMetrics();
      setMetrics(metricsData);
    } catch (error: any) {
      showErrorToast(error.message || "Failed to load support requests");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests;

  const canDeleteRequest = (request: SupportRequest): boolean => {
    console.log("🔍 Delete permission check called for request:", request.id);
    console.log("🔍 Current user:", user);

    if (!user) {
      console.log("🔍 No user found");
      return false;
    }

    const isAdmin =
      (user.roles && user.roles.includes("Admin")) ||
      (user.roles && user.roles.includes("admin"));
    console.log("🔍 Admin check result:", { userRoles: user.roles, isAdmin });

    if (isAdmin) {
      console.log("🔍 User is admin - allowing delete");
      return true;
    }

    const canDeleteOwn = request.userId === user.userId;
    console.log("🔍 Own request check:", {
      requestUserId: request.userId,
      currentUserId: user.userId,
      canDeleteOwn,
    });

    return canDeleteOwn;
  };

  const handleStatusChange = async (
    id: number,
    newStatus: "verified" | "rejected"
  ) => {
    try {
      setIsUpdating(true);
      setUpdatingIds((prev) => new Set([...prev, id]));
      const updatedRequest = await SupportRequestService.updateRequestStatus(
        id,
        newStatus
      );

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? {
                ...req, // Preserve existing fields
                ...updatedRequest, // Apply updated fields
                status: newStatus, // Ensure status is updated
              }
            : req
        )
      );

      const metricsData = await SupportRequestService.getMetrics();
      setMetrics(metricsData);

      showSuccessToast("Support request status updated successfully");
    } catch (error: any) {
      console.error("Status change error:", error);
      showErrorToast(
        error.message || "Failed to update support request status"
      );
    } finally {
      setIsUpdating(false);
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const searchSupportRequests = async () => {
    try {
      setIsLoading(true);
      const urgencyValue =
        urgencyFilter !== "all" ? parseInt(urgencyFilter) : undefined;
      const statusValue = statusFilter !== "all" ? statusFilter : undefined;
      const keywordValue = searchTerm.trim() || undefined;

      console.log("🔍 Search parameters:", {
        keyword: keywordValue,
        urgency: urgencyValue,
        status: statusValue,
        originalFilters: { searchTerm, statusFilter, urgencyFilter },
      });

      const data = await SupportRequestService.searchRequests(
        keywordValue,
        urgencyValue,
        statusValue
      );
      console.log("🔍 Search results:", data);
      setRequests(data);

      const metricsData = await SupportRequestService.getMetrics();
      setMetrics(metricsData);
    } catch (error: any) {
      console.error("🔍 Search error:", error);
      showErrorToast(error.message || "Failed to search support requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setUrgencyFilter("all");
    loadSupportRequests();
  };

  const handleViewDetails = (request: SupportRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this support request? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setIsUpdating(true);
      setUpdatingIds((prev) => new Set([...prev, id]));
      console.log("🗑️ Admin deleting support request:", id);
      await SupportRequestService.deleteRequest(id, accessToken || undefined);

      setRequests((prev) => prev.filter((req) => req.id !== id));

      if (selectedRequest?.id === id) {
        setIsModalOpen(false);
        setSelectedRequest(null);
      }

      const metricsData = await SupportRequestService.getMetrics();
      setMetrics(metricsData);

      showSuccessToast("Support request deleted successfully");
    } catch (error: any) {
      console.error("🗑️ Delete error:", error);
      console.error("🗑️ Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete support request";
      showErrorToast(errorMessage);
    } finally {
      setIsUpdating(false);
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
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
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Support Request Management
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">
                    Manage and respond to assistance requests
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
            Dashboard Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              title="Accepted Requests"
              value={metrics.verifiedRequests}
              change="+8% from last week"
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
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              >
                <option value="all">All Urgency</option>
                <option value="1">Immediate</option>
                <option value="2">Within 24h</option>
                <option value="3">Within Week</option>
                <option value="4">Non-urgent</option>
              </select>
            </div>
            <div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 focus:ring-2 focus:ring-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Support Requests List */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Support Requests
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Showing {filteredRequests.length} of {requests.length} requests
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-slate-600">
                Loading support requests...
              </span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600 font-medium">
                No support requests found
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <SupportRequestCard
                  key={request.id}
                  request={request}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteRequest}
                  canDelete={canDeleteRequest(request)}
                  isUpdating={isUpdating}
                  updatingIds={updatingIds}
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
        onDelete={handleDeleteRequest}
        isUpdating={isUpdating}
        updatingIds={updatingIds}
      />
    </div>
  );
};

export default AdminSupportRequestManagement;
