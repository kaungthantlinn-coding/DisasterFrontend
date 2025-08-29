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

// Create enhanced report marker with modern styling
const createEnhancedReportMarker = (report: Report): L.DivIcon => {
  const color = getSeverityColor(report.severity);
  const icon = getDisasterIcon(report.disasterType);
  const severity = report.severity;

  // Enhanced size hierarchy for better visual distinction
  const getMarkerSize = (severity: string) => {
    switch (severity) {
      case 'critical': return { outer: 56, inner: 48, pulse: 64 };
      case 'high': return { outer: 48, inner: 40, pulse: 56 };
      case 'medium': return { outer: 42, inner: 34, pulse: 50 };
      case 'low': return { outer: 36, inner: 28, pulse: 44 };
      default: return { outer: 36, inner: 28, pulse: 44 };
    }
  };

  // Enhanced color system with gradients and blue theme integration
  const getEnhancedColors = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          primary: '#dc2626',
          secondary: '#ef4444',
          gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
          shadow: 'rgba(220, 38, 38, 0.4)',
          glow: 'rgba(220, 38, 38, 0.6)'
        };
      case 'high':
        return {
          primary: '#ea580c',
          secondary: '#f97316',
          gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
          shadow: 'rgba(234, 88, 12, 0.4)',
          glow: 'rgba(234, 88, 12, 0.6)'
        };
      case 'medium':
        return {
          primary: '#2563eb',
          secondary: '#3b82f6',
          gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
          shadow: 'rgba(37, 99, 235, 0.4)',
          glow: 'rgba(37, 99, 235, 0.6)'
        };
      case 'low':
        return {
          primary: '#059669',
          secondary: '#10b981',
          gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
          shadow: 'rgba(5, 150, 105, 0.4)',
          glow: 'rgba(5, 150, 105, 0.6)'
        };
      default:
        return {
          primary: '#6b7280',
          secondary: '#9ca3af',
          gradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)',
          shadow: 'rgba(107, 114, 128, 0.4)',
          glow: 'rgba(107, 114, 128, 0.6)'
        };
    }
  };

  const sizes = getMarkerSize(severity);
  const colors = getEnhancedColors(severity);
  const isPulse = severity === 'critical';

  return L.divIcon({
    html: `
      <div class="enhanced-marker-container" style="
        position: relative;
        width: ${sizes.outer}px;
        height: ${sizes.outer}px;
        cursor: pointer;
        transform-origin: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      ">
        ${isPulse ? `
          <div class="pulse-ring" style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${sizes.pulse}px;
            height: ${sizes.pulse}px;
            transform: translate(-50%, -50%);
            border: 2px solid ${colors.primary};
            border-radius: 50%;
            opacity: 0;
            animation: pulse-animation 2s infinite;
          "></div>
        ` : ''}

        <div class="marker-main" style="
          position: relative;
          width: ${sizes.outer}px;
          height: ${sizes.outer}px;
          background: ${colors.gradient};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow:
            0 4px 12px ${colors.shadow},
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        ">
          <div class="marker-icon" style="
            font-size: ${Math.floor(sizes.inner * 0.5)}px;
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
            transition: all 0.3s ease;
          ">
            ${icon}
          </div>

          <div class="severity-indicator" style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 16px;
            height: 16px;
            background: ${colors.primary};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            color: white;
            font-weight: bold;
          ">
            ${severity.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <style>
        @keyframes pulse-animation {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        .enhanced-marker-container:hover .marker-main {
          transform: scale(1.15);
          box-shadow:
            0 8px 24px ${colors.shadow},
            0 4px 8px rgba(0, 0, 0, 0.15),
            0 0 0 4px ${colors.glow}33,
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .enhanced-marker-container:hover .marker-icon {
          transform: scale(1.1);
        }

        .enhanced-marker-container:focus-within .marker-main {
          outline: 3px solid ${colors.primary};
          outline-offset: 2px;
        }
      </style>
    `,
    className: 'enhanced-report-marker',
    iconSize: [sizes.outer, sizes.outer],
    iconAnchor: [sizes.outer / 2, sizes.outer / 2],
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
  const activeTooltipRef = useRef<L.Tooltip | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
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
          setIsMapReady(true);
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
      setIsMapReady(false);
    };
  }, []);

  // Add enhanced markers for reports with new styling system
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) {
      return;
    }

    // Clear existing markers and tooltips
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Clear any active tooltip
    if (activeTooltipRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.closeTooltip(activeTooltipRef.current);
      activeTooltipRef.current = null;
    }

    // Add new enhanced markers with modern styling
    reports.forEach((report) => {
      const marker = L.marker(
        [report.location.coordinates.lat, report.location.coordinates.lng],
        { icon: createEnhancedReportMarker(report) }
      );

      // Add enhanced popup content
      const popupContent = `
        <div class="enhanced-popup" style="
          max-width: 320px;
          font-family: system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        ">
          <div style="
            padding: 20px;
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            text-align: center;
          ">
            <div style="font-size: 24px; margin-bottom: 8px;">${getDisasterIcon(report.disasterType)}</div>
            <h3 style="
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              line-height: 1.3;
            ">${report.title}</h3>
            <div style="
              margin-top: 8px;
              padding: 4px 12px;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 20px;
              font-size: 12px;
              font-weight: 500;
              display: inline-block;
            ">
              ${report.severity.toUpperCase()}
            </div>
          </div>

          <div style="padding: 20px;">
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;
              color: #64748b;
              font-size: 14px;
            ">
              <span>📍</span>
              <span>${report.location.address}</span>
            </div>

            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;
              color: #64748b;
              font-size: 14px;
            ">
              <span>📅</span>
              <span>${format(report.createdAt, 'MMM d, yyyy • HH:mm')}</span>
            </div>

            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 16px;
              color: #64748b;
              font-size: 14px;
            ">
              <span>👤</span>
              <span>${report.reportedBy}</span>
            </div>

            ${report.description ? `
              <p style="
                margin: 0 0 16px 0;
                color: #475569;
                font-size: 14px;
                line-height: 1.5;
              ">${report.description.substring(0, 120)}${report.description.length > 120 ? '...' : ''}</p>
            ` : ''}

            <button
              class="view-details-btn"
              style="
                width: 100%;
                padding: 12px 16px;
                background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              "
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 8px 12px -1px rgba(0, 0, 0, 0.15)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'"
              data-report-id="${report.id}"
            >
              View Full Report →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'enhanced-report-popup',
        maxWidth: 340,
        closeButton: true,
        autoPan: true,
        offset: [0, -10]
      });

      // Add enhanced hover effects with manual tooltip management
      marker.on('mouseover', function() {
        const iconElement = this.getElement();
        if (iconElement) {
          iconElement.style.zIndex = '1000';
        }

        // Close any existing tooltip first
        if (activeTooltipRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.closeTooltip(activeTooltipRef.current);
          activeTooltipRef.current = null;
        }

        // Create and show new enhanced tooltip
        if (mapInstanceRef.current) {
          const tooltipContent = `
            <div style="
              text-align: center;
              padding: 8px 12px;
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
              color: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              font-family: system-ui, -apple-system, sans-serif;
            ">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${report.title}</div>
              <div style="font-size: 12px; opacity: 0.9;">
                ${report.severity.toUpperCase()} • ${format(report.createdAt, 'MMM d')}
              </div>
            </div>
          `;

          const tooltip = L.tooltip({
            permanent: false,
            direction: 'top',
            offset: [0, -15],
            className: 'enhanced-report-tooltip'
          })
          .setContent(tooltipContent)
          .setLatLng([report.location.coordinates.lat, report.location.coordinates.lng]);

          tooltip.addTo(mapInstanceRef.current);
          activeTooltipRef.current = tooltip;
        }
      });

      marker.on('mouseout', function() {
        const iconElement = this.getElement();
        if (iconElement) {
          iconElement.style.zIndex = '400';
        }

        // Close tooltip on mouseout
        if (activeTooltipRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.closeTooltip(activeTooltipRef.current);
          activeTooltipRef.current = null;
        }
      });

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });

    // Fit map to show all disasters if there are any
    if (disasters.length > 0 && markersRef.current.length > 0) {
      try {
        const group = new L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      } catch (error) {
        // Silently handle bounds fitting errors
      }
    }
  }, [reports, onReportSelect, isMapReady]);

  // Handle selected report with improved error handling
  useEffect(() => {
    if (selectedReport && mapInstanceRef.current && isMapReady) {
      // Add a small delay to ensure map is fully ready
      const timer = setTimeout(() => {
        if (mapInstanceRef.current) {
          try {
            // Check if map container exists and is properly initialized
            const container = mapInstanceRef.current.getContainer();
            if (!container || !container.offsetParent) {
              return;
            }

            // Use setView without animation to avoid positioning errors
            mapInstanceRef.current.setView(
              [selectedReport.location.coordinates.lat, selectedReport.location.coordinates.lng],
              10,
              { animate: false } // Disable animation to prevent _leaflet_pos errors
            );
          } catch (error) {
            // Silently handle Leaflet positioning errors
          }
        }
      }, 100); // Small delay to ensure map is ready

      return () => clearTimeout(timer);
    }
  }, [selectedReport, isMapReady]);

  // Get current location with improved error handling
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          try {
            // Check if map container exists and is properly initialized
            const container = mapInstanceRef.current.getContainer();
            if (!container || !container.offsetParent) {
              return;
            }

            mapInstanceRef.current.setView([latitude, longitude], 10, { animate: false });
          } catch (error) {
            // Silently handle Leaflet positioning errors
          }
        }
      },
      (error) => {
        // Silently handle geolocation errors to avoid console spam
        switch (error.code) {
          case error.PERMISSION_DENIED:
            break;
          case error.POSITION_UNAVAILABLE:
            break;
          case error.TIMEOUT:
            break;
          default:
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
