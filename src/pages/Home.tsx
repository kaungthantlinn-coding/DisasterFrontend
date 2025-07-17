import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Real-world disaster data
  const { disasters, loading: disastersLoading, error: disastersError, statistics, refresh } = useDisasterData({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    includeSignificantOnly: true,
  });

  // Beautiful hero images with enhanced data
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Emergency Response',
      description: 'Rapid coordination when every second counts',
      category: 'Response',
      stats: { primary: '15K', secondary: 'Lives Saved', tertiary: '48hrs', quaternary: 'Response Time' }
    },
    {
      url: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Community Unity',
      description: 'Bringing people together in times of crisis',
      category: 'Community',
      stats: { primary: '50K', secondary: 'Communities', tertiary: '24/7', quaternary: 'Support' }
    },
    {
      url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
      title: 'Weather Monitoring',
      description: 'Advanced early warning systems',
      category: 'Prevention',
      stats: { primary: '99.8%', secondary: 'Accuracy', tertiary: '12min', quaternary: 'Alert Time' }
    },
    {
      url: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Recovery & Rebuild',
      description: 'Supporting communities through recovery',
      category: 'Recovery',
      stats: { primary: '2.4M', secondary: 'People Helped', tertiary: '89', quaternary: 'Countries' }
    }
  ];

  // Beautiful statistics with enhanced styling - now using real data
  const stats = [
    {
      label: "Active Disasters",
      value: statistics ? statistics.totalActive.toLocaleString() : (disastersLoading ? "..." : "0"),
      icon: AlertTriangle,
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50",
      description: "Real-time incidents"
    },
    {
      label: "Critical Events",
      value: statistics ? statistics.critical.toLocaleString() : (disastersLoading ? "..." : "0"),
      icon: Heart,
      gradient: "from-red-600 to-red-500",
      bgGradient: "from-red-50 to-red-50",
      description: "Urgent situations"
    },
    {
      label: "High Severity",
      value: statistics ? statistics.high.toLocaleString() : (disastersLoading ? "..." : "0"),
      icon: CheckCircle,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-50",
      description: "Major incidents"
    },
    {
      label: "Data Sources",
      value: "USGS",
      icon: Globe,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      description: "Live monitoring"
    }
  ];

  // Safety tips and emergency preparedness content
  const safetyContent = [
    {
      id: 1,
      title: "Emergency Kit Essentials",
      description: "Prepare a comprehensive emergency kit with water, non-perishable food, flashlight, first aid supplies, and important documents. Keep enough supplies for at least 72 hours.",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      tips: [
        "1 gallon of water per person per day",
        "Non-perishable food for 3+ days",
        "Battery-powered radio and flashlight",
        "First aid kit and medications"
      ]
    },
    {
      id: 2,
      title: "Evacuation Planning",
      description: "Create and practice evacuation routes with your family. Know multiple ways to exit your home and neighborhood, and establish meeting points.",
      icon: MapPin,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      tips: [
        "Plan primary and alternate routes",
        "Practice evacuation drills regularly",
        "Identify safe meeting locations",
        "Keep vehicle fuel tanks full"
      ]
    },
    {
      id: 3,
      title: "Communication Strategy",
      description: "Establish a family communication plan with out-of-state contacts. Ensure everyone knows how to reach each other during emergencies.",
      icon: Phone,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      tips: [
        "Designate out-of-state contact person",
        "Program emergency numbers in phones",
        "Keep written contact information",
        "Learn text messaging for emergencies"
      ]
    },
    {
      id: 4,
      title: "Home Safety Measures",
      description: "Secure your home against disasters by installing smoke detectors, securing heavy furniture, and knowing utility shut-off locations.",
      icon: HomeIcon,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      tips: [
        "Install smoke and carbon monoxide detectors",
        "Secure heavy furniture and appliances",
        "Know utility shut-off locations",
        "Maintain fire extinguishers"
      ]
    },
    {
      id: 5,
      title: "Community Preparedness",
      description: "Connect with neighbors and local emergency services. Join community emergency response teams and stay informed about local hazards.",
      icon: Users,
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-teal-500 to-blue-500",
      bgGradient: "from-teal-50 to-blue-50",
      tips: [
        "Know your neighbors and their skills",
        "Join local emergency response teams",
        "Stay informed about local hazards",
        "Participate in community drills"
      ]
    },
    {
      id: 6,
      title: "Digital Preparedness",
      description: "Back up important documents digitally, keep devices charged, and download emergency apps for real-time alerts and information.",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      tips: [
        "Back up documents to cloud storage",
        "Keep portable chargers ready",
        "Download emergency alert apps",
        "Store digital copies of IDs"
      ]
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
        {/* Stunning Hero Section */}
        <section className="relative h-screen overflow-hidden">
          {/* Dynamic Background with Smooth Transitions */}
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
            ))}
          </div>

          {/* Floating Animated Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                {/* Left Content - 7 columns */}
                <div className="lg:col-span-7 text-white">
                  {/* Trust Badge */}
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium mb-8 hover:bg-white/15 transition-all duration-300 group">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <Sparkles size={16} className="mr-2 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-white/90">Trusted by 50,000+ communities worldwide</span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-5xl lg:text-8xl font-black leading-[0.9] mb-8 tracking-tight">
                    <span className="block text-white drop-shadow-2xl">Unite</span>
                    <span className="block text-white drop-shadow-2xl">Communities</span>
                    <span className="block">
                      <span className="text-white drop-shadow-2xl">in </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-2xl animate-pulse">
                        Crisis
                      </span>
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl font-light drop-shadow-lg">
                    The world's most advanced disaster management platform. Connect communities, 
                    coordinate responses, and save lives through intelligent technology.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 mb-16">
                    <Link
                      to="/report/new"
                      className="group relative bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:from-red-600 hover:via-red-700 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <AlertTriangle size={22} className="mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="relative z-10">Report Emergency</span>
                      <ArrowRight size={22} className="ml-3 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                    </Link>

                    <button className="group bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1">
                      <Play size={22} className="mr-3 group-hover:scale-125 transition-transform duration-300" />
                      <span>Watch Demo</span>
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap items-center gap-8 text-sm text-white/80">
                    <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300 group">
                      <Star className="text-yellow-400 fill-current group-hover:rotate-12 transition-transform duration-300" size={18} />
                      <span className="font-medium">4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300 group">
                      <Award className="text-blue-400 group-hover:rotate-12 transition-transform duration-300" size={18} />
                      <span className="font-medium">Award Winning</span>
                    </div>
                    <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300 group">
                      <Shield className="text-green-400 group-hover:rotate-12 transition-transform duration-300" size={18} />
                      <span className="font-medium">ISO Certified</span>
                    </div>
                  </div>
                </div>

                {/* Right Content - Elegant Info Card - 5 columns */}
                <div className="lg:col-span-5 relative">
                  <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 transform hover:scale-105">
                    {/* Category Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-white/30 text-sm font-bold mb-6 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      <span className="text-white">{heroImages[currentSlide].category}</span>
                    </div>

                    {/* Slide Content */}
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                        {heroImages[currentSlide].title}
                      </h3>
                      <p className="text-white/80 text-lg leading-relaxed">
                        {heroImages[currentSlide].description}
                      </p>
                    </div>
                    
                    {/* Beautiful Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                        <div className="text-3xl font-black text-white mb-1">
                          {heroImages[currentSlide].stats.primary}
                        </div>
                        <div className="text-white/70 text-sm font-medium">
                          {heroImages[currentSlide].stats.secondary}
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                        <div className="text-3xl font-black text-white mb-1">
                          {heroImages[currentSlide].stats.tertiary}
                        </div>
                        <div className="text-white/70 text-sm font-medium">
                          {heroImages[currentSlide].stats.quaternary}
                        </div>
                      </div>
                    </div>

                    {/* Elegant Slider Dots */}
                    <div className="flex justify-center space-x-3">
                      {heroImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`relative transition-all duration-500 ${
                            index === currentSlide 
                              ? 'w-10 h-3 bg-white rounded-full shadow-lg' 
                              : 'w-3 h-3 bg-white/40 rounded-full hover:bg-white/70'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        >
                          {index === currentSlide && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-80 animate-pulse"></div>
                          )}
                        </button>
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
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-8 hover:bg-blue-200 transition-colors duration-300">
                <TrendingUp size={18} className="mr-2" />
                Real-Time Impact Metrics
              </div>
              <h2 className="text-4xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
                Making a
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  Real Impact
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our platform transforms disaster response globally, connecting communities and saving lives through advanced technology and seamless coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-white/50`}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-5 rounded-3xl bg-gradient-to-br ${stat.gradient} text-white shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <stat.icon size={36} />
                    </div>
                    <div className="text-5xl font-black text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-800 font-bold text-lg mb-1">{stat.label}</div>
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
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-bold mb-8 text-white">
                <Globe size={18} className="mr-2" />
                Live Global Impact
              </div>
              <h2 className="text-4xl lg:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
                Making Real
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
                  Impact Worldwide
                </span>
              </h2>
              <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
                Our platform coordinates real-time disaster response across the globe. See live incidents,
                active response teams, and communities we're helping right now.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Live Map Interface */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  {/* Map Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Live Disaster Map</h3>
                    <div className="flex items-center space-x-3">
                      {!disastersLoading && !disastersError && (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-300 text-sm font-medium">Live Updates</span>
                        </div>
                      )}
                      {disastersLoading && (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                          <span className="text-blue-300 text-sm font-medium">Loading...</span>
                        </div>
                      )}
                      {disastersError && (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span className="text-red-300 text-sm font-medium">Error</span>
                        </div>
                      )}
                      <button
                        onClick={refresh}
                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                        title="Refresh data"
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
                          <p className="text-lg font-semibold mb-2">Unable to load disaster data</p>
                          <p className="text-sm text-gray-300 mb-4">{disastersError}</p>
                          <button
                            onClick={refresh}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Try Again
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
                          <span className="text-white">Critical</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                          <span className="text-white">High</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-white">Medium</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                          <span className="text-white">Low</span>
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
                            case 'critical': return 'bg-red-500';
                            case 'high': return 'bg-orange-500';
                            case 'medium': return 'bg-yellow-500';
                            case 'low': return 'bg-green-500';
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
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-white font-medium">Thailand Emergency Team</div>
                          <div className="text-white/60 text-sm">Flood Response - Chiang Rai</div>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm font-medium">Active</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
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

                {/* Quick Actions */}
                <div className="flex space-x-4">
                  <Link
                    to="/reports"
                    className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
                  >
                    <Eye size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                    View All Reports
                  </Link>
                  <Link
                    to="/report/new"
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-2xl font-bold hover:from-red-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center group"
                  >
                    <AlertTriangle size={20} className="mr-2 group-hover:rotate-12 transition-transform" />
                    Report Now
                  </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Flash Flood Card */}
              <div className="group relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Flash Flood"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                
                <div className="relative p-8 h-80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Flash Flood
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
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
              <div className="group relative bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
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
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Wildfire
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      Wildfire Damage Assessment
                    </h3>
                    <p className="text-orange-100 text-sm leading-relaxed mb-4">
                      Fast-moving wildfire has damaged several residential properties and threatens surrounding forest areas.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-orange-200">
                        <MapPin size={14} className="mr-2" />
                        Los Angeles
                      </div>
                      <div className="flex items-center text-orange-200">
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
              <div className="group relative bg-gradient-to-br from-purple-900 via-pink-800 to-red-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
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
                      <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Tornado
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
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
              <div className="group relative bg-gradient-to-br from-gray-900 via-slate-800 to-stone-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
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
                      <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Earthquake
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      M5.2 Earthquake Response
                    </h3>
                    <p className="text-gray-100 text-sm leading-relaxed mb-4">
                      Moderate earthquake shook the region. Infrastructure assessment ongoing, minor structural damage reported in older buildings.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-200">
                        <MapPin size={14} className="mr-2" />
                        San Francisco
                      </div>
                      <div className="flex items-center text-gray-200">
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
              <div className="group relative bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
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
                      <span className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Hurricane
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
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
              <div className="group relative bg-gradient-to-br from-amber-900 via-orange-800 to-red-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
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
                      <span className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Industrial
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
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
        <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-blue-50/30 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-100/30 rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-100 border border-emerald-200 text-sm font-bold mb-8 text-emerald-700">
                <Shield size={18} className="mr-2" />
                Emergency Preparedness
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight">
                Stay Safe &
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-blue-600">
                  Be Prepared
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Essential safety tips and emergency preparedness guidelines to protect you and your loved ones during disasters. Knowledge saves lives.
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

        {/* Stunning Call to Action */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-yellow-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-bold mb-8 text-white">
              <Target size={18} className="mr-2" />
              Join the Movement
            </div>

            <h2 className="text-4xl lg:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
              Ready to Make a
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
                Difference?
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-16 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              Join thousands of communities worldwide in building a safer, more connected world. Every second counts in disaster response.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
              <Link
                to="/report/new"
                className="group bg-white text-blue-600 px-12 py-6 rounded-2xl text-xl font-black hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex items-center justify-center"
              >
                <AlertTriangle size={24} className="mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Report Emergency
                <ArrowRight size={24} className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/reports"
                className="group bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white px-12 py-6 rounded-2xl text-xl font-black hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <Eye size={24} className="mr-3 group-hover:scale-125 transition-transform duration-300" />
                View Reports
              </Link>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Phone className="mx-auto mb-4 text-blue-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" size={36} />
                <h3 className="text-xl font-bold text-white mb-2">24/7 Emergency Line</h3>
                <p className="text-blue-200 text-lg font-medium">+1 (555) 123-4567</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Mail className="mx-auto mb-4 text-blue-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" size={36} />
                <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                <p className="text-blue-200 text-lg font-medium">emergency@disasterwatch.com</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Headphones className="mx-auto mb-4 text-blue-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" size={36} />
                <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
                <p className="text-blue-200 text-lg font-medium">Available 24/7</p>
              </div>
            </div>
          </div>
        </section>
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