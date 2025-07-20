import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Shield,
  Star,
  Award,
  Sparkles,
  Play,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Headphones,
  Eye,
  TrendingUp,
  Heart,
  Target,
  Globe,
  MapPin,
  RefreshCw,
  Clock,
  Home as HomeIcon,
  Users,
  Zap,
  FileText,
  Activity
} from 'lucide-react';

// Components
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ChatWidget from '../components/Chat/ChatWidget';
import SimpleLeafletMap from '../components/Map/SimpleLeafletMap';

import { useDisasterData } from '../hooks/useDisasterData';
import { useAuth } from '../hooks/useAuth';
import { useRoles } from '../hooks/useRoles';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useTranslation();

  // Auth and roles
  const { isAuthenticated } = useAuth();
  const { isAdmin, isCj, isOnlyUser } = useRoles();

  // Real-world disaster data
  const { disasters, loading: disastersLoading, error: disastersError, statistics, refresh } = useDisasterData({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    includeSignificantOnly: true,
  });

  // Check if user can view reports (only admin and CJ users)
  const canViewReports = isAuthenticated && (isAdmin() || isCj());

  // Check if user can create reports (hide from regular users)
  const canCreateReports = !isAuthenticated || !isOnlyUser();

  // Beautiful hero images with enhanced data
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: t('home.heroImages.emergencyResponse.title'),
      description: t('home.heroImages.emergencyResponse.description'),
      category: t('home.heroImages.emergencyResponse.category'),
      stats: { primary: '15K', secondary: t('home.heroImages.emergencyResponse.livesSaved'), tertiary: '48hrs', quaternary: t('home.heroImages.emergencyResponse.responseTime') }
    },
    {
      url: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: t('home.heroImages.communityUnity.title'),
      description: t('home.heroImages.communityUnity.description'),
      category: t('home.heroImages.communityUnity.category'),
      stats: { primary: '50K', secondary: t('home.heroImages.communityUnity.communities'), tertiary: '24/7', quaternary: t('home.heroImages.communityUnity.support') }
    },
    {
      url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
      title: t('home.heroImages.weatherMonitoring.title'),
      description: t('home.heroImages.weatherMonitoring.description'),
      category: t('home.heroImages.weatherMonitoring.category'),
      stats: { primary: '99.8%', secondary: t('home.heroImages.weatherMonitoring.accuracy'), tertiary: '12min', quaternary: t('home.heroImages.weatherMonitoring.alertTime') }
    },
    {
      url: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: t('home.heroImages.recoveryRebuild.title'),
      description: t('home.heroImages.recoveryRebuild.description'),
      category: t('home.heroImages.recoveryRebuild.category'),
      stats: { primary: '2.4M', secondary: t('home.heroImages.recoveryRebuild.peopleHelped'), tertiary: '89', quaternary: t('home.heroImages.recoveryRebuild.countries') }
    }
  ];

  // Professional statistics with cohesive blue theme - refined color matching
  const stats = [
    {
      label: t('home.stats.activeDisasters'),
      value: statistics ? statistics.totalActive.toLocaleString() : (disastersLoading ? "..." : "0"),
      icon: AlertTriangle,
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100",
      description: t('home.stats.realTimeIncidents')
    },
    {
      label: t('home.stats.criticalEvents'),
      value: statistics ? statistics.critical.toLocaleString() : (disastersLoading ? "..." : "0"),
      icon: Heart,
      gradient: "from-blue-700 to-blue-800",
      bgGradient: "from-blue-100 to-blue-150",
      description: t('home.stats.urgentSituations')
    },
    {
      label: t('home.stats.highSeverity'),
      value: statistics ? statistics.high.toLocaleString() : (disastersLoading ? "..." : "0"),
      icon: CheckCircle,
      gradient: "from-blue-800 to-indigo-800",
      bgGradient: "from-blue-150 to-indigo-100",
      description: t('home.stats.majorIncidents')
    },
    {
      label: t('home.stats.dataSources'),
      value: "USGS",
      icon: Globe,
      gradient: "from-indigo-700 to-indigo-800",
      bgGradient: "from-indigo-50 to-indigo-100",
      description: t('home.stats.liveMonitoring')
    }
  ];

  // Safety tips and emergency preparedness content
  const safetyContent = [
    {
      id: 1,
      title: t('home.safety.emergencyKit.title'),
      description: t('home.safety.emergencyKit.description'),
      icon: Shield,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      tips: t('home.safety.emergencyKit.tips', { returnObjects: true }) as string[]
    },
    {
      id: 2,
      title: t('home.safety.evacuationPlanning.title'),
      description: t('home.safety.evacuationPlanning.description'),
      icon: MapPin,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      tips: t('home.safety.evacuationPlanning.tips', { returnObjects: true }) as string[]
    },
    {
      id: 3,
      title: t('home.safety.communicationStrategy.title'),
      description: t('home.safety.communicationStrategy.description'),
      icon: Phone,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      tips: t('home.safety.communicationStrategy.tips', { returnObjects: true }) as string[]
    },
    {
      id: 4,
      title: t('home.safety.homeSafety.title'),
      description: t('home.safety.homeSafety.description'),
      icon: HomeIcon,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      tips: t('home.safety.homeSafety.tips', { returnObjects: true }) as string[]
    },
    {
      id: 5,
      title: t('home.safety.communityPreparedness.title'),
      description: t('home.safety.communityPreparedness.description'),
      icon: Users,
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-teal-500 to-blue-500",
      bgGradient: "from-teal-50 to-blue-50",
      tips: t('home.safety.communityPreparedness.tips', { returnObjects: true }) as string[]
    },
    {
      id: 6,
      title: t('home.safety.digitalPreparedness.title'),
      description: t('home.safety.digitalPreparedness.description'),
      icon: Zap,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      tips: t('home.safety.digitalPreparedness.tips', { returnObjects: true }) as string[]
    }
  ];

  // Safety slider state
  const [currentSafetySlide, setCurrentSafetySlide] = useState(0);
  const [safetySliderPaused, setSafetySliderPaused] = useState(false);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Auto-advance safety slider
  useEffect(() => {
    if (safetySliderPaused) return;

    const timer = setInterval(() => {
      setCurrentSafetySlide((prev) => (prev + 1) % safetyContent.length);
    }, 8000); // Slightly longer interval for safety content
    return () => clearInterval(timer);
  }, [safetyContent.length, safetySliderPaused]);

  // Keyboard navigation for safety slider
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).closest('[role="region"][aria-label*="Safety"]')) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            prevSafetySlide();
            break;
          case 'ArrowRight':
            event.preventDefault();
            nextSafetySlide();
            break;
          case 'Home':
            event.preventDefault();
            goToSafetySlide(0);
            break;
          case 'End':
            event.preventDefault();
            goToSafetySlide(safetyContent.length - 1);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [safetyContent.length]);

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
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Safety slider navigation functions
  const nextSafetySlide = () => {
    setCurrentSafetySlide((prev) => (prev + 1) % safetyContent.length);
  };

  const prevSafetySlide = () => {
    setCurrentSafetySlide((prev) => (prev - 1 + safetyContent.length) % safetyContent.length);
  };

  const goToSafetySlide = (index: number) => {
    setCurrentSafetySlide(index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Professional Hero Section */}
        <section className="relative h-screen overflow-hidden">
          {/* Clean Background with Improved Readability */}
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                {/* Simplified overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
                <div className="absolute inset-0 bg-blue-900/20"></div>
              </div>
            ))}
          </div>

          {/* Subtle Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                {/* Left Content - 7 columns */}
                <div className="lg:col-span-7 text-white">
                  {/* Professional Trust Badge */}
                  <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-semibold mb-6 hover:bg-white/15 transition-all duration-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                    <Globe size={16} className="mr-2 text-blue-300" />
                    <span className="text-white/90">{t('home.hero.trustBadge')}</span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-4xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
                    <span className="block text-white drop-shadow-lg">{t('home.hero.title')}</span>
                    <span className="block">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 drop-shadow-lg">
                        {t('home.hero.subtitle')}
                      </span>
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                    {t('home.hero.description')}
                  </p>

                  {/* Role-based Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    {canCreateReports ? (
                      /* Emergency Reporting Button - For Admin/CJ Users */
                      <Link
                        to="/report/new"
                        className="group bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-red-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      >
                        <AlertTriangle size={20} className="mr-3 group-hover:scale-105 transition-transform duration-300" />
                        <span>{t('home.hero.reportEmergency')}</span>
                        <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    ) : (
                      /* Volunteer Registration Button - For Regular Users */
                      <Link
                        to="/volunteer/register"
                        className="group bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      >
                        <Heart size={20} className="mr-3 group-hover:scale-105 transition-transform duration-300" />
                        <span>{t('home.hero.becomeVolunteer')}</span>
                        <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    )}

                    <button className="group bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center justify-center">
                      <Play size={20} className="mr-3 group-hover:scale-105 transition-transform duration-300" />
                      <span>{canCreateReports ? t('home.hero.watchEmergencyDemo') : t('home.hero.watchVolunteerStories')}</span>
                    </button>
                  </div>

                  {/* Professional Trust Indicators */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                    <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
                      <Clock className="text-blue-300" size={16} />
                      <span className="font-medium">{t('home.hero.monitoring24x7')}</span>
                    </div>
                    <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
                      <Shield className="text-green-300" size={16} />
                      <span className="font-medium">{t('home.hero.verifiedData')}</span>
                    </div>
                    <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
                      <Users className="text-indigo-300" size={16} />
                      <span className="font-medium">{t('home.hero.globalNetwork')}</span>
                    </div>
                  </div>
                </div>

                {/* Right Content - Professional Disaster Data Card - 5 columns */}
                <div className="lg:col-span-5 relative">
                  <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/12 transition-all duration-300">
                    {/* Live Data Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 border border-blue-400/30 text-sm font-semibold mb-4 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-white">Live: {heroImages[currentSlide].category}</span>
                    </div>

                    {/* Disaster Information */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                        {heroImages[currentSlide].title}
                      </h3>
                      <p className="text-white/85 text-base leading-relaxed">
                        {heroImages[currentSlide].description}
                      </p>
                    </div>
                    
                    {/* Professional Disaster Statistics */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                        <div className="text-2xl font-bold text-white mb-1">
                          {heroImages[currentSlide].stats.primary}
                        </div>
                        <div className="text-white/75 text-xs font-medium uppercase tracking-wide">
                          {heroImages[currentSlide].stats.secondary}
                        </div>
                      </div>
                      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                        <div className="text-2xl font-bold text-white mb-1">
                          {heroImages[currentSlide].stats.tertiary}
                        </div>
                        <div className="text-white/75 text-xs font-medium uppercase tracking-wide">
                          {heroImages[currentSlide].stats.quaternary}
                        </div>
                      </div>
                    </div>

                    {/* Professional Slider Indicators */}
                    <div className="flex justify-center space-x-2">
                      {heroImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`transition-all duration-300 ${
                            index === currentSlide
                              ? 'w-8 h-2 bg-white rounded-full'
                              : 'w-2 h-2 bg-white/40 rounded-full hover:bg-white/60'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Elegant Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 group"
            aria-label="Previous slide"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-full hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-110 shadow-2xl">
              <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 group"
            aria-label="Next slide"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-full hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-110 shadow-2xl">
              <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>

          {/* Beautiful Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="h-1 bg-white/20">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300 shadow-lg"
                style={{ width: `${((currentSlide + 1) / heroImages.length) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* Beautiful Statistics Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-100/50 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 hover:bg-blue-200 transition-colors duration-300">
                <TrendingUp size={16} className="mr-2" />
                {t('home.stats.realTimeImpactMetrics')}
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {t('home.stats.makingRealImpact')}
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('home.stats.impactDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-white/20`}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg mb-4 group-hover:scale-105 transition-all duration-300`}>
                      <stat.icon size={28} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-800 font-semibold text-base mb-1">{stat.label}</div>
                    <div className="text-gray-600 text-sm">{stat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        





        {/* Making Real Impact Section with Live Map */}
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
                {t('home.liveImpact.subtitle')}
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                  {t('home.liveImpact.title')}
                </span>
              </h2>
              <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                {t('home.liveImpact.description')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Live Map Interface */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                  {/* Map Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{t('home.liveImpact.liveDisasterMap')}</h3>
                    <div className="flex items-center space-x-3">
                      {!disastersLoading && !disastersError && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-blue-300 text-sm font-medium">{t('home.liveImpact.liveUpdates')}</span>
                        </div>
                      )}
                      {disastersLoading && (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                          <span className="text-blue-300 text-sm font-medium">{t('home.liveImpact.loading')}</span>
                        </div>
                      )}
                      {disastersError && (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span className="text-red-300 text-sm font-medium">{t('home.liveImpact.error')}</span>
                        </div>
                      )}
                      <button
                        onClick={refresh}
                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                        title={t('home.liveImpact.refreshData')}
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
                          <p className="text-lg font-semibold mb-2">{t('home.liveImpact.unableToLoad')}</p>
                          <p className="text-sm text-gray-300 mb-4">{disastersError}</p>
                          <button
                            onClick={refresh}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            {t('home.liveImpact.tryAgain')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <SimpleLeafletMap
                        disasters={disasters}
                        height="320px"
                        className="rounded-2xl overflow-hidden"
                        loading={disastersLoading}
                      />
                    )}

                    {/* Map Legend */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 z-10">
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          <span className="text-white">{t('home.liveImpact.critical')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          <span className="text-white">{t('home.liveImpact.high')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-white">{t('home.liveImpact.medium')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                          <span className="text-white">{t('home.liveImpact.low')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Activity Feed */}
                  <div className="mt-6 space-y-3 max-h-32 overflow-y-auto">
                    {disastersLoading ? (
                      <div className="flex items-center space-x-3 text-sm">
                        <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                        <span className="text-white/80">Loading recent disasters...</span>
                      </div>
                    ) : disasters.length > 0 ? (
                      disasters.slice(0, 5).map((disaster, index) => {
                        const getSeverityColor = (severity: string) => {
                          switch (severity) {
                            case 'critical': return 'bg-red-600';
                            case 'high': return 'bg-indigo-600';
                            case 'medium': return 'bg-blue-500';
                            case 'low': return 'bg-slate-500';
                            default: return 'bg-gray-500';
                          }
                        };

                        return (
                          <div key={disaster.id} className="flex items-center space-x-3 text-sm">
                            <div className={`w-2 h-2 ${getSeverityColor(disaster.severity)} rounded-full animate-pulse`}></div>
                            <span className="text-white truncate">
                              {disaster.location.place} - {disaster.disasterType === 'earthquake' && disaster.magnitude ? `M${disaster.magnitude}` : disaster.disasterType} - {new Date(disaster.time).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-white/60">No recent disasters</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Impact Statistics */}
              <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">Real-Time Impact</h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-black text-red-400 mb-2">
                        {statistics ? statistics.critical : (disastersLoading ? "..." : "0")}
                      </div>
                      <div className="text-white/80 text-sm">Critical Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-orange-400 mb-2">
                        {statistics ? statistics.high : (disastersLoading ? "..." : "0")}
                      </div>
                      <div className="text-white/80 text-sm">High Priority</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-blue-400 mb-2">
                        {statistics ? statistics.totalActive : (disastersLoading ? "..." : "0")}
                      </div>
                      <div className="text-white/80 text-sm">Active Disasters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-green-400 mb-2">USGS</div>
                      <div className="text-white/80 text-sm">Data Source</div>
                    </div>
                  </div>
                </div>

                {/* Active Response Teams */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">Active Response Teams</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-white font-medium">Thailand Emergency Team</div>
                          <div className="text-white/60 text-sm">Flood Response - Chiang Rai</div>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm font-medium">Active</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-white font-medium">Indonesia Seismic Unit</div>
                          <div className="text-white/60 text-sm">Earthquake Assessment - Sulawesi</div>
                        </div>
                      </div>
                      <div className="text-yellow-400 text-sm font-medium">Monitoring</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-white font-medium">Regional Coordination</div>
                          <div className="text-white/60 text-sm">Multi-site Response - Southeast Asia</div>
                        </div>
                      </div>
                      <div className="text-blue-400 text-sm font-medium">Coordinating</div>
                    </div>
                  </div>
                </div>

                {/* Role-based Quick Actions */}
                <div className="flex space-x-4">
                  <Link
                    to="/reports"
                    className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
                  >
                    <Eye size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                    View All Reports
                  </Link>
                  {canCreateReports ? (
                    <Link
                      to="/report/new"
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center group"
                    >
                      <AlertTriangle size={20} className="mr-2 group-hover:rotate-12 transition-transform" />
                      Report Now
                    </Link>
                  ) : (
                    <Link
                      to="/volunteer/opportunities"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center group"
                    >
                      <Heart size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                      Volunteer Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Verified Reports Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-4">
                  Recent Verified Reports
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Stay informed about recent disasters and community needs in your area
                </p>
              </div>
              <Link
                to="/reports"
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
              >
                View Reports
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>

            {/* Disaster Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Flash Flood Card */}
              <div className="group relative bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Flash Flood"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>

                <div className="relative p-8 h-80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Flash Flood
                      </span>
                      <span className="bg-blue-800/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      Flooding in Downtown District
                    </h3>
                    <p className="text-blue-100 text-sm leading-relaxed mb-4">
                      Severe flooding has affected multiple residential areas after heavy rainfall. Water levels reached 3-4 feet in some streets.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-blue-200">
                        <MapPin size={14} className="mr-2" />
                        Manhattan
                      </div>
                      <div className="flex items-center text-blue-200">
                        <Clock size={14} className="mr-2" />
                        Jan 15
                      </div>
                    </div>
                    <Link
                      to="/reports/1"
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center group"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Wildfire Card */}
              <div className="group relative bg-gradient-to-br from-red-800 via-red-900 to-orange-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1574482620881-b5eb0eeae10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Wildfire"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                <div className="relative p-8 h-80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Wildfire
                      </span>
                      <span className="bg-red-800/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      Wildfire Damage Assessment
                    </h3>
                    <p className="text-red-100 text-sm leading-relaxed mb-4">
                      Fast-moving wildfire has damaged several residential properties and threatens surrounding forest areas.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-red-200">
                        <MapPin size={14} className="mr-2" />
                        Los Angeles
                      </div>
                      <div className="flex items-center text-red-200">
                        <Clock size={14} className="mr-2" />
                        Jan 12
                      </div>
                    </div>
                    <Link
                      to="/reports/3"
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center group"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tornado Card */}
              <div className="group relative bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Tornado"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                <div className="relative p-8 h-80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Tornado
                      </span>
                      <span className="bg-purple-800/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      Tornado Aftermath Cleanup
                    </h3>
                    <p className="text-purple-100 text-sm leading-relaxed mb-4">
                      EF2 tornado caused significant damage to residential area. Multiple homes damaged, debris scattered throughout neighborhood.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-purple-200">
                        <MapPin size={14} className="mr-2" />
                        Denver
                      </div>
                      <div className="flex items-center text-purple-200">
                        <Clock size={14} className="mr-2" />
                        Jan 10
                      </div>
                    </div>
                    <Link
                      to="/reports/6"
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center group"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Earthquake Card */}
              <div className="group relative bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Earthquake"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                <div className="relative p-8 h-80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-slate-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Earthquake
                      </span>
                      <span className="bg-slate-800/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      M5.2 Earthquake Response
                    </h3>
                    <p className="text-slate-100 text-sm leading-relaxed mb-4">
                      Moderate earthquake shook the region. Infrastructure assessment ongoing, minor structural damage reported in older buildings.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-200">
                        <MapPin size={14} className="mr-2" />
                        San Francisco
                      </div>
                      <div className="flex items-center text-slate-200">
                        <Clock size={14} className="mr-2" />
                        Jan 8
                      </div>
                    </div>
                    <Link
                      to="/reports/2"
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center group"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Hurricane Card */}
              <div className="group relative bg-gradient-to-br from-teal-800 via-teal-900 to-blue-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Hurricane"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                <div className="relative p-8 h-80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Hurricane
                      </span>
                      <span className="bg-teal-800/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      Hurricane Recovery Efforts
                    </h3>
                    <p className="text-teal-100 text-sm leading-relaxed mb-4">
                      Category 3 hurricane made landfall. Emergency shelters activated, power restoration in progress across affected areas.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-teal-200">
                        <MapPin size={14} className="mr-2" />
                        Miami
                      </div>
                      <div className="flex items-center text-teal-200">
                        <Clock size={14} className="mr-2" />
                        Jan 5
                      </div>
                    </div>
                    <Link
                      to="/reports/4"
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center group"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Industrial Accident Card */}
              <div className="group relative bg-gradient-to-br from-amber-800 via-amber-900 to-orange-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Industrial Accident"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                <div className="relative p-8 h-80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Industrial
                      </span>
                      <span className="bg-amber-800/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      Chemical Plant Incident
                    </h3>
                    <p className="text-amber-100 text-sm leading-relaxed mb-4">
                      Minor chemical leak contained at industrial facility. Evacuation zone established, air quality monitoring in progress.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-amber-200">
                        <MapPin size={14} className="mr-2" />
                        Houston
                      </div>
                      <div className="flex items-center text-amber-200">
                        <Clock size={14} className="mr-2" />
                        Jan 3
                      </div>
                    </div>
                    <Link
                      to="/reports/5"
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center group"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Section with Interactive Slider */}
        <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-slate-100/30 rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 border border-blue-200 text-sm font-bold mb-8 text-blue-700">
                <Shield size={18} className="mr-2" />
                {t('home.safety.subtitle')}
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                  {t('home.safety.title')}
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {t('home.safety.description')}
              </p>
            </div>

            {/* Safety Slider */}
            <div
              className="relative"
              role="region"
              aria-label="Safety tips and emergency preparedness"
              onMouseEnter={() => setSafetySliderPaused(true)}
              onMouseLeave={() => setSafetySliderPaused(false)}
            >
              {/* Slider Container */}
              <div className="relative h-[600px] lg:h-[500px] overflow-hidden rounded-3xl shadow-2xl" role="img" aria-live="polite">
                {safetyContent.map((item, index) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentSafetySlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex items-center">
                      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                          {/* Left Side - Content */}
                          <div className="text-white">
                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl mb-6`}>
                              <item.icon size={32} />
                            </div>

                            <h3 className="text-4xl lg:text-5xl font-black mb-6 leading-tight drop-shadow-2xl">
                              {item.title}
                            </h3>

                            <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow-lg">
                              {item.description}
                            </p>

                            {/* Tips List */}
                            <div className="space-y-3">
                              {item.tips.map((tip, tipIndex) => (
                                <div key={tipIndex} className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mt-1">
                                    <CheckCircle size={14} className="text-white" />
                                  </div>
                                  <span className="text-white/90 font-medium">{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right Side - Visual Element */}
                          <div className="hidden lg:block">
                            <div className={`bg-gradient-to-br ${item.bgGradient} rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-sm`}>
                              <div className="text-center">
                                <div className={`inline-flex p-8 rounded-3xl bg-gradient-to-br ${item.gradient} text-white shadow-xl mb-6`}>
                                  <item.icon size={48} />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h4>
                                <p className="text-gray-700 leading-relaxed">
                                  Essential knowledge for emergency preparedness and disaster response.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <button
                onClick={prevSafetySlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 group focus:outline-none focus:ring-4 focus:ring-white/50 rounded-full"
                aria-label={`Previous safety tip. Currently showing ${safetyContent[currentSafetySlide]?.title}`}
                tabIndex={0}
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-full hover:bg-white/20 hover:border-white/40 focus:bg-white/20 transition-all duration-300 transform hover:scale-110 shadow-2xl">
                  <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
                </div>
              </button>

              <button
                onClick={nextSafetySlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 group focus:outline-none focus:ring-4 focus:ring-white/50 rounded-full"
                aria-label={`Next safety tip. Currently showing ${safetyContent[currentSafetySlide]?.title}`}
                tabIndex={0}
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-full hover:bg-white/20 hover:border-white/40 focus:bg-white/20 transition-all duration-300 transform hover:scale-110 shadow-2xl">
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20" role="tablist" aria-label="Safety tips navigation">
                <div className="flex justify-center space-x-3">
                  {safetyContent.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => goToSafetySlide(index)}
                      className={`relative transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/70 rounded-full ${
                        index === currentSafetySlide
                          ? 'w-12 h-3 bg-white rounded-full shadow-lg'
                          : 'w-3 h-3 bg-white/40 rounded-full hover:bg-white/70'
                      }`}
                      aria-label={`Go to safety tip ${index + 1}: ${item.title}`}
                      aria-selected={index === currentSafetySlide}
                      role="tab"
                      tabIndex={index === currentSafetySlide ? 0 : -1}
                    >
                      {index === currentSafetySlide && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full opacity-80 animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="h-1 bg-white/20">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-blue-400 transition-all duration-300 shadow-lg"
                    style={{ width: `${((currentSafetySlide + 1) / safetyContent.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Role-based Call to Action Section */}
        {canCreateReports ? (
          /* Emergency Reporting Section - For Admin/CJ Users */
          <section className="py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-300/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-2xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-red-600/20 backdrop-blur-xl border border-red-400/30 text-sm font-semibold mb-6 text-red-100 shadow-lg">
                <AlertTriangle size={16} className="mr-2 text-red-300" />
                {t('home.cta.emergencyResponse.subtitle')}
              </div>

              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-100 via-orange-200 to-red-100">
                  {t('home.cta.emergencyResponse.title')}
                </span>
              </h2>

              <p className="text-xl text-blue-50 mb-16 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
                {t('home.cta.emergencyResponse.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
                <Link
                  to="/report/new"
                  className="group bg-red-600 text-white px-12 py-5 rounded-2xl text-lg font-bold hover:bg-red-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-xl"
                >
                  <AlertTriangle size={22} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                  {t('home.cta.emergencyResponse.reportEmergency')}
                  <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/reports"
                  className="group bg-blue-600/20 backdrop-blur-xl border border-blue-400/40 text-blue-100 px-12 py-5 rounded-2xl text-lg font-bold hover:bg-blue-500/30 hover:border-blue-300/60 hover:text-white hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  <Eye size={22} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                  {t('home.cta.emergencyResponse.viewReports')}
                </Link>
              </div>
            </div>
          </section>
        ) : (
          /* Volunteer Hero Section - For Regular Users */
          <section className="py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-300/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-2xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600/20 backdrop-blur-xl border border-blue-400/30 text-sm font-semibold mb-6 text-blue-100 shadow-lg">
                <Heart size={16} className="mr-2 text-blue-300" />
                {t('home.cta.volunteer.subtitle')}
              </div>

              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-100">
                  {t('home.cta.volunteer.title')}
                </span>
              </h2>

              <p className="text-xl text-blue-50 mb-16 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
                {t('home.cta.volunteer.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
                <Link
                  to="/volunteer/register"
                  className="group bg-white text-blue-700 px-12 py-5 rounded-2xl text-lg font-bold hover:bg-blue-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-xl"
                >
                  <Heart size={22} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                  {t('home.cta.volunteer.becomeVolunteer')}
                  <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/volunteer/opportunities"
                  className="group bg-blue-600/20 backdrop-blur-xl border border-blue-400/40 text-blue-100 px-12 py-5 rounded-2xl text-lg font-bold hover:bg-blue-500/30 hover:border-blue-300/60 hover:text-white hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  <Users size={22} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                  {t('home.cta.volunteer.viewOpportunities')}
                </Link>
              </div>

              {/* Role-based Contact/Support Grid */}
              {canCreateReports ? (
                /* Emergency Contact Grid - For Admin/CJ Users */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group bg-blue-600/15 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/25 hover:bg-blue-500/20 hover:border-blue-300/40 hover:scale-105 transition-all duration-300 shadow-lg">
                    <Phone className="mx-auto mb-4 text-blue-200 group-hover:text-blue-100 group-hover:scale-110 transition-all duration-300" size={36} />
                    <h3 className="text-xl font-bold text-white mb-3">{t('home.cta.emergencyResponse.emergencyLine')}</h3>
                    <p className="text-blue-100 text-base font-semibold">+1 (555) 123-4567</p>
                  </div>

                  <div className="group bg-blue-600/15 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/25 hover:bg-blue-500/20 hover:border-blue-300/40 hover:scale-105 transition-all duration-300 shadow-lg">
                    <Mail className="mx-auto mb-4 text-blue-200 group-hover:text-blue-100 group-hover:scale-110 transition-all duration-300" size={36} />
                    <h3 className="text-xl font-bold text-white mb-3">{t('home.cta.emergencyResponse.emergencyCoordination')}</h3>
                    <p className="text-blue-100 text-base font-semibold">emergency@disasterwatch.com</p>
                  </div>

                  <div className="group bg-blue-600/15 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/25 hover:bg-blue-500/20 hover:border-blue-300/40 hover:scale-105 transition-all duration-300 shadow-lg">
                    <Headphones className="mx-auto mb-4 text-blue-200 group-hover:text-blue-100 group-hover:scale-110 transition-all duration-300" size={36} />
                    <h3 className="text-xl font-bold text-white mb-3">{t('home.cta.emergencyResponse.commandCenter')}</h3>
                    <p className="text-blue-100 text-base font-semibold">{t('home.cta.emergencyResponse.available24x7')}</p>
                  </div>
                </div>
              ) : (
                /* Volunteer Support Grid - For Regular Users */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group bg-blue-600/15 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/25 hover:bg-blue-500/20 hover:border-blue-300/40 hover:scale-105 transition-all duration-300 shadow-lg">
                    <Phone className="mx-auto mb-4 text-blue-200 group-hover:text-blue-100 group-hover:scale-110 transition-all duration-300" size={36} />
                    <h3 className="text-xl font-bold text-white mb-3">{t('home.cta.volunteer.volunteerHotline')}</h3>
                    <p className="text-blue-100 text-base font-semibold">+1 (555) 987-6543</p>
                  </div>

                  <div className="group bg-blue-600/15 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/25 hover:bg-blue-500/20 hover:border-blue-300/40 hover:scale-105 transition-all duration-300 shadow-lg">
                    <Mail className="mx-auto mb-4 text-blue-200 group-hover:text-blue-100 group-hover:scale-110 transition-all duration-300" size={36} />
                    <h3 className="text-xl font-bold text-white mb-3">{t('home.cta.volunteer.volunteerSupport')}</h3>
                    <p className="text-blue-100 text-base font-semibold">volunteers@disasterwatch.com</p>
                  </div>

                  <div className="group bg-blue-600/15 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/25 hover:bg-blue-500/20 hover:border-blue-300/40 hover:scale-105 transition-all duration-300 shadow-lg">
                    <Headphones className="mx-auto mb-4 text-blue-200 group-hover:text-blue-100 group-hover:scale-110 transition-all duration-300" size={36} />
                    <h3 className="text-xl font-bold text-white mb-3">{t('home.cta.volunteer.trainingSupport')}</h3>
                    <p className="text-blue-100 text-base font-semibold">{t('home.cta.volunteer.availableMonFri')}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <ChatWidget />

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 z-50 group"
          aria-label="Scroll to top"
        >
          <ArrowRight size={24} className="rotate-[-90deg] group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};

export default Home;