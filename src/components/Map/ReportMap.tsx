import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Report, RealWorldDisaster } from '../../types';
import { format } from 'date-fns';
import { Crosshair, Plus, Minus } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Severity color mapping for reports
const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical': return '#dc2626'; // red-600
    case 'high': return '#ea580c'; // orange-600
    case 'medium': return '#d97706'; // amber-600
    case 'low': return '#65a30d'; // lime-600
    default: return '#6b7280'; // gray-500
  }
};

// Disaster type icon mapping
const getDisasterIcon = (type: string): string => {
  switch (type) {
    case 'earthquake': return '🌍';
    case 'flood': return '🌊';
    case 'fire': return '🔥';
    case 'storm': return '⛈️';
    case 'landslide': return '⛰️';
    case 'accident': return '🚨';
    default: return '⚠️';
  }
};

// Get default image for disaster type
const getDefaultImage = (disasterType: string): string => {
  const baseUrl = '/images/disasters';
  switch (disasterType) {
    case 'flood': return `${baseUrl}/flood-default.jpg`;
    case 'fire': return `${baseUrl}/fire-default.jpg`;
    case 'earthquake': return `${baseUrl}/earthquake-default.jpg`;
    case 'storm': return `${baseUrl}/storm-default.jpg`;
    case 'landslide': return `${baseUrl}/landslide-default.jpg`;
    case 'accident': return `${baseUrl}/accident-default.jpg`;
    default: return `${baseUrl}/disaster-default.jpg`;
  }
};

// Create custom report marker with image
const createReportMarker = (report: Report): L.DivIcon => {
  const color = getSeverityColor(report.severity);
  const icon = getDisasterIcon(report.disasterType);
  const imageUrl = report.photos && report.photos.length > 0 ? report.photos[0] : getDefaultImage(report.disasterType);
  const size = 50;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        position: relative;
        cursor: pointer;
      ">
        <div style="
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid ${color};
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          overflow: hidden;
          position: relative;
        ">
          <img
            src="${imageUrl}"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
            "
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${color};
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border-radius: 50%;
          ">
            ${icon}
          </div>
        </div>
        <div style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          background: ${color};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          ${icon}
        </div>
      </div>
    `,
    className: 'report-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

interface ReportMapProps {
  reports: Report[];
  selectedReport?: Report | null;
  onReportSelect?: (report: Report) => void;
  onLoad?: () => void;
  height?: string;
  realWorldDisasters?: RealWorldDisaster[];
  showRealWorldData?: boolean;
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
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Map initialization
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    setIsMapLoading(true);
    setMapError(null);

    // Add a small delay to ensure DOM is ready
    const initializeMap = () => {
      try {
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
          setIsMapLoading(false);
          map.scrollWheelZoom.enable();

          // Invalidate size to ensure proper rendering
          setTimeout(() => {
            map.invalidateSize();
          }, 100);

          // Set up resize observer
          if (mapRef.current && window.ResizeObserver) {
            resizeObserverRef.current = new ResizeObserver(() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
              }
            });
            resizeObserverRef.current.observe(mapRef.current);
          }

          // Call onLoad callback when map is ready
          if (onLoad) {
            onLoad();
          }
        });
      } catch (error) {
        console.error('ReportMap: Error initializing map:', error);
        setMapError(error instanceof Error ? error.message : 'Failed to initialize map');
        setIsMapLoading(false);
      }
    };

    // Initialize map with a small delay
    const timeoutId = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers for reports
  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers with custom image pins
    reports.forEach((report) => {
      const marker = L.marker(
        [report.location.coordinates.lat, report.location.coordinates.lng],
        { icon: createReportMarker(report) }
      );
      
      // Create enhanced popup content with image
      const imageUrl = report.photos && report.photos.length > 0 ? report.photos[0] : getDefaultImage(report.disasterType);
      const severityColor = getSeverityColor(report.severity);
      const disasterIcon = getDisasterIcon(report.disasterType);

      const popupContent = `
        <div class="p-0 max-w-sm overflow-hidden">
          <!-- Image Header -->
          <div class="relative h-32 bg-gray-100">
            <img
              src="${imageUrl}"
              alt="${report.title}"
              class="w-full h-full object-cover"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center text-white text-2xl" style="display: none;">
              ${disasterIcon}
            </div>
            <div class="absolute top-2 right-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white" style="background-color: ${severityColor};">
                ${report.severity.toUpperCase()}
              </span>
            </div>
            ${report.photos && report.photos.length > 1 ? `
              <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                📷 ${report.photos.length} photos
              </div>
            ` : ''}
          </div>

          <!-- Content -->
          <div class="p-4">
            <div class="flex items-start space-x-3 mb-3">
              <div class="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style="background-color: ${severityColor};"></div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-sm leading-tight mb-1">${report.title}</h3>
                <p class="text-xs text-gray-600 mb-2 flex items-center">
                  📍 ${report.location.address}
                </p>
                <p class="text-xs text-gray-700 line-clamp-3">${report.description}</p>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div class="text-xs text-gray-500">
                📅 ${format(report.createdAt, 'MMM d, yyyy')}
              </div>
              <button
                class="view-details-btn bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                data-report-id="${report.id}"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-report-popup',
        maxWidth: 320,
        closeButton: true,
        autoPan: true,
      });

      // Add hover tooltip
      marker.bindTooltip(`
        <div class="text-center">
          <div class="font-semibold text-sm">${report.title}</div>
          <div class="text-xs text-gray-600">${report.severity.toUpperCase()} • ${format(report.createdAt, 'MMM d')}</div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        offset: [0, -25],
        className: 'custom-report-tooltip'
      });

      // Add hover effects
      marker.on('mouseover', function() {
        const iconElement = this.getElement();
        if (iconElement) {
          iconElement.style.transform = 'scale(1.1)';
          iconElement.style.zIndex = '1000';
          iconElement.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))';
        }
      });

      marker.on('mouseout', function() {
        const iconElement = this.getElement();
        if (iconElement) {
          iconElement.style.transform = 'scale(1)';
          iconElement.style.zIndex = '400';
          iconElement.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))';
        }
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
      {/* Loading overlay */}
      {isMapLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {mapError && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-20 rounded-xl border border-red-200">
          <div className="text-center p-6">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-sm text-red-600 font-medium mb-2">Map Error</p>
            <p className="text-xs text-red-500">{mapError}</p>
          </div>
        </div>
      )}

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
          height: height === '100%' ? '100%' : height,
          width: '100%',
          touchAction: 'pan-x pan-y',
          zIndex: 1,
          minHeight: height === '100%' ? '400px' : '600px'
        }}
        className="rounded-xl border border-gray-200 relative bg-gray-100"
        onWheel={(e) => {
          // Prevent page scroll when zooming on map
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default ReportMap;
