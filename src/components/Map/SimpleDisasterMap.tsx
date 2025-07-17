import React, { useState } from 'react';
import { RealWorldDisaster } from '../../types';
import { format } from 'date-fns';

interface SimpleDisasterMapProps {
  disasters: RealWorldDisaster[];
  height?: string;
  className?: string;
  loading?: boolean;
}

// Simple map component without Leaflet dependency
const SimpleDisasterMap: React.FC<SimpleDisasterMapProps> = ({
  disasters,
  height = "400px",
  className = "",
  loading = false,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Get severity color
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#dc2626'; // red-600
      case 'high': return '#ea580c'; // orange-600
      case 'medium': return '#d97706'; // amber-600
      case 'low': return '#65a30d'; // lime-600
      default: return '#6b7280'; // gray-500
    }
  };

  // Get disaster icon
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

  // Convert lat/lng to pixel position (simplified projection)
  const getMarkerPosition = (lat: number, lng: number) => {
    // Simple equirectangular projection
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  if (loading) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading disaster data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Ensure disasters is an array
  const safeDisasters = Array.isArray(disasters) ? disasters : [];

  return (
    <div className={`relative ${className} group`} style={{ height }}>
      {/* World map background with more realistic styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-lg overflow-hidden transition-all duration-500 group-hover:from-slate-700 group-hover:via-slate-600 group-hover:to-slate-700">
        {/* Ocean texture */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-blue-600/10"></div>
        </div>

        {/* Continents with more realistic shapes and colors */}
        <div className="absolute inset-0">
          {/* North America */}
          <div className="absolute top-[18%] left-[12%] w-[28%] h-[35%] bg-green-700/40 rounded-2xl transform -rotate-12 shadow-lg"></div>
          <div className="absolute top-[22%] left-[16%] w-[20%] h-[25%] bg-green-600/30 rounded-xl transform -rotate-8"></div>

          {/* South America */}
          <div className="absolute top-[42%] left-[18%] w-[18%] h-[38%] bg-green-700/40 rounded-2xl transform rotate-15 shadow-lg"></div>
          <div className="absolute top-[45%] left-[20%] w-[14%] h-[30%] bg-green-600/30 rounded-xl transform rotate-12"></div>

          {/* Europe */}
          <div className="absolute top-[22%] left-[43%] w-[18%] h-[22%] bg-green-700/40 rounded-xl shadow-lg"></div>
          <div className="absolute top-[25%] left-[45%] w-[14%] h-[18%] bg-green-600/30 rounded-lg"></div>

          {/* Africa */}
          <div className="absolute top-[32%] left-[46%] w-[15%] h-[35%] bg-green-700/40 rounded-2xl shadow-lg"></div>
          <div className="absolute top-[35%] left-[48%] w-[11%] h-[28%] bg-green-600/30 rounded-xl"></div>

          {/* Asia */}
          <div className="absolute top-[18%] left-[58%] w-[30%] h-[38%] bg-green-700/40 rounded-2xl transform -rotate-3 shadow-lg"></div>
          <div className="absolute top-[22%] left-[62%] w-[24%] h-[30%] bg-green-600/30 rounded-xl transform -rotate-2"></div>

          {/* Australia */}
          <div className="absolute top-[62%] left-[73%] w-[15%] h-[18%] bg-green-700/40 rounded-xl shadow-lg"></div>
          <div className="absolute top-[64%] left-[75%] w-[11%] h-[14%] bg-green-600/30 rounded-lg"></div>
        </div>

        {/* Grid lines - more subtle and realistic */}
        <div className="absolute inset-0">
          {/* Latitude lines */}
          {[15, 30, 45, 60, 75].map(y => (
            <div key={`lat-${y}`} className="absolute w-full h-px bg-white/5" style={{ top: `${y}%` }}></div>
          ))}
          {/* Longitude lines */}
          {[15, 30, 45, 60, 75, 90].map(x => (
            <div key={`lng-${x}`} className="absolute h-full w-px bg-white/5" style={{ left: `${x}%` }}></div>
          ))}
          {/* Equator line - slightly more visible */}
          <div className="absolute w-full h-px bg-white/10" style={{ top: '50%' }}></div>
          {/* Prime meridian */}
          <div className="absolute h-full w-px bg-white/10" style={{ left: '50%' }}></div>
        </div>

        {/* Disaster markers */}
        {safeDisasters.filter(disaster =>
          disaster &&
          disaster.location &&
          disaster.location.coordinates &&
          typeof disaster.location.coordinates.lat === 'number' &&
          typeof disaster.location.coordinates.lng === 'number'
        ).map((disaster) => {
          const position = getMarkerPosition(
            disaster.location.coordinates.lat,
            disaster.location.coordinates.lng
          );
          const severity = disaster.severity || 'low';
          const color = getSeverityColor(severity);
          const icon = getDisasterIcon(disaster.disasterType || 'earthquake');
          const size = severity === 'critical' ? 32 : severity === 'high' ? 28 : 24;

          return (
            <div
              key={disaster.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
              style={{ left: position.x, top: position.y, zIndex: hoveredId === disaster.id ? 1000 : 10 }}
              onMouseEnter={() => setHoveredId(disaster.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Pulsing ring for critical disasters */}
              {severity === 'critical' && (
                <div
                  className="absolute rounded-full border-2 animate-ping"
                  style={{
                    width: size + 8,
                    height: size + 8,
                    borderColor: color,
                    top: -4,
                    left: -4,
                  }}
                ></div>
              )}

              {/* Marker */}
              <div
                className={`flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:shadow-xl ${
                  severity === 'critical' ? 'animate-pulse' : ''
                }`}
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  fontSize: size * 0.4,
                }}
              >
                {icon}
              </div>

              {/* Enhanced Tooltip */}
              {hoveredId === disaster.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 transition-all duration-300 pointer-events-none" style={{ zIndex: 1001 }}>
                <div className="bg-white/95 backdrop-blur-sm text-gray-900 text-xs rounded-xl px-4 py-3 shadow-2xl border border-gray-200/50 max-w-xs">
                  <div className="font-bold text-sm text-gray-900 mb-1">{disaster.title || 'Unknown Event'}</div>
                  <div className="text-gray-600 mb-2">{disaster.location?.place || 'Unknown Location'}</div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      {disaster.magnitude && (
                        <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                          M{disaster.magnitude}
                        </span>
                      )}
                      <span
                        className="px-2 py-1 rounded text-white font-medium"
                        style={{ backgroundColor: color }}
                      >
                        {severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mt-2">
                    {disaster.time ? format(new Date(disaster.time), 'MMM d, yyyy • HH:mm') : 'Unknown time'}
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-t-white/95"></div>
                </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Enhanced Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200/50 z-20">
          <div className="text-xs font-semibold text-gray-900 mb-3">Earthquake Severity</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-600 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Critical (7.0+)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-600 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">High (6.0+)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-amber-600 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Medium (4.5+)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-lime-600 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Low (2.5+)</span>
            </div>
          </div>
        </div>

        {/* Enhanced Info overlay */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-gray-200/50 z-20">
          <div className="text-xs">
            <div className="font-bold text-gray-900 text-sm">{safeDisasters.length} Active Earthquakes</div>
            <div className="text-gray-600 mt-1">Past 24 hours • USGS Data</div>
            <div className="text-gray-500 text-xs mt-1">Hover markers for details</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDisasterMap;
