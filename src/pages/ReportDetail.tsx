import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Heart, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { mockReports } from '../data/mockData';
import { format } from 'date-fns';
import ReportMap from '../components/Map/ReportMap';

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [assistanceText, setAssistanceText] = useState('');
  const [showAssistanceForm, setShowAssistanceForm] = useState(false);

  const getDefaultImage = (type: string) => {
    const defaultImages = {
      flood: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
      fire: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg',
      earthquake: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg',
      storm: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg',
      default: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg'
    };
    return defaultImages[type as keyof typeof defaultImages] || defaultImages.default;
  };

  const report = mockReports.find(r => r.id === id);

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Report Not Found</h1>
          <Link to="/" className="text-red-600 hover:text-red-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleOfferAssistance = () => {
    if (!assistanceText.trim()) return;

    // Here you would normally make an API call
    console.log('Offering assistance:', assistanceText);
    setAssistanceText('');
    setShowAssistanceForm(false);
    alert('Thank you for offering assistance! Your offer has been recorded.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-red-600 hover:text-red-700 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {report.location.address}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {format(report.createdAt, 'MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      {report.reporterName}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.status === 'verified' ? 'bg-green-100 text-green-800' :
                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {report.disasterDetail}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {report.disasterType}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed">{report.description}</p>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
              <div className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={report.photos.length > 0 ? report.photos[selectedPhotoIndex] : getDefaultImage(report.disasterType)}
                    alt={`${report.title} - Photo ${selectedPhotoIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {report.photos.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {report.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhotoIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedPhotoIndex === index ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <ReportMap reports={[report]} height="300px" />
            </div>

            {/* Assistance Log */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Assistance Provided</h2>
              {report.assistanceLog.length > 0 ? (
                <div className="space-y-4">
                  {report.assistanceLog.map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{entry.providerName}</span>
                          <span className="text-sm text-gray-500">
                            {format(entry.createdAt, 'MMM d, yyyy')}
                          </span>
                          {entry.endorsed && (
                            <CheckCircle size={16} className="text-green-600" />
                          )}
                        </div>
                        <p className="text-gray-700">{entry.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No assistance has been provided yet.</p>
                  <p className="text-sm">Be the first to help this community!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assistance Needed */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assistance Needed</h3>
              <div className="space-y-2 mb-4">
                {report.assistanceNeeded.map((need, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Clock size={16} className="mr-2 text-red-500" />
                    {need}
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {report.assistanceDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAssistanceForm(!showAssistanceForm)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center font-medium"
                >
                  <Heart size={20} className="mr-2" />
                  Offer Assistance
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center font-medium">
                  <MessageCircle size={20} className="mr-2" />
                  Contact Reporter
                </button>
              </div>

              {showAssistanceForm && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe the assistance you can provide:
                  </label>
                  <textarea
                    value={assistanceText}
                    onChange={(e) => setAssistanceText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={4}
                    placeholder="I can help with..."
                  />
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={handleOfferAssistance}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Submit Offer
                    </button>
                    <button
                      onClick={() => setShowAssistanceForm(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help CTA for non-logged users */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Want to Help?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Join our community to offer assistance and connect with those in need.
              </p>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
              >
                Join to Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
