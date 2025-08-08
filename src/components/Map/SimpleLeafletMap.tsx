import React, { useEffect, useRef, useState } from 'react';
import { RealWorldDisaster } from '../../types';
import { format } from 'date-fns';

interface SimpleLeafletMapProps {
  disasters: RealWorldDisaster[];
  height?: string;
  showControls?: boolean;
  className?: string;
}

const SimpleLeafletMap: React.FC<SimpleLeafletMapProps> = ({
  disasters,
  height = "400px",
  showControls = true,
  className = "",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Dynamically load Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Check if Leaflet is already loaded
        if (typeof window !== 'undefined' && (window as any).L) {
          setLeafletLoaded(true);
          return;
        }

        // Dynamically import Leaflet
        const L = await import('leaflet');
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        setLeafletLoaded(true);
      } catch (error) {
        // Failed to load Leaflet
      }
    };

    loadLeaflet();
  }, []);



  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');

        // Cleanup existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Clear container
        const container = mapRef.current!;
        if ((container as any)._leaflet_id) {
          delete (container as any)._leaflet_id;
        }

        const map = L.map(container, {
          center: [20, 0],
          zoom: 2,
          zoomControl: showControls,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsMapReady(true);

        // Add markers with enhanced styling and hover tooltips
        disasters.forEach(disaster => {
          const color = getSeverityColor(disaster.severity);
          const severity = disaster.severity || 'low'; // Default to 'low' instead of 'unknown'

          // Create beautiful custom marker
          const marker = L.marker(
            [disaster.location.coordinates.lat, disaster.location.coordinates.lng],
            { icon: createDisasterMarker(disaster) }
          ).addTo(mapInstanceRef.current!);

          // Enhanced popup content
          const popupContent = `
            <div class="p-4 max-w-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-3 h-3 rounded-full" style="background-color: ${color}"></div>
                <span class="font-semibold text-sm text-gray-900">${disaster.title || 'Unknown Event'}</span>
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-gray-500">Location:</span>
                  <span class="text-gray-700">${disaster.location?.place || 'Unknown Location'}</span>
                </div>
                ${disaster.magnitude ? `
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">Magnitude:</span>
                    <span class="font-medium text-gray-900">M${disaster.magnitude}</span>
                  </div>
                ` : ''}
                <div class="flex items-center gap-2">
                  <span class="text-gray-500">Severity:</span>
                  <span class="px-2 py-1 rounded text-white text-xs font-medium" style="background-color: ${color}">
                    ${severity.toUpperCase()}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-500">Time:</span>
                  <span class="text-gray-700">${disaster.time ? format(new Date(disaster.time), 'MMM d, yyyy • HH:mm') : 'Unknown time'}</span>
                </div>
              </div>
            </div>
          `;

          // Bind popup and tooltip
          marker.bindPopup(popupContent, {
            className: 'custom-disaster-popup',
            maxWidth: 300,
            closeButton: true,
          });

          // Add hover tooltip
          marker.bindTooltip(`
            <div class="text-center">
              <div class="font-semibold text-sm">${disaster.title || 'Unknown Event'}</div>
              <div class="text-xs text-gray-600">${disaster.magnitude ? `M${disaster.magnitude} • ` : ''}${severity.toUpperCase()}</div>
            </div>
          `, {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            className: 'custom-disaster-tooltip'
          });

          // Add hover effects
          marker.on('mouseover', function(this: any) {
            const iconElement = this.getElement();
            if (iconElement) {
              const markerDiv = iconElement.querySelector('div');
              if (markerDiv) {
                markerDiv.style.transform = 'scale(1.1)';
                markerDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
              }
            }
          });

          marker.on('mouseout', function(this: any) {
            const iconElement = this.getElement();
            if (iconElement) {
              const markerDiv = iconElement.querySelector('div');
              if (markerDiv) {
                markerDiv.style.transform = 'scale(1)';
                markerDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
              }
            }
          });
        });

      } catch (error) {
        // Error initializing map
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
      setIsMapReady(false);
    };
  }, [leafletLoaded, disasters, showControls]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  // Get disaster type icon
  const getDisasterIcon = (type: string): string => {
    switch (type?.toLowerCase()) {
      case 'earthquake': return '🌍';
      case 'tsunami': return '🌊';
      case 'volcano': return '🌋';
      case 'hurricane': case 'typhoon': case 'cyclone': return '🌀';
      case 'tornado': return '🌪️';
      case 'flood': return '💧';
      case 'wildfire': case 'fire': return '🔥';
      case 'drought': return '🏜️';
      case 'blizzard': case 'snow': return '❄️';
      case 'hail': return '🧊';
      default: return '⚠️';
    }
  };

  // Create custom marker icon
  const createDisasterMarker = (disaster: RealWorldDisaster) => {
    const L = (window as any).L;
    if (!L) return null;

    const color = getSeverityColor(disaster.severity);
    const icon = getDisasterIcon(disaster.disasterType);
    const size = disaster.severity === 'critical' ? 40 : disaster.severity === 'high' ? 35 : 30;

    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size * 0.4}px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: ${disaster.severity === 'critical' ? 'pulse 2s infinite' : 'none'};
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          ${icon}
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
      `,
      className: 'disaster-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Don't show skeleton - show map even when disasters are loading
  // if (loading) {
  //   return <DisasterMapSkeleton height={height} className={className} />;
  // }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div
        ref={mapRef}
        style={{
          height: '100%',
          width: '100%',
        }}
        className="rounded-lg overflow-hidden shadow-lg"
      />

      {(!leafletLoaded || !isMapReady) && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              {!leafletLoaded ? 'Loading map library...' : 'Initializing map...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleLeafletMap;
