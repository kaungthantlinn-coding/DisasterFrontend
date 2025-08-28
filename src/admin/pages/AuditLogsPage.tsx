import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  History,
  Filter,
  Search,
  Download,
  Calendar,
  User,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  useAuditLog,
  useAuditLogStats,
  useAuditFilterOptions,
  AuditLogEntry,
  AuditLogFilters,
} from "../../hooks/useAuditLog";
import { useAuthStore } from "../../stores/authStore";
import ExportAuditLogsModal from "../components/ExportAuditLogsModal";

// Action display mapping for better user experience
const actionDisplayMap: { [key: string]: string } = {
  LOGIN_SUCCESS: "Login Success",
  LOGIN_FAILED: "Login Failed",
  LOGOUT: "Logout",
  USER_CREATED: "User Created",
  USER_UPDATED: "User Updated",
  USER_SUSPENDED: "User Suspended",
  USER_REACTIVATED: "User Reactivated",
  USER_DEACTIVATED: "User Deactivated",
  DONATION_CREATED: "Donation Created",
  DONATION_UPDATED: "Donation Updated",
  ORGANIZATION_REGISTERED: "Organization Registered",
  ORGANIZATION_UPDATED: "Organization Updated",
  REPORT_POST: "Report Created",
  REPORT_PUT: "Report Updated",
  REPORT_DELETE: "Report Deleted",
  AUDIT_LOGS_EXPORTED_ADVANCED: "Accessed Audit Logs",
  PROFILE_UPDATED: "Profile Updated",
};

// Format audit details with bulk operation handling
const formatAuditDetails = (log: any) => {
  if (log.metadata?.operationType === "bulk") {
    return `${log.details} (Bulk Operation)`;
  }
  return log.details;
};

// Format action display name
const formatActionName = (action: string) => {
  return actionDisplayMap[action] || action;
};

interface AuditLogTableRowProps {
  log: AuditLogEntry;
  onViewDetails: (log: AuditLogEntry) => void;
}

const AuditLogTableRow: React.FC<AuditLogTableRowProps> = ({
  log,
  onViewDetails,
}) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* User Column - Name with UUID tooltip */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900" title={log.userId}>
          {log.userName}
        </div>
      </td>

      {/* Action Column - Human-friendly words */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatActionName(log.action)}
        </div>
      </td>

      {/* Description Column - Key details */}
      <td className="px-6 py-4">
        <div
          className="text-sm text-gray-900 truncate max-w-xs"
          title={formatAuditDetails(log)}
        >
          {formatAuditDetails(log) || "No additional details"}
        </div>
      </td>

      {/* Target Column - System/Module */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {log.targetType || "System"}
        </div>
        {log.targetName && (
          <div className="text-xs text-gray-500 mt-1">{log.targetName}</div>
        )}
      </td>

      {/* Time Column - Short readable date with AM/PM */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {log.userId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatTimestamp(log.timestamp)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onViewDetails(log)}
          className="text-blue-600 hover:text-blue-900 flex items-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
      </td>
    </tr>
  );
};

const AuditLogsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Get auth token and user from store
  const { accessToken, user } = useAuthStore();

  // Get dynamic filter options
  const { filterOptions, isLoading: isLoadingOptions } =
    useAuditFilterOptions();

  // API calls
  const {
    data: auditLogData,
    isLoading,
    error,
    refetch,
  } = useAuditLog({
    page: currentPage,
    pageSize,
    filters: {
      ...filters,
      ...(searchTerm && { searchTerm: searchTerm }),
    },
  });

  const { stats: auditStats, refetch: refetchStats } = useAuditLogStats();

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    setFilters((prev: AuditLogFilters) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setCurrentPage(1);
  };

  const handleExport = async (
    format: string,
    fields: string[],
    exportFilters: any
  ) => {
    try {
      console.log("Exporting audit logs...", { format, fields, exportFilters });

      // Prepare export request for backend API
      // Map frontend filter values to backend arrays
      const mapFrontendToBackend = (frontendValue: string, type: string) => {
        if (!frontendValue) return null;

        // Map user-friendly labels to backend values
        const actionMap: { [key: string]: string[] } = {
          Login: [
            "LOGIN_SUCCESS",
            "LOGIN_FAILED",
            "USER_LOGIN_SUCCESS",
            "USER_LOGIN_FAILED",
          ],
          Logout: ["LOGOUT"],
          Create: [
            "DONATION_CREATED",
            "ORGANIZATION_REGISTERED",
            "REPORT_POST",
            "USER_CREATED",
          ],
          Edit: [
            "DONATION_UPDATED",
            "ORGANIZATION_UPDATED",
            "REPORT_PUT",
            "USER_UPDATED",
          ],
          Delete: ["REPORT_DELETE"],
          Suspend: ["USER_SUSPENDED"],
          Reactivate: ["USER_REACTIVATED", "USER_DEACTIVATED"],
          "Accessed Audit Logs": ["AUDIT_LOGS_EXPORTED_ADVANCED"],
          "Updated Profile": ["PROFILE_UPDATED"],
        };

        const targetTypeMap: { [key: string]: string[] } = {
          Audit: ["Audit"],
          General: ["General"],
          HttpRequest: ["HttpRequest"],
          UserRole: ["UserRole"],
        };

        if (type === "action" && actionMap[frontendValue]) {
          return actionMap[frontendValue];
        }
        if (type === "targetType" && targetTypeMap[frontendValue]) {
          return targetTypeMap[frontendValue];
        }

        return [frontendValue];
      };

      const exportRequest = {
        format,
        fields,
        filters: {
          action: exportFilters.action || null,
          targetType: mapFrontendToBackend(
            exportFilters.targetType,
            "targetType"
          ),
          maxRecords: 10000,
          sanitizeData: true,
        },
      };

      // Check if user is authenticated
      if (!accessToken) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Check if user has required permissions for export
      const userRoles = user?.roles || [];
      const hasExportPermission = userRoles.some(
        (role) =>
          role.toLowerCase() === "admin" || role.toLowerCase() === "superadmin"
      );

      if (!hasExportPermission) {
        throw new Error(
          "Export permission denied. Admin or SuperAdmin role required."
        );
      }

      // Call backend export API
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5057/api";
      const response = await fetch(`${apiBaseUrl}/audit-logs/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(exportRequest),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const blob = await response.blob();
        console.log("Blob size:", blob.size, "Type:", blob.type);

        if (blob.size === 0) {
          throw new Error("Export file is empty");
        }

        const filename =
          response.headers
            .get("Content-Disposition")
            ?.split("filename=")[1]
            ?.replace(/"/g, "") ||
          `audit-logs-${new Date().toISOString().split("T")[0]}.${format}`;

        console.log("Downloading:", filename);

        // Force immediate download - no DOM manipulation
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);

        // Trigger download immediately
        setTimeout(() => {
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 0);

        console.log("Download triggered for:", filename);
        alert(`Export completed successfully: ${filename}`);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `Export failed: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Export failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Export failed. Please try again.";
      alert(`Export failed: ${errorMessage}`);
    }
  };

  const handleRefresh = () => {
    refetch();
    refetchStats();
  };

  const totalPages = auditLogData?.totalPages || 1;
  const logs = auditLogData?.logs || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <History className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Audit Logs</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <History className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Logs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {auditStats.totalLogs.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {auditStats.todayLogs}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  User Actions
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {auditStats.userActions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search actions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                    showFilters
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-500">per page</span>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Action
                    </label>
                    <select
                      value={filters.action || ""}
                      onChange={(e) =>
                        handleFilterChange("action", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isLoadingOptions}
                    >
                      <option value="">All Actions</option>
                      {filterOptions?.actions.map((action) => (
                        <option key={action} value={action}>
                          {action
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Target Type
                    </label>
                    <select
                      value={filters.targetType || ""}
                      onChange={(e) =>
                        handleFilterChange("targetType", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isLoadingOptions}
                    >
                      <option value="">All Types</option>
                      {filterOptions?.targetTypes.map((targetType) => (
                        <option key={targetType} value={targetType}>
                          {targetType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.startDate || ""}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.endDate || ""}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actor ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                      <p className="text-gray-500">Loading audit logs...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                      <p className="text-red-600">
                        Error loading audit logs: {error}
                      </p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-gray-500">No audit logs found</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <AuditLogTableRow
                      key={log.id}
                      log={log}
                      onViewDetails={setSelectedLog}
                    />
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
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * pageSize,
                        auditLogData?.totalCount || 0
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {auditLogData?.totalCount || 0}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Audit Log Details
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedLog.userName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedLog.userId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Action
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedLog.action}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Target Type
                  </label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedLog.targetType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    IP Address
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedLog.ipAddress}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Details
                </label>
                <div className="text-sm text-gray-600">
                  {selectedLog.details}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Timestamp
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportAuditLogsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        currentFilters={filters}
      />
    </div>
  );
};

export default AuditLogsPage;
