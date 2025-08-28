import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import { useRoles } from "../hooks/useRoles";
import Header from "../components/Layout/Header";
import AdminDashboard from "../components/AdminDashboard";
import CjChatList from "./CjChatList";
import {
  AlertTriangle,
  Eye,
  ExternalLink,
  CheckCircle,
  Calendar,
  Clock,
  Plus,
  XCircle, // Added for Rejected Reports icon
} from "lucide-react";
import { showInfoToast } from "../utils/notifications";
import { DisasterReportDto, ReportStatus } from "../types/DisasterReport";
import { getMyReports } from "../services/disasterReportService";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  status: "Verified" | "Pending" | "Rejected";
  date: string;
  image?: string;
  onView: () => void;
  onEdit?: () => void;
}

interface AssistanceCardProps {
  id: number;
  title: string;
  description: string;
  date: string;
  status?: "Endorsed" | "Pending";
  onView: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  bgColor,
  iconColor,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <div className={iconColor}>{icon}</div>
      </div>
    </div>
  </div>
);

const ReportCard: React.FC<ReportCardProps> = ({
  id,
  title,
  description,
  status,
  date,
  image,
  onView,
  onEdit,
}) => {
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              {status}
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {date}
            </span>
          </div>
        </div>
        {image && !imageError && (
          <img
            src={image}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover ml-4 border border-gray-200"
            onError={() => setImageError(true)}
          />
        )}
        {image && imageError && (
          <div className="w-16 h-16 rounded-lg bg-gray-100 ml-4 border border-gray-200 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onView}
          className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md font-medium transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

const AssistanceCard: React.FC<AssistanceCardProps> = ({
  id,
  title,
  description,
  date,
  status,
  onView,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="flex items-center justify-between">
          {status && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "Endorsed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {status === "Endorsed" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <Clock className="w-3 h-3 mr-1" />
              )}
              {status}
            </span>
          )}
          <span className="text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {date}
          </span>
        </div>
      </div>
    </div>
    <button
      onClick={onView}
      className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md font-medium transition-colors"
    >
      <Eye className="w-4 h-4 mr-1" />
      View Report
    </button>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { accessToken } = useAuthStore();
  const { isAdmin } = useRoles();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"reports" | "assistance">(
    "reports"
  );
  const [showChatModal, setShowChatModal] = useState(false);
  const [reportsData, setReportsData] = useState<DisasterReportDto[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // Render admin dashboard for admin users
  if (isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminDashboard />
      </div>
    );
  }

  // Fetch reports data
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = accessToken || undefined;
        if (user?.userId) {
          const reports = await getMyReports(user.userId, token);
          console.log("Fetched reports:", reports); // Debug API response
          setReportsData(reports);
        }
      } catch (error) {
        setReportsError("Failed to load disaster reports");
        console.error("Error fetching reports:", error);
      } finally {
        setReportsLoading(false);
      }
    };

    if (user && user.userId) {
      fetchReports();
    }
  }, [user, accessToken]);

  // Get user stats from API data
  const stats = {
    reportsSubmitted: reportsData.length || 0,
    verifiedReports:
      reportsData.filter((r) => {
        const reportStatus =
          typeof r.status === "string" ? r.status : String(r.status);
        return (
          reportStatus === "Verified" ||
          reportStatus === "Accepted" ||
          reportStatus === ReportStatus.Accepted
        );
      }).length || 0,
    rejectedReports:
      reportsData.filter((r) => {
        const reportStatus =
          typeof r.status === "string" ? r.status : String(r.status);
        return (
          reportStatus === "Rejected" ||
          reportStatus === ReportStatus.Rejected ||
          reportStatus === "2"
        );
      }).length || 0,
  };

  // Map reports to ReportCard props
  const myReports = reportsData.map((report: DisasterReportDto) => {
    let status: "Verified" | "Pending" | "Rejected";

    // Debug logging to inspect status
    console.log(
      "Processing Report ID:",
      report.id,
      "Status:",
      report.status,
      "Type:",
      typeof report.status
    );

    // Handle status mapping
    const reportStatus = report.status;

    if (reportStatus == null) {
      console.warn(
        `Report ${report.id} has null/undefined status, defaulting to Pending`
      );
      status = "Pending";
    } else if (typeof reportStatus === "number") {
      switch (reportStatus) {
        case 1:
          status = "Verified";
          break;
        case 2:
          status = "Rejected";
          break;
        case 0:
        default:
          status = "Pending";
          break;
      }
    } else {
      // Handle string values with case-insensitive comparison
      const statusString = String(reportStatus).toLowerCase();
      switch (statusString) {
        case "accepted":
        case "verified":
        case ReportStatus.Accepted.toLowerCase():
          status = "Verified";
          break;
        case "rejected":
        case ReportStatus.Rejected.toLowerCase():
          status = "Rejected";
          break;
        case "pending":
        case ReportStatus.Pending.toLowerCase():
        default:
          status = "Pending";
          break;
      }
    }

    return {
      id: report.id,
      title: report.title || "Untitled Report",
      description:
        report.description && report.description.length > 100
          ? report.description.substring(0, 100) + "..."
          : report.description || "No description provided",
      status,
      date: report.timestamp
        ? new Date(report.timestamp).toLocaleDateString()
        : "Unknown date",
      image:
        report.photoUrls?.[0] ||
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=64&h=64&fit=crop&crop=center",
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-spacing pb-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your reports and assistance activities
              </p>
            </div>
            <Link
              to="/report/new"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Report
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            title="Reports Submitted"
            value={reportsLoading ? "..." : stats.reportsSubmitted}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Verified Reports"
            value={reportsLoading ? "..." : stats.verifiedReports}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            icon={<XCircle className="w-6 h-6" />}
            title="Rejected Reports"
            value={reportsLoading ? "..." : stats.rejectedReports}
            bgColor="bg-red-100" // Changed to match rejected status
            iconColor="text-red-600" // Changed to match rejected status
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Activity</h2>
              <p className="text-sm text-gray-600">
                Track your disaster reports and assistance provided to the
                community.
              </p>
            </div>

            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setActiveTab("reports")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-colors ${
                  activeTab === "reports"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Reports
              </button>
            </div>

            {activeTab === "reports" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reports I've Submitted
                  </h3>
                  <Link
                    to="/report/new"
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
                  >
                    Create New
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {reportsLoading ? (
                    <p className="text-gray-600">Loading reports...</p>
                  ) : reportsError ? (
                    <p className="text-red-600">{reportsError}</p>
                  ) : myReports.length === 0 ? (
                    <p className="text-gray-600">No reports submitted yet.</p>
                  ) : (
                    myReports.map((report) => (
                      <ReportCard
                        key={report.id}
                        id={report.id}
                        title={report.title}
                        description={report.description}
                        status={report.status}
                        date={report.date}
                        image={report.image}
                        onView={() => navigate(`/reports/${report.id}`)}
                        onEdit={() => navigate(`/report/edit/${report.id}`)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showChatModal && <CjChatList onClose={() => setShowChatModal(false)} />}
    </div>
  );
};

export default Dashboard;
