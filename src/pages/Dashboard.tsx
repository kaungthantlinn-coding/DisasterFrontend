import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRoles } from '../hooks/useRoles';
import Header from '../components/Layout/Header';
import AdminDashboard from '../components/AdminDashboard';
import CjChatList from './CjChatList';
import FloatingChatButton from '../components/Chat/FloatingChatButton';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  ExternalLink, 
  CheckCircle, 
  Calendar, 
  Clock,
  Plus,
  Heart,
  MapPin
} from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}

interface ReportCardProps {
  title: string;
  description: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  date: string;
  image?: string;
  onView: () => void;
  onEdit?: () => void;
}

interface AssistanceCardProps {
  title: string;
  description: string;
  date: string;
  status?: 'Endorsed' | 'Pending';
  onView: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, bgColor, iconColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const ReportCard: React.FC<ReportCardProps> = ({ title, description, status, date, image, onView, onEdit }) => {
  const [imageError, setImageError] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {status}
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {date}
            </span>
          </div>
        </div>
        {image && !imageError && (
          <img 
            src={image} 
            alt={title} 
            className="w-16 h-16 rounded-lg object-cover ml-4 border border-gray-200" 
            onError={() => setImageError(true)}
          />
        )}
        {image && imageError && (
          <div className="w-16 h-16 rounded-lg bg-gray-100 ml-4 border border-gray-200 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={onView}
          className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md font-medium transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

const AssistanceCard: React.FC<AssistanceCardProps> = ({ title, description, date, status, onView }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="flex items-center justify-between">
          {status && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === 'Endorsed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {status === 'Endorsed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
              {status}
            </span>
          )}
          <span className="text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {date}
          </span>
        </div>
      </div>
    </div>
    <button 
      onClick={onView}
      className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md font-medium transition-colors"
    >
      <Eye className="w-4 h-4 mr-1" />
      View Report
    </button>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin } = useRoles();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reports' | 'assistance'>('reports');
  const [showChatModal, setShowChatModal] = useState(false);

  // Render admin dashboard for admin users
  if (isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminDashboard />
      </div>
    );
  }

  // Mock data - replace with real data from API
  const stats = {
    reportsSubmitted: 2,
    verifiedReports: 2,
    assistanceProvided: 2
  };

  const myReports = [
    {
      id: 1,
      title: 'Flooding in Downtown District',
      description: 'Severe flooding has affected multiple residential areas after heavy rainfall. Water levels reached 3-4 feet in some streets, making them...',
      status: 'Verified' as const,
      date: 'Jan 15, 2024',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=64&h=64&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Wildfire Damage Assessment',
      description: 'Fast-moving wildfire has damaged several residential properties and threatens surrounding forest areas.',
      status: 'Verified' as const,
      date: 'Jan 12, 2024',
      image: 'https://images.unsplash.com/photo-1574482620881-2f235c4e6d9d?w=64&h=64&fit=crop&crop=center'
    }
  ];

  const myAssistance = [
    {
      id: 1,
      title: 'Flooding in Downtown District',
      description: 'Provided emergency shelter coordination with Red Cross. Secured temporary housing for 8 families.',
      date: 'Jan 16, 2024',
      status: 'Endorsed' as const
    },
    {
      id: 2,
      title: 'Wildfire Damage Assessment',
      description: 'Coordinated evacuation transportation for 5 elderly residents.',
      date: 'Jan 13, 2024'
    }
  ];

  const assistanceReceived = [
    {
      id: 1,
      organization: 'Red Cross',
      type: 'Emergency Supplies',
      date: '16/01/2024',
      status: 'Endorsed' as const
    },
    {
      id: 2,
      organization: 'Local Volunteers',
      type: 'Cleanup Help',
      date: '18/01/2024'
    }
  ];

  // Show user dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-spacing pb-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
              <p className="text-gray-600 mt-1">Manage your reports and assistance activities</p>
            </div>
            <Link 
              to="/report/new"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Report
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            title="Reports Submitted"
            value={stats.reportsSubmitted}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Verified Reports"
            value={stats.verifiedReports}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            title="Assistance Provided"
            value={stats.assistanceProvided}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Activity</h2>
              <p className="text-sm text-gray-600">Track your disaster reports and assistance provided to the community.</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Reports
              </button>
              <button
                onClick={() => setActiveTab('assistance')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'assistance'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Assistance
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Reports I've Submitted</h3>
                  <Link 
                    to="/report/new"
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
                  >
                    Create New
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {myReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      title={report.title}
                      description={report.description}
                      status={report.status}
                      date={report.date}
                      image={report.image}
                      onView={() => {
                        // Navigate to report detail page
                        navigate(`/reports/${report.id}`);
                      }}
                      onEdit={() => {
                        // Navigate to edit report page
                        navigate(`/report/edit/${report.id}`);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assistance' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Assistance I've Provided</h3>
                  <button 
                    onClick={() => navigate('/reports')}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center hover:bg-red-50 px-2 py-1 rounded transition-colors"
                  >
                    Help Others
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-4 mb-8">
                  {myAssistance.map((assistance) => (
                    <AssistanceCard
                      key={assistance.id}
                      title={assistance.title}
                      description={assistance.description}
                      date={assistance.date}
                      status={assistance.status}
                      onView={() => {
                        // Navigate to assistance detail page
                        navigate(`/assistance/${assistance.id}`);
                      }}
                    />
                  ))}
                </div>

                {/* Assistance Received Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assistance Received - Flood in Sacramento County, CA</h3>
                  <div className="space-y-3">
                    {assistanceReceived.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="font-medium text-gray-900">{item.organization}</div>
                            <div className="text-sm text-gray-600">{item.type}</div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {item.date}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {item.status && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'Endorsed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status === 'Endorsed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                              {item.status}
                            </span>
                          )}
                          <button 
                            onClick={() => {
                              if (item.status === 'Endorsed') {
                                // Navigate to assistance received detail
                                navigate(`/assistance/received/${item.id}`);
                              } else {
                                // Handle endorsement logic
                                alert('Endorsement functionality will be implemented');
                              }
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 hover:bg-blue-50 rounded transition-colors"
                          >
                            {item.status === 'Endorsed' ? 'View Report' : 'Endorse'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showChatModal && (
        <CjChatList onClose={() => setShowChatModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;