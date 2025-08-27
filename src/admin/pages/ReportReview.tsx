import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  User,
  Image as ImageIcon,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  DisasterReportDto,
  ReportStatus,
  SeverityLevel,
} from "../../types/DisasterReport";
import {
  getById,
  acceptDisasterReport,
  rejectDisasterReport,
} from "../../services/disasterReportService";

const severityLabel = (s: SeverityLevel) => {
  switch (s) {
    case SeverityLevel.Low:
      return "Low";
    case SeverityLevel.Medium:
      return "Medium";
    case SeverityLevel.High:
      return "High";
    case SeverityLevel.Critical:
      return "Critical";
    default:
      return String(s);
  }
};

const severityDot = (s: SeverityLevel) => {
  switch (s) {
    case SeverityLevel.Low:
      return "bg-green-500";
    case SeverityLevel.Medium:
      return "bg-yellow-500";
    case SeverityLevel.High:
      return "bg-orange-500";
    case SeverityLevel.Critical:
      return "bg-red-600";
    default:
      return "bg-gray-400";
  }
};

const statusBadge = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.Pending:
      return "bg-yellow-100 text-yellow-800";
    case ReportStatus.Accepted:
      return "bg-green-100 text-green-800";
    case ReportStatus.Rejected:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ReportReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<DisasterReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"accept" | "reject" | null>(null);

  const canAct = useMemo(
    () => report?.status === ReportStatus.Pending,
    [report?.status]
  );

  const load = async () => {
    if (!id) {
      setError("Report ID is missing");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getById(id);
      setReport(data);
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load disaster report"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAccept = async () => {
    if (!id) return;
    setActionLoading("accept");
    try {
      await acceptDisasterReport(id);
      toast.success("Report accepted");
      const updated = await getById(id);
      setReport(updated);
    } catch (e: any) {
      console.error(e);
      toast.error(
        e?.response?.data?.message || e?.message || "Failed to accept report"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    setActionLoading("reject");
    try {
      await rejectDisasterReport(id);
      toast.success("Report rejected");
      const updated = await getById(id);
      setReport(updated);
    } catch (e: any) {
      console.error(e);
      toast.error(
        e?.response?.data?.message || e?.message || "Failed to reject report"
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-[60vh]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/reports")}
          className="inline-flex items-center px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </button>

        {report && (
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(report.status)}`}>
            {report.status}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading report...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <div className="flex items-start justify-between">
            <p className="text-sm">{error}</p>
            <button
              onClick={load}
              className="ml-4 text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && report && (
        <div className="space-y-6">
          {/* Title and meta */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                <p className="mt-2 text-gray-700">{report.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${severityDot(report.severity)}`}></div>
                  <span className="text-sm text-gray-900">
                    Severity: <strong>{severityLabel(report.severity)}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>{new Date(report.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{report.address}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                <span>{report.userName || report.userId}</span>
              </div>
            </div>
          </div>

          {/* Impact details */}
          {report.impactDetails?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact Details</h2>
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
                    {report.impactDetails.map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="py-2 pr-4">
                          {d.impactTypes?.length
                            ? d.impactTypes.map((t) => t.name).join(", ")
                            : "-"}
                        </td>
                        <td className="py-2 pr-4 capitalize">
                          {typeof d.severity === "number" ? severityLabel(d.severity) : "-"}
                        </td>
                        <td className="py-2">{d.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Photos */}
          {report.photoUrls?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2 text-gray-400" /> Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {report.photoUrls.map((url, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-lg border">
                    <img
                      src={url}
                      alt={`photo-${idx}`}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded-full ${
                  report.status === ReportStatus.Pending
                    ? "bg-yellow-100 text-yellow-800"
                    : report.status === ReportStatus.Accepted
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {report.status}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleReject}
                disabled={!canAct || actionLoading !== null}
                className={`inline-flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  !canAct || actionLoading
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                }`}
                title={!canAct ? "Only pending reports can be rejected" : "Reject"}
              >
                {actionLoading === "reject" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Reject
              </button>

              <button
                onClick={handleAccept}
                disabled={!canAct || actionLoading !== null}
                className={`inline-flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  !canAct || actionLoading
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                }`}
                title={!canAct ? "Only pending reports can be accepted" : "Accept"}
              >
                {actionLoading === "accept" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportReview;