import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { getById } from "../services/disasterReportService"; // adjust path
import { DisasterReportDto, SeverityLevel } from "../types/DisasterReport";
import ReportMap from "../components/ReportMap";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<DisasterReportDto | null>(null);
  const [loading, setLoading] = useState(true);

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
        return SeverityLevel.Low; // default value
    }
  };

  useEffect(() => {
    if (!id) {
      console.error("Invalid report id:", id);
      return;
    }
    getById(id).then((data) => {
      console.log("Backend data:", data);
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
      } as DisasterReportDto;
      setReport(mappedReport);
      setLoading(false);
      console.log("Impact details from backend:", data.impactDetails);
    });
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!report) {
    return <div className="p-6 text-red-500">Report not found.</div>;
  }
  if (report) {
    console.log("UserName:", report.userName);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link to="/" className="flex items-center text-red-500 mb-4">
        <ArrowLeft size={18} className="mr-1" /> Back to Home
      </Link>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - main content */}
        <div className="flex-1 space-y-6">
          {/* Title + Meta */}
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

          {/* Description */}
          <p className="text-gray-700">{report.description}</p>

          {/* Photos */}
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

          {/* Impact Details */}
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

          {/* Location */}
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

        {/* Right column - Action boxes */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Take Action */}
          <div className="bg-white p-4 rounded shadow space-y-3">
            <h2 className="font-semibold text-gray-700">Take Action</h2>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Support Request
            </button>
            <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded">
              Contact Reporter
            </button>
          </div>

          {/* Join to Help */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Want to Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Join our community to offer assistance and connect with those in
              need.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
              Join to Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
