import React from 'react';
import { X, Calendar, MapPin, AlertTriangle, Users, Phone, ExternalLink } from 'lucide-react';

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

interface DisasterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  disaster: DisasterEvent | null;
}

export const DisasterDetailModal: React.FC<DisasterDetailModalProps> = ({
  isOpen,
  onClose,
  disaster
}) => {
  if (!isOpen || !disaster) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Monitoring': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{disaster.title}</h2>
              <p className="text-sm text-gray-600">{disaster.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Status and Severity */}
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(disaster.status)}`}>
                {disaster.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(disaster.severity)}`}>
                {disaster.severity} Severity
              </span>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{disaster.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Start Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(disaster.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Affected People</p>
                    <p className="text-sm text-gray-600">{disaster.affectedPeople.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{disaster.description}</p>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {disaster.emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-600">{contact.role}</p>
                        <p className="text-sm text-blue-600">{contact.phone}</p>
                        {contact.email && (
                          <p className="text-sm text-gray-600">{contact.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resources</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Type</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Quantity</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {disaster.resources.map((resource, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-gray-900">{resource.type}</td>
                        <td className="px-4 py-2 text-gray-600">
                          {resource.quantity} {resource.unit}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            resource.status === 'Available' ? 'bg-green-100 text-green-800' :
                            resource.status === 'Deployed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {resource.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Updates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Updates</h3>
              <div className="space-y-3">
                {disaster.updates.map((update) => (
                  <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{update.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{update.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
