import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Shield,
  Play,
  ChevronLeft,
  ChevronRight,
  Globe,
  TrendingUp,
  Heart,
  Users,
  Clock,
  Zap,
  Star,
  BarChart3,
  Waves
} from 'lucide-react';

// Components
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ChatWidget from '../components/Chat/ChatWidget';

import { useAuth } from '../hooks/useAuth';
import { useRoles } from '../hooks/useRoles';

const HomeClean: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Auth and roles
  const { isAuthenticated } = useAuth();
  const { isOnlyUser } = useRoles();

  // Check permissions
  const canCreateReports = !isAuthenticated || !isOnlyUser();

  // Hero content with clean, modern ocean theme
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Ocean Intelligence Platform',
      subtitle: 'Advanced maritime safety powered by AI and real-time ocean data analytics',
      stats: { value: '24/7', label: 'Global Coverage' }
    },
    {
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Smart Maritime Network',
      subtitle: 'Connecting vessels, ports, and coastal communities for safer seas',
      stats: { value: '99.9%', label: 'System Reliability' }
    },
    {
      image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
      title: 'Predictive Ocean Analytics',
      subtitle: 'Machine learning forecasts for proactive maritime safety',
      stats: { value: '15M+', label: 'Data Points Daily' }
    }
  ];

  // Clean, modern statistics
  const stats = [
    {
      icon: Waves,
      value: '2.4M',
      label: 'Ocean Data Points',
      description: 'Collected daily',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Star,
      value: '99.8%',
      label: 'Accuracy Rate',
      description: 'Prediction precision',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      icon: BarChart3,
      value: '156',
      label: 'Active Stations',
      description: 'Monitoring globally',
      color: 'from-indigo-600 to-purple-600'
    },
    {
      icon: Globe,
      value: '24/7',
      label: 'Live Monitoring',
      description: 'Always active',
      color: 'from-slate-600 to-gray-600'
    }
  ];

  // Clean, modern features
  const features = [
    {
      icon: Shield,
      title: 'Advanced Safety Systems',
      description: 'AI-powered risk assessment and automated emergency response protocols for maximum protection.',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      icon: Users,
      title: 'Global Network',
      description: 'Connected maritime professionals and coastal communities sharing real-time insights.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      icon: Zap,
      title: 'Instant Intelligence',
      description: 'Lightning-fast data processing with predictive analytics for proactive safety measures.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-purple-600 to-indigo-600'
    }
  ];

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

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
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-800/50 to-slate-900/70"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/30"></div>
              </div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                {/* Left Content */}
                <div className="lg:col-span-7 text-white">
                  {/* Trust Badge */}
                  <div className="inline-flex items-center px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium mb-8">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
                    <Globe size={16} className="mr-2 text-cyan-300" />
                    <span className="text-white/95">Live Ocean Monitoring</span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] mb-8">
                    <span className="block text-white mb-3">Ocean Intelligence</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                      Platform
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl font-light">
                    Advanced maritime safety platform powered by AI and real-time ocean analytics. 
                    Connecting global maritime networks for intelligent, proactive safety solutions.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-5 mb-16">
                    {canCreateReports ? (
                      <Link
                        to="/report/new"
                        className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-5 rounded-2xl text-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                        <AlertTriangle size={22} className="mr-3" />
                        Report Emergency
                        <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <Link
                        to="/reports"
                        className="group bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                        <Heart size={22} className="mr-3" />
                        View Reports
                        <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}

                    <button className="group bg-white/10 backdrop-blur-xl border border-white/30 text-white px-10 py-5 rounded-2xl text-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center hover:scale-105">
                      <Play size={22} className="mr-3" />
                      Watch Demo
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap items-center gap-8 text-sm text-white/85">
                    <div className="flex items-center space-x-3">
                      <Clock className="text-cyan-300" size={18} />
                      <span className="font-medium">24/7 Ocean Watch</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="text-emerald-300" size={18} />
                      <span className="font-medium">Certified Safe</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="text-blue-300" size={18} />
                      <span className="font-medium">Global Maritime Network</span>
                    </div>
                  </div>
                </div>

                {/* Right Content - Stats Card */}
                <div className="lg:col-span-5">
                  <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-xl">
                    {/* Live Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 border border-blue-400/30 text-sm font-semibold mb-4">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-white">Live Data</span>
                    </div>

                    {/* Current Slide Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {heroSlides[currentSlide].title}
                      </h3>
                      <p className="text-white/85 text-base">
                        {heroSlides[currentSlide].subtitle}
                      </p>
                    </div>
                    
                    {/* Stats */}
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 text-center mb-6">
                      <div className="text-3xl font-bold text-white mb-1">
                        {heroSlides[currentSlide].stats.value}
                      </div>
                      <div className="text-white/75 text-sm font-medium">
                        {heroSlides[currentSlide].stats.label}
                      </div>
                    </div>

                    {/* Slide Indicators */}
                    <div className="flex justify-center space-x-2">
                      {heroSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`transition-all duration-300 ${
                            index === currentSlide
                              ? 'w-8 h-2 bg-white rounded-full'
                              : 'w-2 h-2 bg-white/40 rounded-full hover:bg-white/60'
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
        <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-5 py-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 shadow-sm">
                <TrendingUp size={16} className="mr-2" />
                Real-Time Ocean Intelligence
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Powering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Maritime Safety</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our advanced platform processes millions of data points daily to deliver 
                predictive insights and real-time monitoring for safer maritime operations.
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

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Maritime Solutions</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From predictive analytics to emergency response, our comprehensive platform 
                delivers the intelligence and tools needed for safer maritime operations.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
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
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Maritime Safety?
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Join maritime professionals worldwide using our platform to enhance 
                safety, optimize operations, and protect our oceans.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link
                  to="/signup"
                  className="group bg-white text-slate-900 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  Learn More
                </Link>
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
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 z-50"
        >
          <ArrowRight size={20} className="transform -rotate-90" />
        </button>
      )}
    </div>
  );
};

export default HomeClean;