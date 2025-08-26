import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Globe,
  AlertTriangle,
  ExternalLink,
  Activity,
  Flame,
  Waves,
  Wind,
  Mountain,
  Calendar,
  Info,
  TrendingUp
} from 'lucide-react';
import { DisasterNewsItem, disasterNewsService } from '../../services/disasterNewsService';

interface DisasterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DisasterNewsItem | null;
}

const DisasterDetailModal: React.FC<DisasterDetailModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  if (!isOpen || !item) return null;

  // Get appropriate icon for disaster type
  const getDisasterIcon = (type: DisasterNewsItem['type']) => {
    const iconProps = { size: 24, className: 'text-current' };

    switch (type) {
      case 'earthquake':
        return <Activity {...iconProps} />;
      case 'wildfire':
        return <Flame {...iconProps} />;
      case 'flood':
        return <Waves {...iconProps} />;
      case 'storm':
      case 'cyclone':
        return <Wind {...iconProps} />;
      case 'volcano':
        return <Mountain {...iconProps} />;
      default:
        return <AlertTriangle {...iconProps} />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  // Format time
  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    };
  };

  const dateTime = formatDateTime(item.timestamp);

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto modal-overlay" style={{zIndex: 99999}}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-[99998] modal-backdrop"
        onClick={onClose}
        style={{zIndex: 99998}}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 pt-8 sm:pt-12 md:pt-16 relative z-[99999] modal-dialog" style={{zIndex: 99999}}>
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto z-[99999] modal-content" style={{zIndex: 99999}}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-[100000] modal-header" style={{zIndex: 100000}}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${getSeverityColor(item.severity)}`}>
                  {getDisasterIcon(item.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    Disaster Alert Details
                  </h2>
                  <div className="flex items-center mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(item.severity)}`}>
                      {item.severity?.toUpperCase() || 'UNKNOWN'} SEVERITY
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title and Description */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                This disaster alert was reported by {item.source} and is currently being monitored by official agencies. 
                {item.severity === 'critical' && ' This is a critical event requiring immediate attention and may pose significant risk to life and property.'}
                {item.severity === 'high' && ' This is a high-priority event requiring close monitoring and potential emergency response.'}
                {item.severity === 'medium' && ' This event is being actively monitored and may develop into a more serious situation.'}
                {item.severity === 'low' && ' This is a low-priority monitoring event with minimal immediate risk.'}
              </p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              {item.location && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <MapPin size={18} className="text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900">Location</span>
                  </div>
                  <p className="text-gray-700">{item.location}</p>
                  {item.coordinates && (
                    <p className="text-sm text-gray-500 mt-1">
                      {item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              )}

              {/* Time */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock size={18} className="text-gray-600 mr-2" />
                  <span className="font-semibold text-gray-900">Date & Time</span>
                </div>
                <p className="text-gray-700">{dateTime.date}</p>
                <p className="text-sm text-gray-500">{dateTime.time}</p>
              </div>

              {/* Source */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Globe size={18} className="text-gray-600 mr-2" />
                  <span className="font-semibold text-gray-900">Source</span>
                </div>
                <p className="text-gray-700">{item.source}</p>
                <p className="text-sm text-gray-500">Official monitoring agency</p>
              </div>

              {/* Disaster Type */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Info size={18} className="text-gray-600 mr-2" />
                  <span className="font-semibold text-gray-900">Event Type</span>
                </div>
                <p className="text-gray-700 capitalize">{item.type.replace('_', ' ')}</p>
                {item.magnitude && (
                  <p className="text-sm font-medium text-red-600 mt-1">
                    Magnitude: {item.magnitude}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <TrendingUp size={18} className="text-blue-600 mr-2" />
                <span className="font-semibold text-blue-900">Alert Information</span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-blue-800">
                  <strong>Alert ID:</strong> {item.id}
                </p>
                <p className="text-blue-800">
                  <strong>Monitoring Status:</strong> Active - Real-time tracking
                </p>
                <p className="text-blue-800">
                  <strong>Data Source:</strong> {item.source} Official API
                </p>
                <p className="text-blue-800">
                  <strong>Last Updated:</strong> {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Safety Recommendations */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center mb-3">
                <AlertTriangle size={18} className="text-yellow-600 mr-2" />
                <span className="font-semibold text-yellow-900">Safety Guidelines</span>
              </div>
              <div className="text-sm text-yellow-800 space-y-1">
                {item.type === 'earthquake' && (
                  <>
                    <p>• Drop, Cover, and Hold On if shaking occurs</p>
                    <p>• Stay away from windows and heavy objects</p>
                    <p>• Be prepared for aftershocks</p>
                  </>
                )}
                {item.type === 'wildfire' && (
                  <>
                    <p>• Monitor evacuation orders in your area</p>
                    <p>• Prepare emergency kit and evacuation plan</p>
                    <p>• Avoid outdoor activities in affected areas</p>
                  </>
                )}
                {item.type === 'flood' && (
                  <>
                    <p>• Avoid driving through flooded roads</p>
                    <p>• Move to higher ground if necessary</p>
                    <p>• Stay informed about water levels</p>
                  </>
                )}
                {(item.type === 'storm' || item.type === 'cyclone') && (
                  <>
                    <p>• Secure outdoor objects and stay indoors</p>
                    <p>• Avoid windows during high winds</p>
                    <p>• Have emergency supplies ready</p>
                  </>
                )}
                {item.type === 'volcano' && (
                  <>
                    <p>• Follow evacuation orders if issued</p>
                    <p>• Avoid areas downwind of the volcano</p>
                    <p>• Protect yourself from ashfall</p>
                  </>
                )}
                <p>• Stay informed through official channels</p>
                <p>• Follow local emergency management guidance</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Information provided by {item.source}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <a
                  href={disasterNewsService.getItemUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Official Source
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterDetailModal;