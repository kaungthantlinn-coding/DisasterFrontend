import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RealWorldDisaster } from '../../types';
import { format } from 'date-fns';
import DisasterMapSkeleton from '../Loading/DisasterMapSkeleton';

// Fix for default markers in Leaflet with updated CDN URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DisasterMapProps {
  disasters: RealWorldDisaster[];
  selectedDisaster?: RealWorldDisaster | null;
  onDisasterSelect?: (disaster: RealWorldDisaster) => void;
  height?: string;
  showControls?: boolean;
  className?: string;
  loading?: boolean;
}

// Severity color mapping
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
    case 'hurricane': return '🌀';
    case 'wildfire': return '🔥';
    case 'storm': return '⛈️';
    case 'tsunami': return '🌊';
    case 'volcano': return '🌋';
    default: return '⚠️';
  }
};

// Create custom marker icon
const createDisasterMarker = (disaster: RealWorldDisaster): L.DivIcon => {
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

const DisasterMap: React.FC<DisasterMapProps> = ({
  disasters,
  selectedDisaster,
  onDisasterSelect,
  height = "400px",
  showControls = true,
  className = "",
  loading = false,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      console.log('Map ref not available');
      return;
    }

    // Clear any existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    console.log('Initializing map...');

    // Add a small delay to ensure DOM is ready
    const initializeMap = () => {
      try {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current, {
          center: [20, 0],
          zoom: 2,
          zoomControl: showControls,
          attributionControl: true,
        });

        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
          minZoom: 1,
        }).addTo(map);

        // Set map as ready immediately after tile layer is added
        console.log('Map initialized successfully');
        setIsMapReady(true);

        // Force resize after a short delay
        setTimeout(() => {
          if (map && mapRef.current) {
            map.invalidateSize();
          }
        }, 100);

      } catch (error) {
        console.error('Error initializing map:', error);
        setIsMapReady(false);
      }
    };

    // Initialize with a small delay
    const timeoutId = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timeoutId);
      if (mapInstanceRef.current) {
        console.log('Cleaning up map');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [showControls]);

  // Update markers when disasters change
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    disasters.forEach(disaster => {
      const marker = L.marker(
        [disaster.location.coordinates.lat, disaster.location.coordinates.lng],
        { icon: createDisasterMarker(disaster) }
      );

      // Create popup content
      const popupContent = `
        <div class="disaster-popup" style="min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="border-bottom: 2px solid ${getSeverityColor(disaster.severity)}; padding-bottom: 8px; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${getDisasterIcon(disaster.disasterType)} ${disaster.title}
            </h3>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <span style="
                background-color: ${getSeverityColor(disaster.severity)};
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
              ">
                ${disaster.severity}
              </span>
              ${disaster.magnitude ? `<span style="font-size: 14px; font-weight: 500;">M${disaster.magnitude}</span>` : ''}
              ${disaster.alertLevel ? `<span style="
                background-color: ${disaster.alertLevel === 'red' ? '#dc2626' : disaster.alertLevel === 'orange' ? '#ea580c' : disaster.alertLevel === 'yellow' ? '#d97706' : '#65a30d'};
                color: white;
                padding: 2px 6px;
                border-radius: 8px;
                font-size: 11px;
                text-transform: uppercase;
              ">${disaster.alertLevel}</span>` : ''}
            </div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.4;">
              ${disaster.description}
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 12px;">
            <div>
              <strong style="color: #374151;">Location:</strong><br>
              <span style="color: #6b7280;">${disaster.location.place}</span>
            </div>
            <div>
              <strong style="color: #374151;">Time:</strong><br>
              <span style="color: #6b7280;">${format(disaster.time, 'MMM d, yyyy HH:mm')}</span>
            </div>
            ${disaster.depth ? `
            <div>
              <strong style="color: #374151;">Depth:</strong><br>
              <span style="color: #6b7280;">${disaster.depth.toFixed(1)} km</span>
            </div>
            ` : ''}
            ${disaster.felt ? `
            <div>
              <strong style="color: #374151;">Felt Reports:</strong><br>
              <span style="color: #6b7280;">${disaster.felt} people</span>
            </div>
            ` : ''}
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #e5e7eb;">
            <div style="font-size: 11px; color: #9ca3af;">
              Source: ${disaster.source}
            </div>
            ${disaster.url ? `
            <a href="${disaster.url}" target="_blank" rel="noopener noreferrer" style="
              background-color: #3b82f6;
              color: white;
              padding: 4px 12px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 12px;
              font-weight: 500;
            ">
              View Details
            </a>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-disaster-popup',
        maxWidth: 320,
        closeButton: true,
      });

      // Add hover tooltip
      marker.bindTooltip(`
        <div class="text-center">
          <div class="font-semibold text-sm">${disaster.title}</div>
          <div class="text-xs text-gray-600">${disaster.magnitude ? `M${disaster.magnitude} • ` : ''}${(disaster.severity || 'low').toUpperCase()}</div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        offset: [0, -20],
        className: 'custom-disaster-tooltip'
      });

      // Add hover effects
      marker.on('mouseover', function() {
        const iconElement = this.getElement();
        if (iconElement) {
          const markerDiv = iconElement.querySelector('div');
          if (markerDiv) {
            markerDiv.style.transform = 'scale(1.1)';
            markerDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
          }
        }
      });

      marker.on('mouseout', function() {
        const iconElement = this.getElement();
        if (iconElement) {
          const markerDiv = iconElement.querySelector('div');
          if (markerDiv) {
            markerDiv.style.transform = 'scale(1)';
            markerDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          }
        }
      });

      // Add click handler
      marker.on('click', () => {
        if (onDisasterSelect) {
          onDisasterSelect(disaster);
        }
      });

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });

    // Fit map to show all disasters if there are any
    if (disasters.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds(), { 
        padding: [20, 20],
        maxZoom: 10 
      });
    }
  }, [disasters, isMapReady, onDisasterSelect]);

  // Handle selected disaster
  useEffect(() => {
    if (selectedDisaster && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [selectedDisaster.location.coordinates.lat, selectedDisaster.location.coordinates.lng],
        8
      );
    }
  }, [selectedDisaster]);

  // Show skeleton only while loading data, not while map is initializing
  if (loading) {
    return <DisasterMapSkeleton height={height} className={className} />;
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div
        ref={mapRef}
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
        className="rounded-lg overflow-hidden shadow-lg"
      />

      {/* Map initialization loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Initializing map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterMap;
