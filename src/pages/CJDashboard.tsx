import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Eye,
  Filter,
  Search,
  MapPin,
  ArrowRight,
  Shield,
  Activity,
  Heart,
  Globe,
  RefreshCw,
  Bell,
  Settings,
  Download,
  FileText,
  Zap,
  Target,
  Award,
  Star,
  Plus,
  ExternalLink,
  Clock,
  Menu,
  X,
  ChevronDown,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const CJDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'response' | 'analytics'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for CJ Dashboard
  const dashboardStats = [
    { icon: AlertTriangle, value: '47', label: 'Active Incidents', change: '+12%', color: 'from-red-500 to-red-600', bgColor: 'from-red-50 to-red-100' },
    { icon: Users, value: '2,847', label: 'People Affected', change: '+8%', color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
    { icon: Shield, value: '156', label: 'Response Teams', change: '+5%', color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100' },
    { icon: CheckCircle, value: '89', label: 'Resolved Today', change: '+23%', color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' }
  ];

  const criticalReports = [
    {
      id: '1',
      title: 'Major Earthquake - Turkey',
      location: 'Kahramanmaraş, Turkey',
      severity: 'Critical',
      status: 'Active Response',
      time: '2 hours ago',
      responders: 12,
      affected: 15000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '2',
      title: 'Wildfire Spreading - California',
      location: 'Los Angeles County, CA',
      severity: 'High',
      status: 'Containment 60%',
      time: '4 hours ago',
      responders: 8,
      affected: 3200,
      image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '3',
      title: 'Severe Flooding - Bangladesh',
      location: 'Dhaka Division, Bangladesh',
      severity: 'High',
      status: 'Relief Operations',
      time: '6 hours ago',
      responders: 15,
      affected: 8500,
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const responseTeams = [
    { name: 'Alpha Team', location: 'Turkey Earthquake', status: 'Deployed', members: 12, lead: 'Captain Rodriguez' },
    { name: 'Bravo Team', location: 'California Wildfire', status: 'En Route', members: 8, lead: 'Lt. Johnson' },
    { name: 'Charlie Team', location: 'Bangladesh Flood', status: 'Deployed', members: 15, lead: 'Major Chen' },
    { name: 'Delta Team', location: 'Standby', status: 'Ready', members: 10, lead: 'Sgt. Williams' }
  ];

  const recentActivities = [
    { time: '10 min ago', action: 'Emergency alert sent to 50,000 residents in LA County', type: 'alert' },
    { time: '25 min ago', action: 'Response team Alpha deployed to Turkey earthquake zone', type: 'deployment' },
    { time: '1 hour ago', action: 'Evacuation order issued for 3 neighborhoods in California', type: 'evacuation' },
    { time: '2 hours ago', action: 'International aid request approved for Turkey', type: 'aid' },
    { time: '3 hours ago', action: 'Emergency shelters activated in Bangladesh', type: 'shelter' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Active') || status.includes('Deployed')) return 'bg-red-100 text-red-800';
    if (status.includes('Containment') || status.includes('Relief')) return 'bg-blue-100 text-blue-800';
    if (status.includes('Ready') || status.includes('En Route')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section - Matching your design system */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Floating background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium mb-8">
                  <Shield size={16} className="mr-2 text-cyan-300" />
                  <span className="text-white/90">Command & Control Center</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  <span className="block mb-2">Emergency</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                    Command Dashboard
                  </span>
                </h1>

                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Real-time disaster response coordination and emergency management operations center.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => document.getElementById('dashboard-content')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Activity size={20} className="mr-2" />
                    View Operations
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 1000);
                    }}
                    className="group bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <RefreshCw size={20} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                </div>
              </div>

              {/* Live Status Panel */}
              <div className="mt-12 lg:mt-0 lg:ml-12">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Live Status</h3>
                    <div className="flex items-center text-green-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm font-medium">All Systems Online</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Active Incidents</span>
                      <span className="text-2xl font-bold text-white">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Response Teams</span>
                      <span className="text-2xl font-bold text-white">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">People Affected</span>
                      <span className="text-2xl font-bold text-white">2,847</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section id="dashboard-content" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {dashboardStats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon size={24} />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{stat.change}</div>
                      <div className="text-xs text-gray-500">vs last 24h</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                  {[
                    { key: 'overview', label: 'Overview', icon: BarChart3 },
                    { key: 'reports', label: 'Critical Reports', icon: AlertTriangle },
                    { key: 'response', label: 'Response Teams', icon: Users },
                    { key: 'analytics', label: 'Analytics', icon: TrendingUp }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        activeTab === tab.key
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon size={18} className="mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download size={18} className="mr-2" />
                    Export
                  </button>
                  <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings size={18} className="mr-2" />
                    Settings
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activities */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h3>
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">{activity.action}</p>
                              <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="p-6 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left group">
                          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Bell size={24} className="text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">Send Alert</h4>
                          <p className="text-sm text-gray-600">Emergency notification</p>
                        </button>
                        
                        <button className="p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left group">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Users size={24} className="text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">Deploy Team</h4>
                          <p className="text-sm text-gray-600">Response coordination</p>
                        </button>
                        
                        <button className="p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left group">
                          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileText size={24} className="text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">Generate Report</h4>
                          <p className="text-sm text-gray-600">Situation analysis</p>
                        </button>
                        
                        <button className="p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left group">
                          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Globe size={24} className="text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">Coordinate Aid</h4>
                          <p className="text-sm text-gray-600">International support</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-gray-900">Critical Incident Reports</h3>
                      <Link
                        to="/reports"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View All Reports
                        <ExternalLink size={16} className="ml-2" />
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {criticalReports.map((report) => (
                        <div
                          key={report.id}
                          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 cursor-pointer"
                          onClick={() => navigate(`/reports/${report.id}`)}
                        >
                          <div className="aspect-[4/3] overflow-hidden relative">
                            <img
                              src={report.image}
                              alt={report.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(report.severity)}`}>
                                {report.severity}
                              </span>
                            </div>
                            <div className="absolute top-4 right-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                                {report.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {report.title}
                            </h4>
                            <div className="flex items-center text-gray-500 mb-4">
                              <MapPin size={16} className="mr-2" />
                              <span className="text-sm">{report.location}</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-gray-600">
                                  <Users size={14} className="mr-1" />
                                  {report.responders} teams
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Heart size={14} className="mr-1" />
                                  {report.affected.toLocaleString()} affected
                                </div>
                              </div>
                              <span className="text-gray-500">{report.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'response' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-gray-900">Response Teams Status</h3>
                      <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Plus size={16} className="mr-2" />
                        Deploy New Team
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {responseTeams.map((team, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/80">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-gray-900">{team.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(team.status)}`}>
                              {team.status}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium text-gray-900">{team.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Team Lead:</span>
                              <span className="font-medium text-gray-900">{team.lead}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Members:</span>
                              <span className="font-medium text-gray-900">{team.members} personnel</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex space-x-3">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                              Contact Team
                            </button>
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Performance Analytics</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Response Time Chart Placeholder */}
                      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-6">Response Time Trends</h4>
                        <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <BarChart3 size={48} className="text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">Chart visualization would be integrated here</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">Key Performance Metrics</h4>
                            <Award size={20} className="text-yellow-500" />
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Average Response Time</span>
                              <span className="font-bold text-green-600">8.5 minutes</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Success Rate</span>
                              <span className="font-bold text-green-600">94.2%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Team Efficiency</span>
                              <span className="font-bold text-blue-600">87%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Resource Utilization</span>
                              <span className="font-bold text-purple-600">76%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Star size={16} className="text-yellow-500 mr-3" />
                              <span className="text-sm text-gray-700">Fastest response time this month: 3.2 minutes</span>
                            </div>
                            <div className="flex items-center">
                              <Target size={16} className="text-green-500 mr-3" />
                              <span className="text-sm text-gray-700">100% success rate in last 48 hours</span>
                            </div>
                            <div className="flex items-center">
                              <Zap size={16} className="text-blue-500 mr-3" />
                              <span className="text-sm text-gray-700">Record coordination of 15 simultaneous operations</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Matching your design system */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Command Center Excellence
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Leading global disaster response coordination with advanced technology and expert teams.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/reports"
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Eye size={20} className="mr-3" />
                  View All Reports
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  Contact Command
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CJDashboard;