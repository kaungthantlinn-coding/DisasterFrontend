import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Report } from '../../types';
import { format } from 'date-fns';
import { Crosshair, Plus, Minus } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ReportMapProps {
  reports: Report[];
  selectedReport?: Report | null;
  onReportSelect?: (report: Report) => void;
  onLoad?: () => void;
  height?: string;
}

const ReportMap: React.FC<ReportMapProps> = ({
  reports,
  selectedReport,
  onReportSelect,
  onLoad,
  height = "400px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Map initialization
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [39.8283, -98.5795],
      zoom: 4,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      zoomControl: true,
      attributionControl: true,
      fadeAnimation: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 1,
    }).addTo(map);

    // Ensure scroll wheel zoom is enabled after map is fully loaded
    map.whenReady(() => {
      map.scrollWheelZoom.enable();
      // Call onLoad callback when map is ready
      if (onLoad) {
        onLoad();
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers for reports
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    reports.forEach(report => {
      const marker = L.marker([report.location.coordinates.lat, report.location.coordinates.lng]);
      
      // Create custom popup content
      const popupContent = `
        <div class="p-4 max-w-sm">
          <div class="flex items-start space-x-3 mb-3">
            <div class="w-3 h-3 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 text-sm leading-tight mb-1">${report.title}</h3>
              <p class="text-xs text-gray-600 mb-2">${report.location.address}</p>
              <p class="text-xs text-gray-700 line-clamp-3">${report.description}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="text-xs text-gray-500">
              ${format(report.createdAt, 'MMM d, yyyy')}
            </div>
            <button 
              class="view-details-btn bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              data-report-id="${report.id}"
            >
              View Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 300,
        closeButton: true,
      });

      // Add click handler for view details button
      marker.on('popupopen', () => {
        const popup = marker.getPopup();
        if (popup && popup.getElement()) {
          const viewBtn = popup.getElement()?.querySelector('.view-details-btn') as HTMLButtonElement;
          if (viewBtn) {
            viewBtn.onclick = () => {
              if (onReportSelect) {
                onReportSelect(report);
              }
            };
          }
        }
      });

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });
  }, [reports, onReportSelect]);

  // Handle selected report
  useEffect(() => {
    if (selectedReport && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [selectedReport.location.coordinates.lat, selectedReport.location.coordinates.lng],
        10
      );
    }
  }, [selectedReport]);

  // Get current location with improved error handling
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 10);
        }
      },
      (error) => {
        // Silently handle geolocation errors to avoid console spam
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.warn('Geolocation permission denied by user.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.warn('Geolocation position unavailable.');
            break;
          case error.TIMEOUT:
            console.warn('Geolocation request timed out.');
            break;
          default:
            console.warn('An unknown geolocation error occurred.');
            break;
        }
      },
      {
        timeout: 10000, // 10 seconds timeout
        enableHighAccuracy: false, // Use less accurate but faster positioning
        maximumAge: 300000 // Accept cached position up to 5 minutes old
      }
    );
  };

  // Manual zoom functions
  const zoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative z-0">
      {/* Current location indicator */}
      {currentLocation && (
        <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Crosshair size={14} />
            <span>Your Location</span>
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        {/* Zoom controls */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={zoomIn}
            className="w-10 h-10 bg-white text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-200 flex items-center justify-center"
            title="Zoom in"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={zoomOut}
            className="w-10 h-10 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
            title="Zoom out"
          >
            <Minus size={16} />
          </button>
        </div>

        {/* Location button */}
        <button
          onClick={getCurrentLocation}
          className="w-10 h-10 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          title="Get current location"
        >
          <Crosshair size={16} />
        </button>
      </div>

      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          height,
          width: '100%',
          touchAction: 'pan-x pan-y',
          zIndex: 1
        }}
        className="rounded-xl border border-gray-200 relative"
        onWheel={(e) => {
          // Prevent page scroll when zooming on map
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default ReportMap;
