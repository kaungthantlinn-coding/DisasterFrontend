import React, { useState } from 'react';
import { Calendar, MapPin, AlertTriangle, Users, Eye, Share2 } from 'lucide-react';
import { DisasterDetailModal } from './DisasterDetailModal';

interface DisasterEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  coordinates?: { lat: number; lng: number };
  startDate: string;
  endDate?: string;
  affectedPeople: number;
  status: 'Active' | 'Resolved' | 'Monitoring';
  emergencyContacts: Array<{
    name: string;
    role: string;
    phone: string;
    email?: string;
  }>;
  updates: Array<{
    id: string;
    timestamp: string;
    message: string;
    author: string;
  }>;
  resources: Array<{
    type: string;
    quantity: number;
    unit: string;
    status: 'Available' | 'Deployed' | 'Needed';
  }>;
}

interface DisasterNewsCardsProps {
  disasters?: DisasterEvent[];
  onViewDetails?: (disaster: DisasterEvent) => void;
}

export const DisasterNewsCards: React.FC<DisasterNewsCardsProps> = ({
  disasters = [],
  onViewDetails
}) => {
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data if no disasters provided
  const mockDisasters: DisasterEvent[] = [
    {
      id: '1',
      title: 'Severe Flooding in Yangon Region',
      description: 'Heavy monsoon rains have caused severe flooding across multiple townships in Yangon Region, affecting thousands of residents.',
      type: 'Flood',
      severity: 'High',
      location: 'Yangon Region, Myanmar',
      startDate: '2024-08-27T06:00:00Z',
      affectedPeople: 15000,
      status: 'Active',
      emergencyContacts: [
        { name: 'Emergency Response Team', role: 'Coordinator', phone: '+95-1-234-5678' },
        { name: 'Red Cross Myanmar', role: 'Relief Operations', phone: '+95-1-876-5432' }
      ],
      updates: [
        { id: '1', timestamp: '2024-08-27T12:00:00Z', message: 'Evacuation centers opened in 5 townships', author: 'Emergency Coordinator' },
        { id: '2', timestamp: '2024-08-27T08:00:00Z', message: 'Water levels rising in downtown areas', author: 'Field Reporter' }
      ],
      resources: [
        { type: 'Emergency Shelters', quantity: 12, unit: 'units', status: 'Available' },
        { type: 'Food Packages', quantity: 500, unit: 'packages', status: 'Deployed' },
        { type: 'Medical Supplies', quantity: 50, unit: 'kits', status: 'Needed' }
      ]
    },
    {
      id: '2',
      title: 'Earthquake in Mandalay',
      description: 'A magnitude 5.2 earthquake struck near Mandalay, causing minor structural damage and power outages.',
      type: 'Earthquake',
      severity: 'Medium',
      location: 'Mandalay, Myanmar',
      startDate: '2024-08-26T14:30:00Z',
      affectedPeople: 8500,
      status: 'Monitoring',
      emergencyContacts: [
        { name: 'Seismic Monitoring Center', role: 'Technical Lead', phone: '+95-2-345-6789' }
      ],
      updates: [
        { id: '1', timestamp: '2024-08-26T16:00:00Z', message: 'No casualties reported, assessing infrastructure', author: 'Safety Inspector' }
      ],
      resources: [
        { type: 'Engineering Teams', quantity: 3, unit: 'teams', status: 'Deployed' },
        { type: 'Emergency Generators', quantity: 15, unit: 'units', status: 'Available' }
      ]
    }
  ];

  const displayDisasters = disasters.length > 0 ? disasters : mockDisasters;

  const handleViewDetails = (disaster: DisasterEvent) => {
    setSelectedDisaster(disaster);
    setIsModalOpen(true);
    if (onViewDetails) {
      onViewDetails(disaster);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-red-600 bg-red-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      case 'Monitoring': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayDisasters.map((disaster) => (
          <div key={disaster.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(disaster.severity)}`}></div>
                  <span className="text-sm font-medium text-gray-600">{disaster.type}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(disaster.status)}`}>
                  {disaster.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{disaster.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{disaster.description}</p>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{disaster.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(disaster.startDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{disaster.affectedPeople.toLocaleString()} people affected</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-gray-600">Severity: </span>
                <span className={`font-medium ${
                  disaster.severity === 'Critical' ? 'text-red-600' :
                  disaster.severity === 'High' ? 'text-orange-600' :
                  disaster.severity === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {disaster.severity}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewDetails(disaster)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
              <span className="text-xs text-gray-500">
                {disaster.updates.length} updates
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <DisasterDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDisaster(null);
        }}
        disaster={selectedDisaster}
      />
    </>
  );
};
