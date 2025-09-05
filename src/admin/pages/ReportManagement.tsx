import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Activity,
  Mail,
  Edit,
  Trash2,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  PieChart,
  TrendingDown,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DisasterReportDto,
  SeverityLevel,
  ReportStatus,
} from "../../types/DisasterReport";
import {
  getAll,
  acceptDisasterReport,
  rejectDisasterReport,
  remove as deleteDisasterReport,
} from "../../services/disasterReportService";

import SimpleLeafletMap from "../../components/Map/SimpleLeafletMap";
import type { RealWorldDisaster } from "../../types";
import Avatar from "../../components/Common/Avatar";
import { userManagementApi } from "../../apis/userManagement";
import { extractPhotoUrl } from "../../utils/avatarUtils";
import ReportMap from "@/components/ReportMap";
interface FilterState {
  status: string;
  type: string;
  severity: string;
  dateRange: string;
  location: string;
}

interface ReportMetrics {
  totalReports: number;
  pendingReports: number;
  verifiedReports: number;
  rejectedReports: number;
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

// Helpers to map DTO values to UI strings
const toUiSeverity = (
  level: SeverityLevel | string | number | any
): "low" | "medium" | "high" | "critical" => {
  if (level == null) {
    return "low";
  }
  if (typeof level === "number") {
    switch (level) {
      case 0:
        return "low";
      case 1:
        return "medium";
      case 2:
        return "high";
      case 3:
        return "critical";
      default:
        return "low";
    }
  }
  if (typeof level === "string") {
    const normalizedLevel = level.toLowerCase().trim();
    switch (normalizedLevel) {
      case "low":
      case "0":
        return "low";
      case "medium":
      case "1":
        return "medium";
      case "high":
      case "2":
        return "high";
      case "critical":
      case "3":
        return "critical";
      default:
        return "low";
    }
  }
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
    // Defensive: handle numeric status if backend returns enum as number
    // 0: Pending, 1: Accepted, 2: Rejected (assumed)
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

// Resolve image URL: works with absolute URLs and server-relative paths
const buildImageUrl = (u: string) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  const base =
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5057/api";
  // If API base ends with /api, strip it to get server root for static files
  const root = String(base).replace(/\/api\/?$/i, "/");
  try {
    return new URL(u.replace(/^\/+/, ""), root).toString();
  } catch {
    return `${root.replace(/\/+$/, "")}/${u.replace(/^\/+/, "")}`;
  }
};

const getStatusColor = (status: "pending" | "verified" | "rejected") => {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";

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
      return "🌍";
  }
};

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

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${bgGradient} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
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
        <div
          className={`p-3 ${iconBg} rounded-xl bg-white/20 backdrop-blur-sm`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const ReportManagement: React.FC = () => {
  // Register Chart.js components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
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
  const [openEditStatusModal, setOpenEditStatusModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<{
    id: string;
    context: "row" | "modal";
  } | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    type: "all",
    severity: "all",
    dateRange: "all",
    location: "",
  });

  // Cache of submitter userId -> photoUrl (Google, etc.)
  const [userPhotoMap, setUserPhotoMap] = useState<
    Record<string, string | undefined>
  >({});
  // Cache of submitter userId -> email
  const [userEmailMap, setUserEmailMap] = useState<
    Record<string, string | undefined>
  >({});

  // Fetch reports via DisasterReport service
  const {
    data: dtoReports = [],
    isLoading,
    error,
    refetch,
  } = useQuery<DisasterReportDto[]>({
    queryKey: ["reports"],
    queryFn: () => getAll(),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });

  const reports: DisasterReportDto[] = dtoReports;

  // Calculate metrics
  const metrics: ReportMetrics = useMemo(() => {
    const totalReports = reports.length;
    const pendingReports = reports.filter(
      (r) => toUiStatus(r.status) === "pending"
    ).length;
    const verifiedReports = reports.filter(
      (r) => toUiStatus(r.status) === "verified"
    ).length;
    const rejectedReports = reports.filter(
      (r) => toUiStatus(r.status) === "rejected"
    ).length;

    return {
      totalReports,
      pendingReports,
      verifiedReports,
      rejectedReports,
    };
  }, [reports]);

  // Calculate disaster types distribution for real-time pie chart
  const disasterTypesDistribution = useMemo(() => {
    const typeCounts: Record<string, number> = {};

    reports.forEach((report) => {
      const typeName = report.disasterTypeName || "Other";
      const normalizedType = typeSlug(typeName);
      typeCounts[normalizedType] = (typeCounts[normalizedType] || 0) + 1;
    });

    // Convert to array format for Chart.js
    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);

    // Define colors for different disaster types
    const colorMap: Record<string, string> = {
      earthquake: "rgba(59, 130, 246, 0.8)", // blue
      flood: "rgba(34, 197, 94, 0.8)", // green
      fire: "rgba(239, 68, 68, 0.8)", // red
      cyclone: "rgba(245, 158, 11, 0.8)", // amber
      landslide: "rgba(139, 69, 19, 0.8)", // brown
      other: "rgba(107, 114, 128, 0.8)", // gray
      tsunami: "rgba(6, 182, 212, 0.8)", // cyan
      drought: "rgba(251, 191, 36, 0.8)", // yellow
      storm: "rgba(147, 51, 234, 0.8)", // purple
      hurricane: "rgba(236, 72, 153, 0.8)", // pink
    };

    const borderColorMap: Record<string, string> = {
      earthquake: "rgba(59, 130, 246, 1)",
      flood: "rgba(34, 197, 94, 1)",
      fire: "rgba(239, 68, 68, 1)",
      cyclone: "rgba(245, 158, 11, 1)",
      landslide: "rgba(139, 69, 19, 1)",
      other: "rgba(107, 114, 128, 1)",
      tsunami: "rgba(6, 182, 212, 1)",
      drought: "rgba(251, 191, 36, 1)",
      storm: "rgba(147, 51, 234, 1)",
      hurricane: "rgba(236, 72, 153, 1)",
    };

    const backgroundColors = labels.map(label => colorMap[label] || colorMap.other);
    const borderColors = labels.map(label => borderColorMap[label] || borderColorMap.other);

    return {
      labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
      data,
      backgroundColors,
      borderColors,
    };
  }, [reports]);

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
    // Implement bulk actions if needed
    setSelectedReports([]);
  };

  const queryClient = useQueryClient();

  const handleStatusChange = async (
    reportId: string,
    newUiStatus: "pending" | "verified" | "rejected"
  ) => {
    // Determine API action
    const action =
      newUiStatus === "verified"
        ? "accept"
        : newUiStatus === "rejected"
        ? "reject"
        : null;

    if (!action) {
      console.warn(
        "Unsupported status change for DisasterReport API:",
        newUiStatus
      );
      return;
    }

    // Optimistic update: update cached list immediately
    queryClient.setQueryData<DisasterReportDto[]>(["reports"], (old) => {
      if (!old) return old;
      return old.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status:
                action === "accept"
                  ? ReportStatus.Accepted
                  : action === "reject"
                  ? ReportStatus.Rejected
                  : r.status,
            }
          : r
      );
    });

    // Optimistic update: update modal state if open
    setSelectedReport((prev) =>
      prev && prev.id === reportId
        ? {
            ...prev,
            status:
              action === "accept"
                ? ReportStatus.Accepted
                : action === "reject"
                ? ReportStatus.Rejected
                : prev.status,
          }
        : prev
    );

    try {
      if (action === "accept") {
        await acceptDisasterReport(reportId);
      } else {
        await rejectDisasterReport(reportId);
      }
    } catch (err) {
      // Revert optimistic update on failure
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      console.error("Failed to update report status:", err);
      return;
    }

    // Final sync
    await refetch();
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
      setOpenMenuId(null);
    }
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
      case "severity": {
        const order = { low: 1, medium: 2, high: 3, critical: 4 };
        aValue = order[toUiSeverity(a.severity)] || 0;
        bValue = order[toUiSeverity(b.severity)] || 0;
        break;
      }
      case "status":
        aValue = toUiStatus(a.status);
        bValue = toUiStatus(b.status);
        break;
      case "priority": // not in DTO; default to 0
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

  // Prefetch submitter avatars for current page
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

  // Ensure modal submitter avatar is available
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
              {/* <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Reports
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Dashboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
            Dashboard Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatCard
              icon={<FileText className="w-5 h-5" />}
              title="Total Reports"
              value={metrics.totalReports}
              change="+12% from last week"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
              iconBg="bg-blue-400"
            />
            <AdminStatCard
              icon={<Clock className="w-5 h-5" />}
              title="Pending Reports"
              value={metrics.pendingReports}
              change="+3 since yesterday"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-yellow-500 to-orange-500"
              iconBg="bg-yellow-400"
            />
            <AdminStatCard
              icon={<CheckCircle className="w-5 h-5" />}
              title="Verified Reports"
              value={metrics.verifiedReports}
              change="+8% from last week"
              changeType="increase"
              bgGradient="bg-gradient-to-br from-green-500 to-green-600"
              iconBg="bg-green-400"
            />
            <AdminStatCard
              icon={<XCircle className="w-5 h-5" />}
              title="Rejected Reports"
              value={metrics.rejectedReports}
              change="-2% this month"
              changeType="decrease"
              bgGradient="bg-gradient-to-br from-red-500 to-red-600"
              iconBg="bg-red-400"
            />
          </div>
        </div>
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
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4 rotate-180" />
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
                                  setSelectedReport(report);
                                  setOpenEditStatusModal(true);
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

        {/* Charts Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">
            Disaster Reports Analytics
          </h2>

          {/* Monthly Reports Chart */}
          
           

          {/* Disaster Types and Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                Disaster Types Distribution
              </h3>
              <div className="h-80 flex items-center justify-center">
                {disasterTypesDistribution.data.length > 0 ? (
                  <Pie
                    data={{
                      labels: disasterTypesDistribution.labels,
                      datasets: [
                        {
                          data: disasterTypesDistribution.data,
                          backgroundColor: disasterTypesDistribution.backgroundColors,
                          borderColor: disasterTypesDistribution.borderColors,
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom" as const,
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No disaster reports available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                Reports by Status
              </h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: ["Pending", "Verified", "Rejected"],
                    datasets: [
                      {
                        label: "Report Count",
                        data: [
                          metrics.pendingReports,
                          metrics.verifiedReports,
                          metrics.rejectedReports,
                        ],
                        backgroundColor: [
                          "rgba(245, 158, 11, 0.8)",
                          "rgba(34, 197, 94, 0.8)",
                          "rgba(239, 68, 68, 0.8)",
                        ],
                        borderColor: [
                          "rgba(245, 158, 11, 1)",
                          "rgba(34, 197, 94, 1)",
                          "rgba(239, 68, 68, 1)",
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 5,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    {selectedReport.title}
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex flex-col space-y-2">
                        <span className="text-lg font-medium text-gray-600">
                          Type:
                        </span>
                        <span className="text-lg text-gray-900 capitalize font-semibold">
                          {typeSlug(selectedReport.disasterTypeName)}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="text-lg font-medium text-gray-600">
                          Status:
                        </span>
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold w-fit ${getStatusColor(
                            toUiStatus(selectedReport.status)
                          )}`}
                        >
                          {toUiStatus(selectedReport.status)
                            .charAt(0)
                            .toUpperCase() +
                            toUiStatus(selectedReport.status).slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="text-lg font-medium text-gray-600">
                          Severity:
                        </span>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 rounded-full ${getSeverityColor(
                              toUiSeverity(selectedReport.severity)
                            )}`}
                          ></div>
                          <span className="text-lg text-gray-900 capitalize font-semibold">
                            {toUiSeverity(selectedReport.severity)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="text-lg font-medium text-gray-600">
                          Location:
                        </span>
                        <span className="text-lg text-gray-900 font-semibold">
                          {selectedReport.address}
                        </span>

                        {Array.isArray(selectedReport.impactDetails) &&
                          selectedReport.impactDetails.length > 0 && (
                            <div className="mt-6">
                              <h5 className="text-xl font-semibold text-gray-900 mb-4">
                                Impact Details
                              </h5>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <table className="w-full text-base">
                                  <thead>
                                    <tr className="text-left text-gray-700 border-b">
                                      <th className="py-3 pr-4 font-semibold">
                                        Types
                                      </th>
                                      <th className="py-3 pr-4 font-semibold">
                                        Severity
                                      </th>
                                      <th className="py-3 font-semibold">
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-gray-900">
                                    {selectedReport.impactDetails.map(
                                      (d, i) => (
                                        <tr
                                          key={d.id ?? i}
                                          className="border-b border-gray-200"
                                        >
                                          <td className="py-3 pr-4">
                                            {d.impactTypes &&
                                            d.impactTypes.length > 0
                                              ? d.impactTypes
                                                  .map((t) => t.name)
                                                  .join(", ")
                                              : d.impactTypeIds &&
                                                d.impactTypeIds.length > 0
                                              ? d.impactTypeIds.join(", ")
                                              : "-"}
                                          </td>
                                          <td className="py-3 pr-4 capitalize">
                                            {typeof d.severity === "number"
                                              ? toUiSeverity(d.severity)
                                              : "-"}
                                          </td>
                                          <td className="py-3">
                                            {d.description || "-"}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <span className="text-lg font-medium text-gray-600">
                        Submitted:
                      </span>
                      <span className="text-lg text-gray-900 font-semibold">
                        {selectedReport.timestamp
                          ? new Date(selectedReport.timestamp).toLocaleString()
                          : "-"}
                      </span>
                    </div>
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
                        {selectedReport.userEmail ||
                          userEmailMap[selectedReport.userId] ||
                          "-"}
                      </p>
                    </div>
                  </div>

                  {Array.isArray(selectedReport.photoUrls) &&
                    selectedReport.photoUrls.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Attachments
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedReport.photoUrls.map((url, idx) => (
                            <div
                              key={idx}
                              className="relative rounded-lg overflow-hidden border"
                            >
                              <img
                                src={buildImageUrl(url)}
                                alt={`Attachment ${idx + 1}`}
                                className="w-full h-80 object-cover rounded-lg"
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
                        {selectedReport.latitude !== 0 &&
                        selectedReport.longitude !== 0 ? (
                          <ReportMap
                            lat={selectedReport.latitude}
                            lng={selectedReport.longitude}
                            address={selectedReport.address}
                          />
                        ) : (
                          <div className="bg-gray-100 p-4 rounded-lg text-gray-500">
                            📍 No location available
                          </div>
                        )}
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

      {openEditStatusModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Report Status
                </h2>
                <button
                  onClick={() => setOpenEditStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedReport.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Current status:{" "}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      toUiStatus(selectedReport.status)
                    )}`}
                  >
                    {toUiStatus(selectedReport.status).charAt(0).toUpperCase() +
                      toUiStatus(selectedReport.status).slice(1)}
                  </span>
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select New Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        handleStatusChange(selectedReport.id, "pending")
                      }
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        toUiStatus(selectedReport.status) === "pending"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                      <span className="text-sm font-medium">Pending</span>
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedReport.id, "verified")
                      }
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        toUiStatus(selectedReport.status) === "verified"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <span className="text-sm font-medium">Verified</span>
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedReport.id, "rejected")
                      }
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        toUiStatus(selectedReport.status) === "rejected"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <XCircle className="w-5 h-5 mx-auto mb-1 text-red-500" />
                      <span className="text-sm font-medium">Rejected</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setOpenEditStatusModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
