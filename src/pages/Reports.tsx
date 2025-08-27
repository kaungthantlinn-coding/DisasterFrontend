import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Search,
  MapPin,
  Calendar,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
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
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Components
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

// Service and Types
import {
  DisasterReportDto,
  SeverityLevel,
  ReportStatus,
} from "../types/DisasterReport";
import * as DisasterReportService from "../services/disasterReportService";
import { useAuthStore } from "../stores/authStore";
import { useRoles } from "../hooks/useRoles";

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { isOnlyUser, isCj } = useRoles();
  const authState = useAuthStore((state) => ({
    userId: state.user?.userId, // string | null
    accessToken: state.accessToken, // string | null
    isAuthenticated: state.isAuthenticated,
  }));

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisasterType, setSelectedDisasterType] =
    useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showOnlyWithImages, setShowOnlyWithImages] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reports, setReports] = useState<DisasterReportDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter options
  const disasterTypes = [
    "all",
    "flood",
    "fire",
    "earthquake",
    "storm",
    "landslide",
    "accident",
    "other",
  ];
  const severityLevels = ["all", "low", "medium", "high", "critical"];
  const statusOptions = [
    "all",
    ReportStatus.Pending,
    ReportStatus.Accepted,
    ReportStatus.Rejected,
  ];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "severity", label: "By Severity" },
    { value: "location", label: "By Location" },
  ];

  // Fetch reports based on role
  useEffect(() => {
    const fetchReports = async () => {
      if (!authState.isAuthenticated) {
        setError("Please log in to view reports.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        let fetchedReports: DisasterReportDto[];
        if (isOnlyUser()) {
          // Fetch accepted reports for regular users
          fetchedReports =
            await DisasterReportService.getAcceptedDisasterReports();
        } else if (isCj()) {
          // Fetch user's own reports for CJ role
          if (!authState.userId) {
            throw new Error("User ID is required for CJ role.");
          }
          fetchedReports = await DisasterReportService.getMyReports(
            authState.userId,
            authState.accessToken ?? undefined
          );
        } else {
          throw new Error("Invalid user role.");
        }

        // Normalize severity to uppercase
        const normalizedReports = fetchedReports.map((report) => ({
          ...report,
          photos: Array.isArray(report.photoUrls) ? report.photoUrls : [],
          severity: report.severity,
        }));

        setReports(normalizedReports);
      } catch (err: any) {
        setError(err.message || "Failed to fetch reports. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [authState.isAuthenticated, authState.userId, authState.accessToken]);

  // Refresh reports
  const handleRefresh = async () => {
    if (!authState.isAuthenticated) {
      setError("Please log in to refresh reports.");
      return;
    }

    setIsRefreshing(true);
    try {
      let fetchedReports: DisasterReportDto[];
      if (isOnlyUser()) {
        fetchedReports =
          await DisasterReportService.getAcceptedDisasterReports();
      } else if (isCj()) {
        if (!authState.userId) {
          throw new Error("User ID is required for CJ role.");
        }
        fetchedReports = await DisasterReportService.getMyReports(
          authState.userId,
          authState.accessToken ?? undefined
        );
      } else {
        throw new Error("Invalid user role.");
      }

      // Normalize severity
      const normalizedReports = fetchedReports.map((report) => ({
        ...report,
        photos: Array.isArray(report.photoUrls) ? report.photoUrls : [],
        severity: report.severity,
      }));
      console.log(
        "Refreshed reports:",
        normalizedReports.map((r) => ({ id: r.id, severity: r.severity }))
      );
      setReports(normalizedReports);
    } catch (err: any) {
      setError(err.message || "Failed to refresh reports. Please try again.");
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports.filter((report) => {
      // Search filter
      if (
        searchTerm &&
        !report.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !report.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !report.address?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Disaster type filter
      if (
        selectedDisasterType !== "all" &&
        report.disasterTypeName !== selectedDisasterType
      ) {
        return false;
      }

      // Severity filter
      if (
        selectedSeverity !== "all" &&
        report.severity.toUpperCase() !== selectedSeverity.toUpperCase()
      ) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all" && report.status !== selectedStatus) {
        return false;
      }

      // Images filter
      if (
        showOnlyWithImages &&
        (!report.photoUrls || report.photoUrls.length === 0)
      ) {
        return false;
      }

      return true;
    });

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        case "oldest":
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        case "severity":
          const severityOrder = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
          return (
            (severityOrder[
              a.severity.toUpperCase() as keyof typeof severityOrder
            ] || 0) -
            (severityOrder[
              b.severity.toUpperCase() as keyof typeof severityOrder
            ] || 0)
          );
        case "location":
          return a.address.localeCompare(b.address);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    reports,
    searchTerm,
    selectedDisasterType,
    selectedSeverity,
    selectedStatus,
    showOnlyWithImages,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredAndSortedReports.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedDisasterType,
    selectedSeverity,
    selectedStatus,
    showOnlyWithImages,
    sortBy,
  ]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedDisasterType("all");
    setSelectedSeverity("all");
    setSelectedStatus("all");
    setShowOnlyWithImages(false);
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Get disaster type icon
  const getDisasterIcon = (type: string) => {
    const iconProps = { size: 16, className: "text-white" };
    switch (type.toLowerCase()) {
      case "flood":
        return <Waves {...iconProps} />;
      case "fire":
        return <Flame {...iconProps} />;
      case "earthquake":
        return <Mountain {...iconProps} />;
      case "storm":
        return <Wind {...iconProps} />;
      case "landslide":
        return <Mountain {...iconProps} />;
      case "accident":
        return <Truck {...iconProps} />;
      default:
        return <AlertTriangle {...iconProps} />;
    }
  };

  // Get disaster type color
  const getDisasterColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "flood":
        return "from-blue-500 to-blue-600";
      case "fire":
        return "from-red-500 to-orange-500";
      case "earthquake":
        return "from-yellow-600 to-orange-600";
      case "storm":
        return "from-gray-500 to-gray-600";
      case "landslide":
        return "from-amber-600 to-yellow-600";
      case "accident":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  // Get severity color
  const getSeverityColor = (severity: SeverityLevel) => {
    switch (severity) {
      case SeverityLevel.Low:
        return "bg-green-500";
      case SeverityLevel.Medium:
        return "bg-yellow-500";
      case SeverityLevel.High:
        return "bg-orange-500";
      case SeverityLevel.Critical:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get status color
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.Accepted:
        return "bg-green-100 text-green-800 border-green-200";
      case ReportStatus.Pending:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ReportStatus.Rejected:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityText = (severity: SeverityLevel) => {
    switch (severity) {
      case SeverityLevel.Low:
        return "Low";
      case SeverityLevel.Medium:
        return "Medium";
      case SeverityLevel.High:
        return "High";
      case SeverityLevel.Critical:
        return "Critical";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
                <AlertTriangle size={16} className="mr-2" />
                {isOnlyUser()
                  ? "Accepted Critical Reports"
                  : "Your Critical Reports"}
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {isOnlyUser() ? "Accepted" : "Your"}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  High-Priority Reports
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {isOnlyUser()
                  ? "Accepted high-priority disaster reports requiring immediate attention."
                  : "Your high-priority disaster reports requiring immediate attention and response efforts."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedReports
                .filter(
                  (r) =>
                    r.severity.toUpperCase() === "CRITICAL" ||
                    r.severity.toUpperCase() === "HIGH"
                )
                .slice(0, 3)
                .map((report) => (
                  <div
                    key={report.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={
                          report.photoUrls?.[0] ||
                          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={report.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <div
                          className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDisasterColor(
                            report.disasterTypeName
                          )} text-white text-sm font-semibold flex items-center shadow-lg`}
                        >
                          {getDisasterIcon(report.disasterTypeName)}
                          <span className="ml-2 capitalize">
                            {report.disasterTypeName}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full ${getSeverityColor(
                            report.severity
                          )} text-white text-sm font-semibold`}
                        >
                          <AlertTriangle size={14} className="mr-1" />
                          {report.severity}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {report.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {report.description}
                      </p>
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
        {/* Stats Section */}

        {isCj() && (
          <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                  <TrendingUp size={16} className="mr-2" />
                  Your Report Statistics
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Emergency Overview
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md mb-6">
                    <BarChart3 size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {filteredAndSortedReports.length}
                  </div>
                  <div className="text-gray-600 font-medium">Total Reports</div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md mb-6">
                    <CheckCircle size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {
                      filteredAndSortedReports.filter(
                        (r) => r.status === ReportStatus.Accepted
                      ).length
                    }
                  </div>
                  <div className="text-gray-600 font-medium">
                    Accepted Reports
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md mb-6">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {
                      filteredAndSortedReports.filter(
                        (r) =>
                          r.severity.toUpperCase() === "CRITICAL" ||
                          r.severity.toUpperCase() === "HIGH"
                      ).length
                    }
                  </div>
                  <div className="text-gray-600 font-medium">High Priority</div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md mb-6">
                    <Heart size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {
                      filteredAndSortedReports.filter(
                        (r) => r.impactDetails && r.impactDetails.length > 0
                      ).length
                    }
                  </div>
                  <div className="text-gray-600 font-medium">
                    Active Response
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Reports Section */}
        <section id="reports-section" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
              <div className="flex flex-col xl:flex-row gap-6 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search your reports by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      viewMode === "grid"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Grid3X3 size={18} className="mr-2" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      viewMode === "list"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <List size={18} className="mr-2" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      viewMode === "map"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Map size={18} className="mr-2" />
                    Map
                  </button>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
                    showFilters
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <Filter size={18} className="mr-2" />
                  Filters
                </button>
              </div>

              {showFilters && (
                <div className="border-t border-gray-200 pt-8 mt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Disaster Type
                      </label>
                      <select
                        value={selectedDisasterType}
                        onChange={(e) =>
                          setSelectedDisasterType(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      >
                        {disasterTypes.map((type) => (
                          <option key={type} value={type}>
                            {type === "all"
                              ? "All Types"
                              : type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Severity Level
                      </label>
                      <select
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      >
                        {severityLevels.map((level) => (
                          <option key={level} value={level}>
                            {level === "all"
                              ? "All Severities"
                              : level.charAt(0).toUpperCase() + level.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Report Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status === "all" ? "All Statuses" : status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnlyWithImages}
                          onChange={(e) =>
                            setShowOnlyWithImages(e.target.checked)
                          }
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
                  Showing{" "}
                  <span className="font-bold text-blue-600">
                    {startIndex + 1}
                  </span>
                  -
                  <span className="font-bold text-blue-600">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredAndSortedReports.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-blue-600">
                    {filteredAndSortedReports.length}
                  </span>{" "}
                  reports
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  disabled={isRefreshing || !authState.isAuthenticated}
                >
                  <RefreshCw
                    size={16}
                    className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your reports...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Error
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!authState.isAuthenticated}
                >
                  Try Again
                </button>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Reports Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {authState.isAuthenticated
                    ? searchTerm ||
                      selectedDisasterType !== "all" ||
                      selectedSeverity !== "all" ||
                      selectedStatus !== "all"
                      ? "No reports match your current filters. Try adjusting your search criteria."
                      : isOnlyUser()
                      ? "No accepted disaster reports available."
                      : "You haven’t submitted any disaster reports yet."
                    : "Please log in to view reports."}
                </p>
                <button
                  onClick={() =>
                    navigate(authState.isAuthenticated ? "/report" : "/login")
                  }
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {authState.isAuthenticated ? "Submit First Report" : "Log In"}
                </button>
              </div>
            ) : (
              <>
                {/* Reports Grid/List/Map */}
                {viewMode === "map" ? (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Your Reports Map View
                      </h3>
                      <p className="text-gray-600">
                        Interactive map showing{" "}
                        {isOnlyUser() ? "accepted" : "your"} disaster report
                        locations
                      </p>
                    </div>
                    <div className="relative">
                      <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Map size={32} className="text-blue-600" />
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            Interactive Map
                          </h4>
                          <p className="text-gray-600 mb-6 max-w-md">
                            Map integration would show all{" "}
                            {filteredAndSortedReports.length} of{" "}
                            {isOnlyUser() ? "accepted" : "your"} reports with
                            interactive markers
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from(
                              new Set(
                                filteredAndSortedReports.map(
                                  (r) => r.disasterTypeName
                                )
                              )
                            ).map((type) => (
                              <div
                                key={type}
                                className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getDisasterColor(
                                  type
                                )} text-white text-sm font-semibold`}
                              >
                                {getDisasterIcon(type)}
                                <span className="ml-2 capitalize">{type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                        <h5 className="font-semibold text-gray-900 mb-3">
                          Legend
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              Critical (
                              {
                                filteredAndSortedReports.filter(
                                  (r) => r.severity.toUpperCase() === "CRITICAL"
                                ).length
                              }
                              )
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              High (
                              {
                                filteredAndSortedReports.filter(
                                  (r) => r.severity.toUpperCase() === "HIGH"
                                ).length
                              }
                              )
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              Medium (
                              {
                                filteredAndSortedReports.filter(
                                  (r) => r.severity.toUpperCase() === "MEDIUM"
                                ).length
                              }
                              )
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              Low (
                              {
                                filteredAndSortedReports.filter(
                                  (r) => r.severity.toUpperCase() === "LOW"
                                ).length
                              }
                              )
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

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
                          Showing {filteredAndSortedReports.length} of{" "}
                          {isOnlyUser() ? "accepted" : "your"} reports on map
                        </div>
                      </div>
                    </div>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedReports.map((report) => (
                      <div
                        key={report.id}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 cursor-pointer"
                        onClick={() => navigate(`/reports/${report.id}`)}
                      >
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img
                            src={
                              report.photoUrls?.[0] ||
                              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            }
                            alt={report.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${getDisasterColor(
                              report.disasterTypeName
                            )} text-white text-sm font-semibold flex items-center shadow-lg`}
                          >
                            {getDisasterIcon(report.disasterTypeName)}
                            <span className="ml-2 capitalize">
                              {report.disasterTypeName}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full ${getSeverityColor(
                                report.severity
                              )} text-white text-sm font-semibold`}
                            >
                              <AlertTriangle size={14} className="mr-1" />
                              {report.severity}
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                report.status
                              )}`}
                            >
                              {report.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {format(
                                new Date(report.timestamp),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {report.title}
                          </h3>

                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {report.description}
                          </p>

                          <div className="flex items-center text-gray-500 mb-4">
                            <MapPin size={16} className="mr-2" />
                            <span className="text-sm">{report.address}</span>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center text-gray-500">
                              <User size={16} className="mr-2" />
                              <span className="text-sm">
                                {report.userName || "You"}
                              </span>
                            </div>
                            <div className="flex items-center text-blue-600 font-medium">
                              <span className="text-sm">View Details</span>
                              <ArrowRight
                                size={16}
                                className="ml-1 group-hover:translate-x-1 transition-transform"
                              />
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
                          <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={
                                report.photoUrls?.[0] ||
                                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                              }
                              alt={report.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDisasterColor(
                                    report.disasterTypeName
                                  )} text-white text-sm font-semibold flex items-center`}
                                >
                                  {getDisasterIcon(report.disasterTypeName)}
                                  <span className="ml-2 capitalize">
                                    {report.disasterTypeName}
                                  </span>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                    report.status
                                  )}`}
                                >
                                  {report.status}
                                </span>
                              </div>
                              <div
                                className={`inline-flex items-center px-3 py-1 rounded-full ${getSeverityColor(
                                  report.severity
                                )} text-white text-sm font-semibold`}
                              >
                                <AlertTriangle size={14} className="mr-1" />
                                {getSeverityText(report.severity)}
                                <span className="ml-2 capitalize">
                                  {report.severity}
                                </span>
                              </div>
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
                                  {format(
                                    new Date(report.timestamp),
                                    "MMM dd, yyyy"
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <User size={16} className="mr-1" />
                                  {report.userName || "You"}
                                </div>
                              </div>
                              <div className="flex items-center text-blue-600 font-medium">
                                <span>View Details</span>
                                <ArrowRight
                                  size={16}
                                  className="ml-1 group-hover:translate-x-1 transition-transform"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white rounded-xl p-6 border border-gray-100">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <span className="text-sm font-medium text-gray-700">
                          Show:
                        </span>
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
                        Showing {startIndex + 1}-
                        {Math.min(
                          startIndex + itemsPerPage,
                          filteredAndSortedReports.length
                        )}{" "}
                        of {filteredAndSortedReports.length} results
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-2">
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
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft size={18} className="mr-1" />
                            Previous
                          </button>
                        </div>

                        <div className="flex items-center justify-center space-x-1">
                          {(() => {
                            const pages = [];
                            const showEllipsis = totalPages > 7;

                            if (!showEllipsis) {
                              for (let i = 1; i <= totalPages; i++) {
                                pages.push(
                                  <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                      currentPage === i
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                  >
                                    {i}
                                  </button>
                                );
                              }
                            } else {
                              pages.push(
                                <button
                                  key={1}
                                  onClick={() => setCurrentPage(1)}
                                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    currentPage === 1
                                      ? "bg-blue-600 text-white shadow-md"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  1
                                </button>
                              );

                              if (currentPage > 4) {
                                pages.push(
                                  <span
                                    key="ellipsis1"
                                    className="px-2 py-2 text-gray-400"
                                  >
                                    ...
                                  </span>
                                );
                              }

                              const start = Math.max(2, currentPage - 1);
                              const end = Math.min(
                                totalPages - 1,
                                currentPage + 1
                              );

                              for (let i = start; i <= end; i++) {
                                if (i !== 1 && i !== totalPages) {
                                  pages.push(
                                    <button
                                      key={i}
                                      onClick={() => setCurrentPage(i)}
                                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        currentPage === i
                                          ? "bg-blue-600 text-white shadow-md"
                                          : "text-gray-600 hover:bg-gray-100"
                                      }`}
                                    >
                                      {i}
                                    </button>
                                  );
                                }
                              }

                              if (currentPage < totalPages - 3) {
                                pages.push(
                                  <span
                                    key="ellipsis2"
                                    className="px-2 py-2 text-gray-400"
                                  >
                                    ...
                                  </span>
                                );
                              }

                              if (totalPages > 1) {
                                pages.push(
                                  <button
                                    key={totalPages}
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                      currentPage === totalPages
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-100"
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

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
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

                      <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">
                            Go to page:
                          </span>
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
                          <span className="text-sm text-gray-600">
                            of {totalPages}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center mt-4 lg:hidden">
                        <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                          Page {currentPage} of {totalPages}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {filteredAndSortedReports.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      No Reports Found
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      {authState.isAuthenticated
                        ? "No reports match your search criteria. Try adjusting your filters or search terms."
                        : "Please log in to view reports."}
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Featured Reports Section */}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Stay Informed, Stay Safe
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Continue contributing to our community by reporting emergencies
                and helping build safer, more resilient communities.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/report/new"
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <AlertTriangle size={20} className="mr-3" />
                  Report Emergency
                  <ArrowRight
                    size={20}
                    className="ml-3 group-hover:translate-x-1 transition-transform"
                  />
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
};

export default Reports;
