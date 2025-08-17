import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp, 
  Shield, 
  ChevronRight, 
  Heart, 
  Activity,
  RefreshCw,
  Target,
  Calendar,
  MapIcon,
  CheckCircle,
  Globe,
  Zap,
  Play,
  ArrowRight,
  ArrowUp,
  ChevronLeft
} from 'lucide-react';

// Components
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SimpleLeafletMap from '../components/Map/SimpleLeafletMap';
import ChatWidget from '../components/Chat/ChatWidget';

import { useDisasterData } from '../hooks/useDisasterData';
import { useAuth } from '../hooks/useAuth';
import { useRoles } from '../hooks/useRoles';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentFeatureSlide, setCurrentFeatureSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Auth and roles
  const { user, isAuthenticated } = useAuth();
  const { isOnlyUser } = useRoles();

  // Real-world disaster data
  const { disasters, loading: disastersLoading, error: disastersError, statistics, refresh } = useDisasterData({
    autoRefresh: true,
    refreshInterval: 15 * 60 * 1000, // 15 minutes - reduced frequency for home page
    includeSignificantOnly: true,
  });

  // Check permissions
  const canCreateReports = !isAuthenticated || !isOnlyUser();

  // Hero content with refined professional disaster response images
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: t('home.heroSlides.emergencyResponse.title'),
      subtitle: t('home.heroSlides.emergencyResponse.subtitle'),
      stats: { value: '24/7', label: t('home.heroSlides.emergencyResponse.statsLabel') },
      category: t('home.heroSlides.emergencyResponse.category')
    },
    {
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: t('home.heroSlides.floodResponse.title'),
      subtitle: t('home.heroSlides.floodResponse.subtitle'),
      stats: { value: '99.9%', label: t('home.heroSlides.floodResponse.statsLabel') },
      category: t('home.heroSlides.floodResponse.category')
    },
    {
      image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
      title: t('home.heroSlides.wildfireManagement.title'),
      subtitle: t('home.heroSlides.wildfireManagement.subtitle'),
      stats: { value: '15M+', label: t('home.heroSlides.wildfireManagement.statsLabel') },
      category: t('home.heroSlides.wildfireManagement.category')
    },
    {
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: t('home.heroSlides.stormTracking.title'),
      subtitle: t('home.heroSlides.stormTracking.subtitle'),
      stats: { value: '2.4M', label: t('home.heroSlides.stormTracking.statsLabel') },
      category: t('home.heroSlides.stormTracking.category')
    }
  ];

  // Beautiful disaster statistics with enhanced design
  const stats = [
    {
      icon: AlertTriangle,
      value: statistics ? statistics.totalActive.toLocaleString() : (disastersLoading ? "..." : "2,847"),
      label: t('home.stats.activeDisasters'),
      description: t('home.stats.realTimeIncidents'),
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: Heart,
      value: statistics ? statistics.critical.toLocaleString() : (disastersLoading ? "..." : "156"),
      label: t('home.stats.criticalEvents'),
      description: t('home.stats.urgentSituations'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: CheckCircle,
      value: statistics ? statistics.high.toLocaleString() : (disastersLoading ? "..." : "89"),
      label: t('home.stats.highSeverity'),
      description: t('home.stats.majorIncidents'),
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Globe,
      value: '24/7',
      label: t('home.stats.dataSources'),
      description: t('home.stats.liveMonitoring'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600'
    }
  ];

  // Clean, modern disaster management features
  const features = [
    {
      icon: Shield,
      title: t('home.features.realTimeReporting.title'),
      description: t('home.features.realTimeReporting.description'),
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      icon: Users,
      title: t('home.features.emergencyCoordination.title'),
      description: t('home.features.emergencyCoordination.description'),
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      icon: Zap,
      title: t('home.features.communityAlerts.title'),
      description: t('home.features.communityAlerts.description'),
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      icon: MapPin,
      title: t('home.features.resourceManagement.title'),
      description: t('home.features.resourceManagement.description'),
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-orange-600 to-red-600'
    },
    {
      icon: Activity,
      title: t('home.features.realTimeReporting.title'),
      description: t('home.features.realTimeReporting.description'),
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-cyan-600 to-blue-600'
    },
    {
      icon: Target,
      title: t('home.features.emergencyCoordination.title'),
      description: t('home.features.emergencyCoordination.description'),
      image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-indigo-600 to-purple-600'
    }
  ];

  // Recent verified disasters data
  const recentDisasters = [
    {
      id: 1,
      title: 'Earthquake M7.2 - Turkey',
      location: 'Kahramanmaraş, Turkey',
      severity: 'Critical',
      time: '2 hours ago',
      status: 'Active Response',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      verified: true
    },
    {
      id: 2,
      title: 'Wildfire - California',
      location: 'Los Angeles County, CA',
      severity: 'High',
      time: '4 hours ago',
      status: 'Contained 60%',
      image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      verified: true
    },
    {
      id: 3,
      title: 'Flood Warning - Bangladesh',
      location: 'Dhaka Division, Bangladesh',
      severity: 'Medium',
      time: '6 hours ago',
      status: 'Monitoring',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      verified: true
    },
    {
      id: 4,
      title: 'Hurricane Category 3',
      location: 'Gulf of Mexico',
      severity: 'Critical',
      time: '8 hours ago',
      status: 'Tracking',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      verified: true
    }
  ];

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Auto-advance features slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeatureSlide((prev) => (prev + 1) % Math.ceil(features.length / 3));
    }, 6000);
    return () => clearInterval(timer);
  }, [features.length]);

  // Scroll functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextFeatureSlide = () => {
    setCurrentFeatureSlide((prev) => (prev + 1) % Math.ceil(features.length / 3));
  };

  const prevFeatureSlide = () => {
    setCurrentFeatureSlide((prev) => (prev - 1 + Math.ceil(features.length / 3)) % Math.ceil(features.length / 3));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          {/* Background Images */}
          <div className="absolute inset-0">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-800/70 to-slate-900/85"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
              </div>
            ))}
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                {/* Left Content */}
                <div className="lg:col-span-7 text-white">
                  {/* Trust Badge */}
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-medium mb-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse shadow-sm"></div>
                    <Globe size={14} className="mr-2 text-cyan-300" />
                    <span className="text-white/95 font-semibold uppercase tracking-wide">{t('home.hero.trustBadge')}</span>
                  </div>

                  {/* Main Heading - Beautiful & Clean */}
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 tracking-tight">
                    <span className="block text-white mb-1 drop-shadow-lg">{t('home.hero.title')}</span>
                    <span className="block text-white mb-1 drop-shadow-lg">{t('home.hero.subtitle')}</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-lg">
                      {t('home.hero.subtitle')}
                    </span>
                  </h1>

                  {/* Beautiful Description */}
                  <p className="text-base lg:text-lg text-white/90 mb-8 leading-relaxed max-w-xl font-light drop-shadow-sm">
                    {t('home.hero.description')}
                  </p>

                  {/* Beautiful Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    {canCreateReports ? (
                      <Link
                        to="/report/new"
                        className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <AlertTriangle size={18} className="mr-2" />
                        {t('home.hero.reportEmergency')}
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <Link
                        to="/reports"
                        className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <Heart size={18} className="mr-2" />
                        {t('navigation.reports')}
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}

                    <button className="group bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center hover:scale-105 shadow-lg">
                      <Play size={18} className="mr-2" />
                      {t('home.hero.watchDemo')}
                    </button>
                  </div>

                  {/* Beautiful Trust Indicators */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-white/85">
                    <div className="flex items-center space-x-2 group">
                      <div className="p-1.5 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                        <Clock className="text-cyan-300" size={16} />
                      </div>
                      <span className="font-medium">{t('home.hero.monitoring24x7')}</span>
                    </div>
                    <div className="flex items-center space-x-2 group">
                      <div className="p-1.5 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                        <Shield className="text-emerald-300" size={16} />
                      </div>
                      <span className="font-medium">{t('home.hero.verifiedData')}</span>
                    </div>
                    <div className="flex items-center space-x-2 group">
                      <div className="p-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                        <Users className="text-blue-300" size={16} />
                      </div>
                      <span className="font-medium">{t('home.hero.globalNetwork')}</span>
                    </div>
                  </div>
                </div>

                {/* Right Content - Enhanced Stats Card */}
                <div className="lg:col-span-5">
                  <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
                    {/* Live Badge */}
                    <div className="inline-flex items-center px-5 py-3 rounded-full bg-red-600/20 border border-red-400/30 text-sm font-semibold mb-6 shadow-lg">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-3 animate-pulse shadow-lg shadow-red-400/50"></div>
                      <span className="text-white font-bold">Live Emergency Data</span>
                    </div>

                    {/* Current Slide Info */}
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                        {heroSlides[currentSlide].title}
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {heroSlides[currentSlide].subtitle}
                      </p>
                    </div>
                    
                    {/* Enhanced Stats */}
                    <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-8 border border-white/20 shadow-xl">
                      <div className="text-5xl font-black text-white mb-2 drop-shadow-lg">
                        {heroSlides[currentSlide].stats.value}
                      </div>
                      <div className="text-white/80 text-base font-semibold uppercase tracking-wide">
                        {heroSlides[currentSlide].stats.label}
                      </div>
                    </div>

                    {/* Enhanced Slide Indicators */}
                    <div className="flex justify-center space-x-3">
                      {heroSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`transition-all duration-300 ${
                            index === currentSlide
                              ? 'w-10 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-lg'
                              : 'w-3 h-3 bg-white/40 rounded-full hover:bg-white/60 hover:scale-110'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-full hover:bg-white/20 transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-full hover:bg-white/20 transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </section>

        {/* Statistics Section */}
        <section className="py-32 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-4 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <TrendingUp size={18} className="mr-3" />
{t('home.stats.realTimeIntelligence')}
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
{t('home.stats.savingLives')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">{t('home.stats.smartTechnology')}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
{t('home.stats.platformDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-100/80 hover:border-gray-200"
                >
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md mb-6 group-hover:scale-105 transition-all duration-300`}>
                      <stat.icon size={24} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-800 font-semibold text-base mb-1">{stat.label}</div>
                    <div className="text-gray-500 text-sm">{stat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Verified Disasters Section */}
        <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-red-50/30 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-700 text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <AlertTriangle size={18} className="mr-2" />
{t('home.disasters.recentVerified')}
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
{t('home.disasters.latest')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-red-700">{t('home.disasters.emergencyUpdates')}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
{t('home.disasters.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentDisasters.map((disaster) => (
                <div
                  key={disaster.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-100/80"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={disaster.image}
                      alt={disaster.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(disaster.severity)}`}>
                        {disaster.severity}
                      </span>
                    </div>
                    {disaster.verified && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                          <CheckCircle size={12} className="mr-1" />
{t('common.verified')}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{disaster.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapIcon size={14} className="mr-1" />
                      {disaster.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <Calendar size={14} className="mr-1" />
                      {disaster.time}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">{disaster.status}</span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
{t('home.disasters.viewDetails')} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/reports"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
{t('home.disasters.viewAllDisasters')}
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Live Disaster Map Section */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-semibold mb-6 text-white">
                <Globe size={16} className="mr-2" />
{t('home.map.liveGlobalMonitoring')}
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
{t('home.map.realTimeTracking')}
                </span>
              </h2>
              <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
{t('home.map.description')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Live Map Interface */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                  {/* Map Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{t('home.map.liveDisasterMap')}</h3>
                    <div className="flex items-center space-x-3">
                      {!disastersLoading && !disastersError && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-blue-300 text-sm font-medium">{t('home.map.liveUpdates')}</span>
                        </div>
                      )}
                      {disastersLoading && (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                          <span className="text-blue-300 text-sm font-medium">{t('common.loading')}</span>
                        </div>
                      )}
                      {disastersError && (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span className="text-red-300 text-sm font-medium">{t('common.connectionError')}</span>
                        </div>
                      )}
                      <button
                        onClick={refresh}
                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                        title={t('common.refreshData')}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Real-World Disaster Map */}
                  <div className="relative">
                    {disastersError ? (
                      <div className="bg-slate-800 rounded-2xl h-80 flex items-center justify-center">
                        <div className="text-center text-white">
                          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                          <h3 className="text-lg font-semibold text-white mb-2">{t('home.map.unableToLoad')}</h3>
                          <p className="text-gray-300 mb-4">{t('home.map.checkConnection')}</p>
                          <button
                            onClick={refresh}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            {t('common.tryAgain')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-800 rounded-2xl h-80 overflow-hidden">
                        <SimpleLeafletMap
                          disasters={disasters || []}
                          className="w-full h-full rounded-2xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Disaster Statistics */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Active Disasters</h3>
                    <div className="text-3xl font-bold text-white">
                      {statistics ? statistics.totalActive : (disastersLoading ? "..." : "2,847")}
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm">Currently monitored worldwide</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Critical Events</h3>
                    <div className="text-3xl font-bold text-red-300">
                      {statistics ? statistics.critical : (disastersLoading ? "..." : "156")}
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm">Requiring immediate attention</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Response Teams</h3>
                    <div className="text-3xl font-bold text-emerald-300">
                      {statistics ? statistics.high : (disastersLoading ? "..." : "89")}
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm">Active response operations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Slider */}
        <section className="py-32 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
{t('home.features.comprehensiveTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">{t('home.features.disasterSolutions')}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
{t('home.features.description')}
              </p>
            </div>

            {/* Features Slider */}
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentFeatureSlide * 100}%)` }}
                >
                  {Array.from({ length: Math.ceil(features.length / 3) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid lg:grid-cols-3 gap-8">
                        {features.slice(slideIndex * 3, (slideIndex + 1) * 3).map((feature, index) => (
                          <div
                            key={slideIndex * 3 + index}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-100/80"
                          >
                            <div className="aspect-[4/3] overflow-hidden">
                              <img
                                src={feature.image}
                                alt={feature.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-8">
                              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md mb-4`}>
                                <feature.icon size={20} />
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                              <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Navigation */}
              <button
                onClick={prevFeatureSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-300"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>

              <button
                onClick={nextFeatureSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-300"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>

              {/* Slider Indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {Array.from({ length: Math.ceil(features.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeatureSlide(index)}
                    className={`transition-all duration-300 ${
                      index === currentFeatureSlide
                        ? 'w-8 h-2 bg-blue-600 rounded-full'
                        : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
{t('home.cta.title')}
              </h2>
              <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed font-light drop-shadow-lg">
{t('home.cta.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/signup"
                  className="group relative bg-white text-slate-900 px-12 py-6 rounded-2xl text-xl font-bold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-white/25 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10">{t('home.cta.getStarted')}</span>
                  <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
                <Link
                  to="/about"
                  className="group relative bg-white/10 backdrop-blur-2xl border border-white/30 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-white/10 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10">{t('common.learnMore')}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Chat Components */}
      {isAuthenticated && user?.userId && (
        <ChatWidget 
          currentUserId={user.userId}
          position="bottom-right"
        />
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 z-40"
        >
          <ArrowUp size={24} className="group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};

export default Home;
