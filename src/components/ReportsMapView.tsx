import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DisasterReportDto, SeverityLevel } from "../types/DisasterReport";
import { Flame, Waves, Mountain, Wind, Truck, AlertTriangle } from "lucide-react";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface ReportsMapViewProps {
  reports: DisasterReportDto[];
  height?: string;
}

// Component to fit map bounds to show all markers
function FitBounds({ reports }: { reports: DisasterReportDto[] }) {
  const map = useMap();

  useEffect(() => {
    if (reports.length > 0) {
      const validReports = reports.filter(
        (report) => report.latitude && report.longitude
      );

      if (validReports.length > 0) {
        const bounds = L.latLngBounds(
          validReports.map((report) => [report.latitude, report.longitude])
        );

        // Add some padding to the bounds
        map.fitBounds(bounds, { padding: [20, 20] });

        // If there's only one report, zoom in a bit more
        if (validReports.length === 1) {
          map.setZoom(12);
        }
      }
    }
  }, [reports, map]);

  return null;
}

// Create custom marker icons based on severity
const createCustomIcon = (severity: SeverityLevel, disasterType: string) => {
  let color = "#10B981"; // Default green for low
  let iconHtml = "📍";

  // Set color based on severity
  switch (severity) {
    case SeverityLevel.Critical:
      color = "#EF4444"; // Red
      break;
    case SeverityLevel.High:
      color = "#F97316"; // Orange
      break;
    case SeverityLevel.Medium:
      color = "#EAB308"; // Yellow
      break;
    case SeverityLevel.Low:
      color = "#10B981"; // Green
      break;
  }

  // Set icon based on disaster type
  switch (disasterType.toLowerCase()) {
    case "flood":
      iconHtml = "🌊";
      break;
    case "fire":
      iconHtml = "🔥";
      break;
    case "earthquake":
      iconHtml = "🏔️";
      break;
    case "storm":
      iconHtml = "🌪️";
      break;
    case "hurricane":
      iconHtml = "🌀";
      break;
    case "landslide":
      iconHtml = "🏔️";
      break;
    case "accident":
      iconHtml = "🚗";
      break;
    case "transportation accident":
      iconHtml = "🚛";
      break;
    default:
      iconHtml = "⚠️";
  }

  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">${iconHtml}</div>`,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const ReportsMapView: React.FC<ReportsMapViewProps> = ({
  reports,
  height = "600px"
}) => {
  const navigate = useNavigate();
  const [mapError, setMapError] = useState<string | null>(null);

  // Filter reports with valid coordinates
  const validReports = reports.filter(
    (report) => report.latitude && report.longitude
  );

  // Calculate center point (average of all coordinates or default)
  const getCenter = () => {
    if (validReports.length === 0) {
      return [39.8283, -98.5795]; // Center of US as default
    }

    if (validReports.length === 1) {
      return [validReports[0].latitude, validReports[0].longitude];
    }

    // Calculate average center
    const avgLat = validReports.reduce((sum, r) => sum + r.latitude, 0) / validReports.length;
    const avgLng = validReports.reduce((sum, r) => sum + r.longitude, 0) / validReports.length;

    return [avgLat, avgLng];
  };

  const center = getCenter();

  const handleMarkerClick = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  if (mapError) {
    return (
      <div
        className="w-full rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-red-600">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-xl border border-gray-200 overflow-hidden"
      style={{ height }}
    >
      <MapContainer
        center={center as [number, number]}
        zoom={validReports.length === 1 ? 12 : 4}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds to show all markers */}
        <FitBounds reports={validReports} />

        {/* Render markers for each report */}
        {validReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createCustomIcon(report.severity, report.disasterTypeName)}
            eventHandlers={{
              click: () => handleMarkerClick(report.id),
            }}
          >
            <Popup>
              <div className="max-w-xs">
                <h3 className="font-bold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {report.description}
                </p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="font-medium">Type:</span>
                    <span className="ml-1 capitalize">{report.disasterTypeName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Severity:</span>
                    <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${
                      report.severity === SeverityLevel.Critical ? 'bg-red-100 text-red-800' :
                      report.severity === SeverityLevel.High ? 'bg-orange-100 text-orange-800' :
                      report.severity === SeverityLevel.Medium ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Location:</span>
                    <span className="ml-1">{report.address}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Date:</span>
                    <span className="ml-1">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkerClick(report.id)}
                  className="mt-3 w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map overlay with statistics */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[1000]">
        <h4 className="font-semibold text-gray-900 mb-3">Map Statistics</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Reports:</span>
            <span className="font-medium">{validReports.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Critical:</span>
            <span className="font-medium text-red-600">
              {validReports.filter(r => r.severity === SeverityLevel.Critical).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">High:</span>
            <span className="font-medium text-orange-600">
              {validReports.filter(r => r.severity === SeverityLevel.High).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Medium:</span>
            <span className="font-medium text-yellow-600">
              {validReports.filter(r => r.severity === SeverityLevel.Medium).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Low:</span>
            <span className="font-medium text-green-600">
              {validReports.filter(r => r.severity === SeverityLevel.Low).length}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <h5 className="font-semibold text-gray-900 mb-3">Legend</h5>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Critical</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsMapView;
