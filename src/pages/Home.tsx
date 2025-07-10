import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  ChevronUp,
  Shield,
  MapPin,
  MessageSquare,
  Zap,
  Heart,
  Globe,
  Navigation,
  ZoomIn,
  ZoomOut,
  Crosshair,
  TrendingUp,
  Activity,
  Eye,
  Star,
  Award,
  Sparkles,
  Play,

  ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';

// Components
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ChatWidget from '../components/Chat/ChatWidget';
import ViewReportsButton from '../components/Common/ViewReportsButton';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// Data
import { mockReports, mockStatistics } from '../data/mockData';

// Lazy load the map component
const ReportMap = React.lazy(() => import('../components/Map/ReportMap'));

const Home: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [mapZoom, setMapZoom] = useState(4);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [reportsLoading, setReportsLoading] = useState(false);

  // Reset map state when component mounts to ensure fresh map instance
  useEffect(() => {
    setMapLoaded(false);
    setMapKey(prev => prev + 1); // Force remount of map component
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setMapLoaded(true);
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeout);
  }, []);



  // Statistics data
  const stats = [
    {
      label: "Reports Submitted",
      value: "2,847",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      label: "Lives Helped",
      value: "12,450",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Verified Reports",
      value: "2,189",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Response Time",
      value: "< 2hrs",
      icon: Clock,
      color: "text-purple-600",
    },
  ];

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Get current location with improved error handling
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        // Silently handle geolocation errors to avoid console spam
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.warn('Geolocation permission denied by user.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.warn('Geolocation position unavailable.');
            break;
          case error.TIMEOUT:
            console.warn('Geolocation request timed out.');
            break;
          default:
            console.warn('An unknown geolocation error occurred.');
            break;
        }
      },
      {
        timeout: 10000, // 10 seconds timeout
        enableHighAccuracy: false, // Use less accurate but faster positioning
        maximumAge: 300000 // Accept cached position up to 5 minutes old
      }
    );
  };

  // Get recent reports for the map
  const recentReports = mockReports.slice(0, 4);



  // Simulate loading more reports
  const loadMoreReports = () => {
    setReportsLoading(true);
    setTimeout(() => {
      setReportsLoading(false);
      // In a real app, this would fetch more reports
    }, 2000);
  };

  // Get color classes for statistics
  const getStatColor = (color: string) => {
    switch (color) {
      case 'text-red-600':
        return 'from-red-500 to-red-600';
      case 'text-blue-600':
        return 'from-blue-500 to-blue-600';
      case 'text-green-600':
        return 'from-green-500 to-green-600';
      case 'text-purple-600':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Get severity color classes
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get default image for report type
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



  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Enhanced Hero Section */}
        <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden flex items-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Content */}
              <div className="text-left">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
                  <Sparkles size={16} className="mr-2 text-yellow-300" />
                  Trusted by 50,000+ communities worldwide
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
                  <span className="block">Unite Communities</span>
                  <span className="block">in</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
                    Times of Crisis
                  </span>
                </h1>

                <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-xl">
                  The world's most trusted disaster management platform. Connect with your community,
                  report incidents instantly, and coordinate relief efforts with real-time intelligence.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    to="/report/new"
                    className="group bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
                  >
                    <AlertTriangle size={20} className="mr-2" />
                    Report Emergency
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center">
                    <Play size={20} className="mr-2" />
                    Watch Demo
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-8 text-sm text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="text-blue-300" size={16} />
                    <span>Award Winning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="text-green-300" size={16} />
                    <span>ISO Certified</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual Element */}
              <div className="relative lg:block hidden">
                <div className="relative">
                  {/* Main Dashboard Mockup */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Live Dashboard</h3>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/20 rounded-lg p-4">
                          <div className="text-2xl font-bold text-white">2,847</div>
                          <div className="text-blue-100 text-sm">Active Reports</div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-4">
                          <div className="text-2xl font-bold text-white">&lt; 2hrs</div>
                          <div className="text-blue-100 text-sm">Response Time</div>
                        </div>
                      </div>
                    </div>

                    {/* Mini Map Preview */}
                    <div className="bg-gray-800 rounded-2xl h-32 flex items-center justify-center">
                      <div className="text-gray-400 text-sm">Interactive Map Preview</div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                    <CheckCircle size={20} />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg animate-pulse">
                    <Activity size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Statistics Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30" aria-label="Statistics">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <TrendingUp size={16} className="mr-2" />
                Real-time Impact Metrics
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Making a
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Real Impact</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our community-driven platform has transformed disaster response across the globe,
                connecting communities and saving lives through technology and collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div className="text-center">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${getStatColor(
                        stat.color
                      )} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon size={32} />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
                    <Eye size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">99.9%</div>
                    <div className="text-gray-600">Uptime Reliability</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
                    <Globe size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">150+</div>
                    <div className="text-gray-600">Countries Served</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">
                    <Zap size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-gray-600">Emergency Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Enhanced Interactive Map Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-6">
                <Activity size={16} className="mr-2" />
                Live Monitoring System
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Real-Time Disaster
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                  Intelligence Hub
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Advanced geospatial analytics and real-time data visualization to track disasters,
                coordinate response efforts, and protect communities worldwide.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
              <div className="p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Global Disaster Dashboard</h3>
                    <p className="text-gray-600 text-lg">Interactive map with real-time incident tracking and response coordination</p>
                  </div>
                  <div className="mt-6 lg:mt-0">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">47</div>
                          <div className="text-xs text-gray-500">Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">189</div>
                          <div className="text-xs text-gray-500">Resolved</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Status Indicators */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Critical Alerts</span>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">12</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Verified Reports</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">2,189</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Under Review</span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">658</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Response Teams</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">24</span>
                  </div>
                </div>

                {/* Enhanced Map Container with Controls */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                  {/* Map Loading Placeholder */}
                  {!mapLoaded && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading interactive map...</p>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto mt-2 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
                    {/* Current Location Button */}
                    <button
                      onClick={getCurrentLocation}
                      className="group bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Get current location"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <Navigation size={18} className="text-blue-600 group-hover:text-blue-700 transition-colors" />
                    </button>

                    {/* Zoom Controls */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                        className="block w-full p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Zoom in"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                      >
                        <ZoomIn size={18} className="text-gray-600 hover:text-gray-800 transition-colors mx-auto" />
                      </button>
                      <div className="border-t border-gray-200"></div>
                      <button
                        onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
                        className="block w-full p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Zoom out"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                      >
                        <ZoomOut size={18} className="text-gray-600 hover:text-gray-800 transition-colors mx-auto" />
                      </button>
                    </div>

                    {/* Map Type Toggle */}
                    <button
                      className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Toggle map view"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <Globe size={18} className="text-gray-600 hover:text-gray-800 transition-colors" />
                    </button>
                  </div>

                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Map Legend</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Critical</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">High Priority</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Medium</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Resolved</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Location Indicator */}
                  {currentLocation && (
                    <div className="absolute top-4 left-4 z-20 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Crosshair size={14} />
                        <span>Your Location</span>
                      </div>
                    </div>
                  )}

                  {/* Main Map */}
                  <div
                    className="transition-opacity duration-500"
                    style={{ opacity: mapLoaded ? 1 : 0 }}
                  >
                    <Suspense fallback={<LoadingSpinner size={32} />}>
                      <ReportMap
                        key={mapKey}
                        reports={recentReports}
                        height="500px"
                        onLoad={() => setMapLoaded(true)}
                        onReportSelect={(report) => {
                          console.log('Selected report:', report);
                        }}
                      />
                    </Suspense>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <ViewReportsButton
                    size="lg"
                    className="flex-1 sm:flex-none transform hover:scale-105 transition-transform duration-200"
                  />
                  <Link
                    to="/report/new"
                    className="flex-1 sm:flex-none bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-semibold flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <AlertTriangle size={20} className="mr-2" />
                    Report New Incident
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Recent Reports Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/20" aria-label="Recent Reports">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2"></div>
                  <MessageSquare size={16} className="mr-2" />
                  Live Community Updates
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  <CheckCircle size={16} className="mr-2" />
                  {mockReports.filter(r => r.verified).length} Verified Today
                </div>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Latest Community
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"> Reports</span>
              </h2>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Real-time updates from community members on the ground. Every report helps build
                a safer, more informed community response network.
              </p>

              {/* Real-time Stats */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">3 Critical Alerts</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
                  <Clock size={14} className="text-blue-600" />
                  <span className="text-gray-700 font-medium">Updated 2 min ago</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
                  <Users size={14} className="text-purple-600" />
                  <span className="text-gray-700 font-medium">1,247 Active Responders</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {mockReports.slice(0, 3).map((report, index) => (
                <div
                  key={report.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Enhanced Image Section */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={report.photos?.[0] || getDefaultImage(report.disasterType)}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>

                    {/* Enhanced Severity Badge */}
                    <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg ${getSeverityColor(report.severity)} backdrop-blur-sm`}>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>{report.severity?.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Verification Badge */}
                    {report.verified && (
                      <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </div>
                    )}

                    {/* Image Overlay with Type */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-sm font-semibold capitalize">{report.disasterType} Alert</span>
                          <span className="text-xs opacity-90">
                            {format(report.createdAt, 'MMM d, HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Content Section */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {report.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    {/* Location and Status */}
                    <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-blue-100 rounded-lg">
                          <MapPin size={14} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{report.location.address}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        report.status === 'verified' ? 'bg-green-100 text-green-700' :
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </div>
                    </div>

                    {/* Enhanced Action Button */}
                    <Link
                      to={`/reports/${report.id}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center group"
                    >
                      <span>View Details</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Reports Section */}
            <div className="text-center mb-16">
              <button
                onClick={loadMoreReports}
                disabled={reportsLoading}
                className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {reportsLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    Loading More Reports...
                  </>
                ) : (
                  <>
                    <Eye size={20} className="mr-3" />
                    Load More Reports
                    <ArrowRight size={18} className="ml-3" />
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Showing 3 of {mockReports.length} recent reports
              </p>
            </div>

            {/* Enhanced CTA Section */}
            <div className="bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/60 shadow-xl">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                  <Users size={16} className="mr-2" />
                  Community Engagement
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Stay Connected with Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Community</span>
                </h3>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Join over 50,000 community members who are making a real difference. View comprehensive reports,
                  contribute to ongoing discussions, and help build more resilient communities together.
                </p>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                  <ViewReportsButton
                    size="lg"
                    className="transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  />
                  <Link
                    to="/community"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center border border-purple-400/20"
                  >
                    <Users size={22} className="mr-3" />
                    Join Community
                    <ArrowRight size={20} className="ml-3" />
                  </Link>
                </div>

                {/* Community Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">2.8M+</div>
                    <div className="text-sm text-gray-600">Lives Helped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">50K+</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Support Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">150+</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Partners Section */}
        <section className="py-24 bg-white relative overflow-hidden" aria-label="Partners">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Award size={16} className="mr-2" />
                Global Partnerships
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Trusted by
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> World Leaders</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Partnering with the world's most respected humanitarian organizations to deliver
                life-saving technology and coordinate global disaster response efforts.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mt-8"></div>
            </div>

            {/* Enhanced Partner Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
              {[
                {
                  name: "American Red Cross",
                  logo: "https://images.pexels.com/photos/6647049/pexels-photo-6647049.jpeg?auto=compress&cs=tinysrgb&w=150&h=80&dpr=1",
                  description: "Humanitarian Relief"
                },
                {
                  name: "FEMA",
                  logo: "https://images.pexels.com/photos/8728562/pexels-photo-8728562.jpeg?auto=compress&cs=tinysrgb&w=150&h=80&dpr=1",
                  description: "Emergency Management"
                },
                {
                  name: "Salvation Army",
                  logo: "https://images.pexels.com/photos/6995122/pexels-photo-6995122.jpeg?auto=compress&cs=tinysrgb&w=150&h=80&dpr=1",
                  description: "Community Support"
                },
                {
                  name: "United Way",
                  logo: "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=150&h=80&dpr=1",
                  description: "Social Services"
                },
                {
                  name: "Doctors Without Borders",
                  logo: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=150&h=80&dpr=1",
                  description: "Medical Aid"
                },
                {
                  name: "World Health Organization",
                  logo: "https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=150&h=80&dpr=1",
                  description: "Global Health"
                },
              ].map((partner, index) => (
                <div
                  key={index}
                  className="group text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 mb-4 aspect-square overflow-hidden">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {partner.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Partnership Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600 font-medium">Global Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
                  <div className="text-gray-600 font-medium">Countries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <div className="text-gray-600 font-medium">Support Network</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                  <div className="text-gray-600 font-medium">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Call-to-Action Section */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
                <Sparkles size={16} className="mr-2 text-yellow-300" />
                Join the Movement
              </div>

              <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Ready to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"> Transform Lives?</span>
              </h2>

              <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join over 50,000 community heroes who are building safer, more resilient communities.
                Your voice matters, your actions save lives, and together we can make a lasting impact.
              </p>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Link
                  to="/report/new"
                  className="group bg-gradient-to-r from-red-500 to-orange-500 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:from-red-600 hover:to-orange-600 transition-all transform hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center border border-red-400/20"
                >
                  <AlertTriangle size={24} className="mr-3" />
                  Report Emergency
                  <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/volunteer"
                  className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center"
                >
                  <Heart size={24} className="mr-3 group-hover:text-red-300 transition-colors" />
                  Become a Hero
                  <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Social Proof */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2">50,000+</div>
                  <div className="text-blue-200 text-sm font-medium">Active Community Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2">2.8M+</div>
                  <div className="text-blue-200 text-sm font-medium">Lives Impacted</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2">150+</div>
                  <div className="text-blue-200 text-sm font-medium">Countries Served</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <Shield className="text-green-300" size={20} />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span>4.9/5 User Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="text-blue-300" size={20} />
                <span>UN Partnership</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="text-purple-300" size={20} />
                <span>Global Coverage</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}


    </div>
  );
};

export default Home;
// Enhanced map section with improved design
