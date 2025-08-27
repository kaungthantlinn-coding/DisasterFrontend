import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Mail,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DisasterReportDto,
  SeverityLevel,
  ReportStatus,
} from "../../types/DisasterReport";
import {
  getAll,
  updateReportStatus,
  remove as deleteDisasterReport,
} from "../../services/disasterReportService";
import { useAuthStore } from "../../stores/authStore";
import Avatar from "../../components/Common/Avatar";
import { userManagementApi } from "../../apis/userManagement";
import { extractPhotoUrl } from "../../utils/avatarUtils";
import ReportMap from "../../components/ReportMap";

interface FilterState {
  status: string;
  type: string;
  severity: string;
  dateRange: string;
  location: string;
}

// Helpers to map DTO values to UI strings
const toUiSeverity = (
  level: SeverityLevel
): "low" | "medium" | "high" | "critical" => {
  switch (level) {
    case SeverityLevel.Low:
      return "low";
    case SeverityLevel.Medium:
      return "medium";
    case SeverityLevel.High:
      return "high";
    case SeverityLevel.Critical:
      return "critical";
    default:
      return "low";
  }
};

const toUiStatus = (
  status: ReportStatus | string | number
): "pending" | "verified" | "rejected" => {
  if (typeof status === "number") {
    if (status === 1) return "verified";
    if (status === 2) return "rejected";
    return "pending";
  }
  const s = String(status).trim().toLowerCase();
  if (s === "accepted" || s === "approved" || s === "verified")
    return "verified";
  if (s === "rejected") return "rejected";
  return "pending";
};

const typeSlug = (name?: string) => (name || "other").trim().toLowerCase();

// Resolve image URL
const buildImageUrl = (u: string) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  const base =
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5057/api";
  const root = String(base).replace(/\/api\/?$/i, "/");
  try {
    return new URL(u.replace(/^\/+/, ""), root).toString();
  } catch {
    return `${root.replace(/\/+$/, "")}/${u.replace(/^\/+/, "")}`;
  }
};

const getStatusColor = (
  status: "pending" | "verified" | "rejected" | "investigating"
) => {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "investigating":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSeverityColor = (severity: "low" | "medium" | "high" | "critical") => {
  switch (severity) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "earthquake":
      return "🌍";
    case "flood":
      return "🌊";
    case "fire":
      return "🔥";
    case "cyclone":
      return "🌪️";
    case "landslide":
      return "⛰️";
    default:
      return "⚠️";
  }
};

const ReportManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReports, setSelectedReports] = useState<DisasterReportDto[]>(
    []
  );
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] =
    useState<DisasterReportDto | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<{
    id: string;
    context: "row" | "modal";
  } | null>(null);
  const [editStatusTarget, setEditStatusTarget] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    type: "all",
    severity: "all",
    dateRange: "all",
    location: "",
  });

  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch reports
  const {
    data: dtoReports = [],
    refetch,
  } = useQuery<DisasterReportDto[]>({
    queryKey: ["reports"],
    queryFn: () => getAll(),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });

  const reports: DisasterReportDto[] = dtoReports;

  const handleSelectReport = (reportId: string) => {
    setSelectedReports((prev) => {
      const exists = prev.some((r) => r.id === reportId);
      if (exists) {
        return prev.filter((r) => r.id !== reportId);
      }
      const r = reports.find((r) => r.id === reportId);
      return r ? [...prev, r] : prev;
    });
  };

  const handleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(
      `Performing ${action} on reports:`,
      selectedReports.map((r) => r.id)
    );
    setSelectedReports([]);
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteDisasterReport(reportId);
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      await refetch();
      console.log("Report deleted:", reportId);
    } catch (err) {
      console.error("Failed to delete report:", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = async (
    reportId: string,
    newUiStatus: "verified" | "rejected"
  ) => {
    const newStatus: ReportStatus =
      newUiStatus === "verified" ? ReportStatus.Accepted : ReportStatus.Rejected;

    // Optimistic update
    queryClient.setQueryData<DisasterReportDto[]>(["reports"], (old) => {
      if (!old) return old;
      return old.map((r) =>
        r.id === reportId ? { ...r, status: newStatus } : r
      );
    });

    // Update modal state
    setSelectedReport((prev) =>
      prev && prev.id === reportId ? { ...prev, status: newStatus } : prev
    );

    try {
      await updateReportStatus(reportId, newStatus, accessToken || undefined);
    } catch (err) {
      console.error("Failed to update report status:", err);
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      return;
    }

    await refetch();
  };

  const filteredReports = reports.filter((report) => {
    const uiSeverity = toUiSeverity(report.severity);
    const uiStatus = toUiStatus(report.status);
    const slug = typeSlug(report.disasterTypeName);

    const matchesSearch =
      (report.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.userName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || uiStatus === (filters.status as any);
    const matchesType = filters.type === "all" || slug === filters.type;
    const matchesSeverity =
      filters.severity === "all" || uiSeverity === (filters.severity as any);
    const matchesLocation =
      !filters.location ||
      (report.address || "")
        .toLowerCase()
        .includes(filters.location.toLowerCase());

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesSeverity &&
      matchesLocation
    );
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case "submittedAt":
      case "createdAt":
        aValue = new Date(a.timestamp).getTime();
        bValue = new Date(b.timestamp).getTime();
        break;
      case "severity":
        const order = { low: 1, medium: 2, high: 3, critical: 4 };
        aValue = order[toUiSeverity(a.severity)] || 0;
        bValue = order[toUiSeverity(b.severity)] || 0;
        break;
      case "status":
        aValue = toUiStatus(a.status);
        bValue = toUiStatus(b.status);
        break;
      case "priority":
        aValue = 0;
        bValue = 0;
        break;
      default:
        aValue = a.title || "";
        bValue = b.title || "";
    }

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortOrder === "asc" ? -1 : 1;
    if (bValue == null) return sortOrder === "asc" ? 1 : -1;

    if (sortOrder === "asc") {
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

  // Prefetch submitter avatars
  useEffect(() => {
    const ids = Array.from(
      new Set(paginatedReports.map((r) => r.userId).filter(Boolean))
    );
    let cancelled = false;
    (async () => {
      for (const id of ids) {
        if (id && userPhotoMap[id] === undefined) {
          try {
            const user = await userManagementApi.getUserById(id);
            const url = extractPhotoUrl(user);
            const email = user?.email;
            if (!cancelled) {
              setUserPhotoMap((prev) =>
                prev[id] !== undefined ? prev : { ...prev, [id]: url }
              );
              setUserEmailMap((prev) =>
                prev[id] !== undefined ? prev : { ...prev, [id]: email }
              );
            }
          } catch (e) {
            if (!cancelled) {
              setUserPhotoMap((prev) =>
                prev[id] !== undefined ? prev : { ...prev, [id]: undefined }
              );
              setUserEmailMap((prev) =>
                prev[id] !== undefined ? prev : { ...prev, [id]: undefined }
              );
            }
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paginatedReports]);

  const [userPhotoMap, setUserPhotoMap] = useState<
    Record<string, string | undefined>
  >({});
  const [userEmailMap, setUserEmailMap] = useState<
    Record<string, string | undefined>
  >({});

  // Ensure modal submitter avatar
  useEffect(() => {
    const id = selectedReport?.userId;
    if (!id || userPhotoMap[id] !== undefined) return;
    let cancelled = false;
    (async () => {
      try {
        const user = await userManagementApi.getUserById(id);
        const url = extractPhotoUrl(user);
        const email = user?.email;
        if (!cancelled) {
          setUserPhotoMap((prev) => ({ ...prev, [id]: url }));
          setUserEmailMap((prev) => ({ ...prev, [id]: email }));
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedReport?.userId]);

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
                <h1 className="text-xl font-bold text-gray-900">
                  Report Management
                </h1>
                <p className="text-sm text-gray-500">
                  Manage and verify disaster reports
                </p>
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
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
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
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === "asc" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) =>
                      setFilters({ ...filters, type: e.target.value })
                    }
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    value={filters.severity}
                    onChange={(e) =>
                      setFilters({ ...filters, severity: e.target.value })
                    }
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({ ...filters, dateRange: e.target.value })
                    }
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by location"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
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
                {selectedReports.length} report
                {selectedReports.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction("verify")}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleBulkAction("reject")}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleBulkAction("investigate")}
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
                      checked={
                        selectedReports.length === reports.length &&
                        reports.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedReports.map((report) => {
                  const uiStatus = toUiStatus(report.status);
                  const uiSeverity = toUiSeverity(report.severity);
                  const slug = typeSlug(report.disasterTypeName);
                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedReports.some(
                            (r) => r.id === report.id
                          )}
                          onChange={() => handleSelectReport(report.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getTypeIcon(slug)}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900">
                                {report.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            uiStatus
                          )}`}
                        >
                          {uiStatus === "verified" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {uiStatus === "pending" && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {uiStatus === "rejected" && (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {uiStatus.charAt(0).toUpperCase() + uiStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getSeverityColor(
                              uiSeverity
                            )}`}
                          ></div>
                          <span className="text-sm text-gray-900 capitalize">
                            {uiSeverity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {report.address || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Avatar
                            size="sm"
                            src={userPhotoMap[report.userId]}
                            name={
                              report.userName ||
                              userEmailMap[report.userId] ||
                              "Unknown"
                            }
                            className="border"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {report.userName || "Unknown"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {report.timestamp
                              ? new Date(report.timestamp).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {report.timestamp
                            ? new Date(report.timestamp).toLocaleTimeString()
                            : ""}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative flex items-center space-x-2">
                          {uiStatus === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(report.id, "verified")
                                }
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Verify"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setRejectTarget({
                                    id: report.id,
                                    context: "row",
                                  })
                                }
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === report.id ? null : report.id
                              )
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="More actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === report.id && (
                            <div className="absolute right-0 top-6 z-20 w-44 bg-white border border-gray-200 rounded-md shadow-lg">
                              <button
                                onClick={() => {
                                  setSelectedReport(report);
                                  setShowReportModal(true);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4 mr-2 text-blue-600" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  setEditStatusTarget(report.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Edit className="w-4 h-4 mr-2 text-amber-600" />
                                Edit Status
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget(report.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Report
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, sortedReports.length)}{" "}
                  of {sortedReports.length} results
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
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
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
                <h2 className="text-xl font-bold text-gray-900">
                  Report Details
                </h2>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedReport.title}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">
                        Type:
                      </span>
                      <span className="text-sm text-gray-900 capitalize">
                        {typeSlug(selectedReport.disasterTypeName)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">
                        Status:
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          toUiStatus(selectedReport.status)
                        )}`}
                      >
                        {toUiStatus(selectedReport.status)
                          .charAt(0)
                          .toUpperCase() +
                          toUiStatus(selectedReport.status).slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">
                        Severity:
                      </span>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getSeverityColor(
                            toUiSeverity(selectedReport.severity)
                          )}`}
                        ></div>
                        <span className="text-sm text-gray-900 capitalize">
                          {toUiSeverity(selectedReport.severity)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">
                        Location:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedReport.address}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">
                        Submitted:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedReport.timestamp
                          ? new Date(selectedReport.timestamp).toLocaleString()
                          : "-"}
                      </span>
                    </div>
                    {Array.isArray(selectedReport.impactDetails) &&
                      selectedReport.impactDetails.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-3">
                            Impact Details
                          </h4>
                          <div className="overflow-x-auto -mx-2 sm:mx-0">
                            <table className="min-w-full text-sm">
                              <thead>
                                <tr className="text-left text-gray-500">
                                  <th className="py-2 pr-4">Types</th>
                                  <th className="py-2 pr-4">Severity</th>
                                  <th className="py-2">Description</th>
                                </tr>
                              </thead>
                              <tbody className="text-gray-900">
                                {selectedReport.impactDetails.map((d, i) => (
                                  <tr key={d.id ?? i} className="border-t">
                                    <td className="py-2 pr-4">
                                      {d.impactTypes && d.impactTypes.length > 0
                                        ? d.impactTypes
                                            .map((t) => t.name)
                                            .join(", ")
                                        : d.impactTypeIds &&
                                          d.impactTypeIds.length > 0
                                        ? d.impactTypeIds.join(", ")
                                        : "-"}
                                    </td>
                                    <td className="py-2 pr-4 capitalize">
                                      {typeof d.severity === "number"
                                        ? toUiSeverity(d.severity)
                                        : "-"}
                                    </td>
                                    <td className="py-2">
                                      {d.description || "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Description
                  </h4>
                  <p className="text-sm text-gray-700 mb-4">
                    {selectedReport.description}
                  </p>

                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Submitted By
                  </h4>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar
                      size="lg"
                      src={userPhotoMap[selectedReport.userId]}
                      name={
                        selectedReport.userName ||
                        userEmailMap[selectedReport.userId] ||
                        "Unknown"
                      }
                      className="border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedReport.userName || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {userEmailMap[selectedReport.userId] || "-"}
                      </p>
                    </div>
                  </div>

                  {Array.isArray(selectedReport.photoUrls) &&
                    selectedReport.photoUrls.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Attachments
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedReport.photoUrls.map((url, idx) => (
                            <div
                              key={idx}
                              className="relative rounded-lg overflow-hidden border"
                            >
                              <img
                                src={buildImageUrl(url)}
                                alt={`Attachment ${idx + 1}`}
                                className="w-full h-32 object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {typeof selectedReport.latitude === "number" &&
                    typeof selectedReport.longitude === "number" && (
                      <div className="mt-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Location Map
                        </h4>
                        <ReportMap
                          lat={selectedReport.latitude}
                          lng={selectedReport.longitude}
                          address={selectedReport.address}
                        />
                      </div>
                    )}
                </div>
              </div>

              {toUiStatus(selectedReport.status) === "pending" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "verified");
                        setShowReportModal(false);
                      }}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Report
                    </button>
                    <button
                      onClick={() =>
                        setRejectTarget({
                          id: selectedReport.id,
                          context: "modal",
                        })
                      }
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

      {/* Edit Status Modal */}
      {editStatusTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Report Status
              </h3>
              <button
                onClick={() => setEditStatusTarget(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-700 mb-4">
                Select a new status for the report.
              </p>
              <select
                onChange={(e) =>
                  handleStatusChange(
                    editStatusTarget,
                    e.target.value as "verified" | "rejected"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Status</option>
                <option value="verified">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setEditStatusTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Rejection
              </h3>
              <button
                onClick={() => setRejectTarget(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-700">
                Are you sure you want to reject this report? You can verify it
                later if needed.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (rejectTarget) {
                    await handleStatusChange(rejectTarget.id, "rejected");
                    if (rejectTarget.context === "modal") {
                      setShowReportModal(false);
                    }
                    setRejectTarget(null);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-700">
                Deleting this report is permanent and cannot be undone. Are you
                sure you want to proceed?
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteTarget) {
                    await handleDeleteReport(deleteTarget);
                    setDeleteTarget(null);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
