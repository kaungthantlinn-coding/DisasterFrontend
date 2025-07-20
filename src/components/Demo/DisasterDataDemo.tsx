import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, Globe, MapPin, Clock } from 'lucide-react';
import { useDisasterData } from '../../hooks/useDisasterData';
import DisasterMap from '../Map/DisasterMap';
import { format } from 'date-fns';
import { RealWorldDisaster } from '../../types';

const DisasterDataDemo: React.FC = () => {
  const { disasters, loading, error, lastUpdated, refresh, statistics } = useDisasterData({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    includeSignificantOnly: true,
  });

  const [selectedDisaster, setSelectedDisaster] = useState<RealWorldDisaster | null>(null);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Real-World Disaster Data Integration
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Live earthquake data from USGS displayed on an interactive map
        </p>
        
        {/* Status and Refresh */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-400' : 'bg-green-400'}`}></div>
            <span className="text-sm font-medium">
              {loading ? 'Loading...' : error ? 'Error' : 'Live Data'}
            </span>
          </div>
          
          {lastUpdated && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Updated: {format(lastUpdated, 'HH:mm:ss')}</span>
            </div>
          )}
          
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{statistics.critical}</p>
                <p className="text-sm text-gray-600">Critical Events</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{statistics.high}</p>
                <p className="text-sm text-gray-600">High Severity</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalActive}</p>
                <p className="text-sm text-gray-600">Total Active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">USGS</p>
                <p className="text-sm text-gray-600">Data Source</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Disaster Map</h2>
        <DisasterMap
          disasters={disasters}
          selectedDisaster={selectedDisaster}
          onDisasterSelect={setSelectedDisaster}
          height="500px"
          showControls={true}
          loading={loading}
        />
      </div>

      {/* Disaster List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Disasters</h2>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : disasters.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {disasters.map((disaster) => (
              <div
                key={disaster.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedDisaster(disaster)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{disaster.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{disaster.location.place}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Magnitude: {disaster.magnitude}</span>
                      <span>Time: {format(disaster.time, 'MMM d, yyyy HH:mm')}</span>
                      <span>Source: {disaster.source}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    disaster.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    disaster.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    disaster.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {(disaster.severity || 'low').toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent disasters found</p>
        )}
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Sources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• USGS Earthquake API (Real-time GeoJSON feeds)</li>
              <li>• Significant earthquakes (M4.5+ or felt reports)</li>
              <li>• Updated every 5 minutes automatically</li>
              <li>• Cached for performance</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Interactive map with custom markers</li>
              <li>• Severity-based color coding</li>
              <li>• Detailed popup information</li>
              <li>• Error handling and loading states</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterDataDemo;
