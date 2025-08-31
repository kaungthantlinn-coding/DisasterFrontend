import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import { getById } from "../services/disasterReportService";
import { DisasterReportDto, SeverityLevel } from "../types/DisasterReport";
import ReportMap from "../components/ReportMap";
import {
  getAcceptedByReportId,
  SupportRequestService,
} from "../services/supportRequestService";
import { useAuthStore } from "../stores/authStore";

interface AssistanceItem {
  id: string;
  userName?: string;
  createdAt?: string;
  userId?: string;
  supportTypeNames?: string | string[] | null;
  type?: string | string[] | null;
  description?: string;
  urgency?: number | string;
  urgencyLevel?: number | string;
}

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, accessToken } = useAuthStore();

  const [report, setReport] = useState<DisasterReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [assistanceProvided, setAssistanceProvided] = useState<
    AssistanceItem[]
  >([]);
  const [showAllAssistance, setShowAllAssistance] = useState(false);
  const [assistanceLoading, setAssistanceLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mapSeverity = (value: number): SeverityLevel => {
    switch (value) {
      case 0:
        return SeverityLevel.Low;
      case 1:
        return SeverityLevel.Medium;
      case 2:
        return SeverityLevel.High;
      case 3:
        return SeverityLevel.Critical;
      default:
        return SeverityLevel.Low;
    }
  };

  useEffect(() => {
    if (!id) {
      console.error("Invalid report id:", id);
      return;
    }
    getById(id).then((data) => {
      const mappedReport: DisasterReportDto = {
        id: data.id,
        title: data.title,
        description: data.description,
        timestamp: data.timestamp,
        status: String(data.status),
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        userName: data.userName,
        photoUrls: Array.isArray(data.photoUrls) ? data.photoUrls : [],
        severity: mapSeverity(data.severity),
        disasterTypeName: data.disasterTypeName || "Unknown",
        disasterTypeId: data.disasterTypeId || 0,
        userId: data.userId || "Unknown",
        impactDetails: data.impactDetails || [],
      };
      setReport(mappedReport);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setAssistanceLoading(true);
    getAcceptedByReportId(id)
      .then((data) => {
        console.log("Assistance data:", data); // Debug the data
        setAssistanceProvided(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Failed to fetch assistance:", error);
        setAssistanceProvided([]);
      })
      .finally(() => setAssistanceLoading(false));
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const displayedAssistance = useMemo(
    () =>
      showAllAssistance ? assistanceProvided : assistanceProvided.slice(0, 3),
    [assistanceProvided, showAllAssistance]
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!report) {
    return <div className="p-6 text-red-500">Report not found.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/" className="flex items-center text-red-500 mb-4">
        <ArrowLeft size={18} className="mr-1" /> Back to Home
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {report.title}
              <span
                className={`ml-3 px-2 py-0.5 rounded text-sm font-medium ${
                  report.status === "Verified"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {report.status}
              </span>
            </h1>
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" /> {report.timestamp}
              </div>
              <span className="text-gray-500">By {report.userName}</span>
            </div>
          </div>
          <p className="text-gray-700">{report.description}</p>
          <div>
            <h2 className="text-lg font-semibold mb-2">Photos</h2>
            {report.photoUrls.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Disaster photo ${index + 1}`}
                    className="w-full rounded shadow"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">
                No photos available
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Impact Details</h2>
            {report.impactDetails.length > 0 ? (
              report.impactDetails.map((detail) => (
                <div key={detail.id} className="p-3 border rounded mb-2">
                  <p className="font-medium text-gray-800">
                    {detail.description}
                  </p>
                  {detail.severity && (
                    <p className="text-sm text-gray-600">
                      Severity: {detail.severity}
                    </p>
                  )}
                  {detail.impactTypes.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Types: {detail.impactTypes.map((t) => t.name).join(", ")}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No impact details available
              </p>
            )}
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            {report.latitude && report.longitude ? (
              <ReportMap
                lat={report.latitude}
                lng={report.longitude}
                address={report.address}
              />
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg text-gray-500">
                📍 No location available
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <div className="bg-white p-4 rounded shadow space-y-3">
            <h2 className="font-semibold text-gray-700">Take Action</h2>
            <Link
              to={`/support/${report.id}`}
              className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-center"
            >
              Support Request
            </Link>
            <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded">
              Contact Reporter
            </button>
          </div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Want to Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Join our community to offer assistance and connect with those in
              need.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
              Join to Help
            </button>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Users size={18} className="inline-block text-blue-500" />{" "}
              Assistance Needed
            </h3>
            {assistanceLoading ? (
              <div className="text-gray-500 text-sm py-4">
                Loading assistance...
              </div>
            ) : assistanceProvided.length === 0 ? (
              <div className="text-gray-400 italic text-sm py-2">
                No assistance provided yet.
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {displayedAssistance.map((item, idx) => {
                    const cardId = `${item.id || idx}`;
                    const isExpanded = expandedCardId === cardId;
                    const menuId = `${item.id || idx}`;
                    return (
                      <div
                        key={cardId}
                        className={`bg-gray-50 rounded-lg p-4 border transition-all duration-300 hover:shadow-md ${
                          isExpanded ? "shadow-lg" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                              {item.userName || "Anonymous"}
                            </span>
                            {item.createdAt && (
                              <span className="text-xs text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {item.userId === user?.userId && item.id && (
                            <div className="relative" ref={dropdownRef}>
                              <button
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(
                                    openDropdownId === menuId ? null : menuId
                                  );
                                }}
                              >
                                <svg
                                  className="w-4 h-4 text-gray-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                              {openDropdownId === menuId && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                                  <Link
                                    to={`/support/update/${item.id}`}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    onClick={() => setOpenDropdownId(null)}
                                  >
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                    Update
                                  </Link>
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const confirmed = window.confirm(
                                        "Are you sure you want to delete this assistance request? This action cannot be undone."
                                      );
                                      if (!confirmed) {
                                        setOpenDropdownId(null);
                                        return;
                                      }
                                      try {
                                        await SupportRequestService.deleteRequest(
                                          Number(item.id),
                                          accessToken || undefined
                                        );
                                        setAssistanceProvided((prev) =>
                                          prev.filter(
                                            (assistance) =>
                                              assistance.id !== item.id
                                          )
                                        );
                                        alert(
                                          "Assistance request deleted successfully"
                                        );
                                      } catch (error: any) {
                                        console.error(
                                          "Failed to delete assistance:",
                                          error
                                        );
                                        alert(
                                          error.response?.data?.message ||
                                            error.message ||
                                            "Failed to delete assistance request"
                                        );
                                      }
                                      setOpenDropdownId(null);
                                    }}
                                  >
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
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-700">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            Assistance Type:
                          </h4>
                          {item.supportTypeNames || item.type ? (
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                const value =
                                  item.supportTypeNames || item.type;
                                if (Array.isArray(value)) {
                                  return value
                                    .filter(
                                      (type) =>
                                        type &&
                                        typeof type === "string" &&
                                        type.trim() !== ""
                                    )
                                    .map((type: string, index: number) => (
                                      <span
                                        key={`${type}-${index}`}
                                        className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 break-words font-['Noto_Sans_Myanmar']"
                                      >
                                        {type.trim()}
                                      </span>
                                    ));
                                }
                                return (
                                  typeof value === "string"
                                    ? value
                                    : String(value || "")
                                )
                                  .split(",")
                                  .filter((type) => type.trim() !== "")
                                  .map((type: string, index: number) => (
                                    <span
                                      key={`${type}-${index}`}
                                      className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 break-words font-['Noto_Sans_Myanmar']"
                                    >
                                      {type.trim()}
                                    </span>
                                  ));
                              })()}
                            </div>
                          ) : (
                            <span>No type specified</span>
                          )}
                        </div>
                        {!isExpanded && (
                          <>
                            {item.description && (
                              <div className="text-sm text-gray-600 mb-3 break-words overflow-hidden">
                                <div
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  {item.description}
                                </div>
                              </div>
                            )}
                            <button
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
                              onClick={() => setExpandedCardId(cardId)}
                            >
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
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                              View Details
                            </button>
                          </>
                        )}
                        {isExpanded && (
                          <div className="space-y-3">
                            {item.description && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">
                                  Description:
                                </h4>
                                <div className="text-sm text-gray-600 bg-white p-3 rounded border break-words overflow-hidden">
                                  <div
                                    style={{
                                      wordBreak: "break-word",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                            )}
                            {(item.urgency || item.urgencyLevel) && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">
                                  Urgency Level:
                                </h4>
                                <span
                                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${(() => {
                                    const urgency =
                                      item.urgency || item.urgencyLevel;
                                    if (typeof urgency === "number") {
                                      switch (urgency) {
                                        case 1:
                                          return "bg-red-100 text-red-800";
                                        case 2:
                                          return "bg-orange-100 text-orange-800";
                                        case 3:
                                          return "bg-yellow-100 text-yellow-800";
                                        case 4:
                                        default:
                                          return "bg-green-100 text-green-800";
                                      }
                                    }
                                    if (urgency === "immediate") {
                                      return "bg-red-100 text-red-800";
                                    } else if (urgency === "within_24h") {
                                      return "bg-orange-100 text-orange-800";
                                    } else if (urgency === "within_week") {
                                      return "bg-yellow-100 text-yellow-800";
                                    } else {
                                      return "bg-green-100 text-green-800";
                                    }
                                  })()}`}
                                >
                                  {(() => {
                                    const urgency =
                                      item.urgency || item.urgencyLevel;
                                    if (typeof urgency === "number") {
                                      switch (urgency) {
                                        case 4:
                                          return "Non-urgent";
                                        case 3:
                                          return "Within a Week";
                                        case 2:
                                          return "Within 24 Hours";
                                        case 1:
                                          return "Immediate";
                                        default:
                                          return "Unknown";
                                      }
                                    }
                                    switch (urgency) {
                                      case "immediate":
                                        return "Immediate";
                                      case "within_24h":
                                        return "Within 24 Hours";
                                      case "within_week":
                                        return "Within a Week";
                                      case "non_urgent":
                                        return "Non-urgent";
                                      default:
                                        return urgency || "Unknown";
                                    }
                                  })()}
                                </span>
                              </div>
                            )}
                            <button
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
                              onClick={() => setExpandedCardId(null)}
                            >
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
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                              Show Less
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {assistanceProvided.length > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium"
                      onClick={() => setShowAllAssistance(!showAllAssistance)}
                    >
                      {showAllAssistance
                        ? "Show Less"
                        : `View All (${assistanceProvided.length})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
