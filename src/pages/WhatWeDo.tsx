import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import {
  AlertTriangle,
  Shield,
  Users,
  Globe,
  Zap,
  Eye,
  Heart,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Brain,
  Satellite,
  Radio,
  Smartphone,
  Monitor,
  Database,
  Cloud,
  Wifi,
  Bell,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Layers,
  Network,
  Cpu,
  Server,
  Lock,
  Key,
  FileText,
  MessageSquare,
  Video,
  Camera,
  Mic,
  Share2,
  Download,
  Upload,
  Search,
  Filter,
  Settings,
  Sliders,
  Calendar,
  Timer,
  Gauge,
  Compass,
  Navigation,
  Route,
  Map,
  Building,
  Home,
  School,
  Hospital,
  Factory,
  TreePine,
  Mountain,
  Waves,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  Thermometer,
  Droplets,
  Flame,
  Tornado,
  Earthquake,
  Volcano,
  FloodFill,
  Trophy
} from 'lucide-react';

const WhatWeDo: React.FC = () => {
  const [activeService, setActiveService] = useState(0);
  const [isProcessPlaying, setIsProcessPlaying] = useState(false);

  const coreServices = [
    {
      icon: AlertTriangle,
      title: "Disaster Reporting",
      subtitle: "Real-Time Emergency Detection",
      description: "Advanced incident reporting system that enables communities to instantly alert authorities and neighbors about emergencies with precise location data and multimedia evidence.",
      features: [
        "Instant multi-channel notifications",
        "GPS location tracking with precision mapping",
        "Photo, video, and audio evidence capture",
        "Multi-language support (50+ languages)",
        "Offline reporting capabilities",
        "Anonymous reporting options"
      ],
      benefits: [
        "Reduces emergency response time by 60%",
        "Increases reporting accuracy by 85%",
        "Enables 24/7 community monitoring"
      ],
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-50 to-orange-50",
      caseStudy: "Helped coordinate response to 2023 Turkey earthquake, processing 10,000+ reports in first 24 hours"
    },
    {
      icon: Eye,
      title: "Response Coordination",
      subtitle: "Intelligent Emergency Management",
      description: "AI-powered coordination platform that optimizes resource allocation, streamlines communication, and ensures effective collaboration between emergency responders and volunteers.",
      features: [
        "AI-driven resource optimization",
        "Real-time team communication",
        "Dynamic task assignment and tracking",
        "Progress monitoring and analytics",
        "Cross-agency coordination tools",
        "Volunteer management system"
      ],
      benefits: [
        "Improves coordination efficiency by 70%",
        "Reduces resource waste by 45%",
        "Enables seamless multi-agency collaboration"
      ],
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      caseStudy: "Coordinated Hurricane Ian response across 15 agencies, managing 5,000+ volunteers effectively"
    },
    {
      icon: Shield,
      title: "Early Warning System",
      subtitle: "Predictive Disaster Prevention",
      description: "Advanced monitoring and prediction system that analyzes environmental data to provide early warnings and help communities prepare before disasters strike.",
      features: [
        "Multi-sensor environmental monitoring",
        "AI-powered disaster prediction",
        "Automated alert distribution",
        "Risk assessment and mapping",
        "Evacuation route optimization",
        "Community preparedness tools"
      ],
      benefits: [
        "Provides 2-6 hours advance warning",
        "Reduces disaster impact by 40%",
        "Saves lives through early evacuation"
      ],
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      caseStudy: "Prevented 500+ casualties during 2023 Pakistan floods with 4-hour advance warnings"
    },
    {
      icon: Users,
      title: "Community Network",
      subtitle: "Resilient Community Building",
      description: "Comprehensive platform that connects neighbors, volunteers, and organizations to build stronger, more resilient communities through collaboration and resource sharing.",
      features: [
        "Skill-based volunteer matching",
        "Community resource sharing",
        "Neighborhood watch networks",
        "Emergency preparedness training",
        "Local organization coordination",
        "Community resilience scoring"
      ],
      benefits: [
        "Increases community preparedness by 80%",
        "Builds local response capacity",
        "Strengthens social cohesion"
      ],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      caseStudy: "Built resilient networks in 200+ communities, training 50,000+ local responders"
    }
  ];

  const technologyFeatures = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Advanced algorithms for pattern recognition, risk assessment, and predictive analytics",
      capabilities: ["Disaster prediction", "Resource optimization", "Pattern analysis", "Risk modeling"]
    },
    {
      icon: Satellite,
      title: "Satellite Integration",
      description: "Real-time satellite imagery and data for comprehensive disaster monitoring",
      capabilities: ["Global coverage", "Real-time imagery", "Weather monitoring", "Damage assessment"]
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Scalable, secure cloud platform ensuring 99.9% uptime during critical moments",
      capabilities: ["Global scalability", "Data security", "Real-time sync", "Disaster recovery"]
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized mobile applications for field workers and community members",
      capabilities: ["Offline functionality", "Cross-platform", "Voice commands", "Quick reporting"]
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Detection & Reporting",
      description: "Community members, sensors, or AI systems detect and report potential disasters",
      icon: AlertTriangle,
      details: [
        "Multiple reporting channels (mobile, web, sensors)",
        "Automatic validation and verification",
        "Immediate alert distribution",
        "Location and severity assessment"
      ],
      color: "from-red-500 to-orange-500"
    },
    {
      step: 2,
      title: "Analysis & Verification",
      description: "AI systems and expert teams analyze reports to determine severity and response needs",
      icon: Brain,
      details: [
        "AI-powered threat assessment",
        "Expert verification process",
        "Risk level categorization",
        "Resource requirement calculation"
      ],
      color: "from-blue-500 to-indigo-500"
    },
    {
      step: 3,
      title: "Coordination & Deployment",
      description: "Resources, responders, and volunteers are coordinated for optimal response",
      icon: Users,
      details: [
        "Optimal resource allocation",
        "Team coordination and communication",
        "Real-time progress tracking",
        "Dynamic task assignment"
      ],
      color: "from-emerald-500 to-green-500"
    },
    {
      step: 4,
      title: "Support & Recovery",
      description: "Ongoing assistance and recovery coordination to help communities rebuild",
      icon: Heart,
      details: [
        "Long-term recovery planning",
        "Community support coordination",
        "Resource distribution tracking",
        "Impact assessment and reporting"
      ],
      color: "from-purple-500 to-pink-500"
    }
  ];

  const impactMetrics = [
    { number: "2.3M", label: "Lives Protected", icon: Shield, color: "from-blue-500 to-indigo-600" },
    { number: "156", label: "Countries Served", icon: Globe, color: "from-emerald-500 to-green-600" },
    { number: "50K+", label: "Volunteers Connected", icon: Users, color: "from-purple-500 to-pink-600" },
    { number: "24/7", label: "Emergency Response", icon: Clock, color: "from-orange-500 to-red-600" },
    { number: "98%", label: "Response Success Rate", icon: Target, color: "from-teal-500 to-cyan-600" },
    { number: "15min", label: "Average Response Time", icon: Timer, color: "from-yellow-500 to-orange-600" }
  ];

  const caseStudies = [
    {
      title: "Turkey Earthquake Response 2023",
      location: "Turkey & Syria",
      impact: "10,000+ reports processed, 5,000+ lives saved",
      description: "Coordinated international response effort across multiple countries and organizations",
      image: "/api/placeholder/400/250",
      metrics: ["72 hours", "15 countries", "200+ organizations"]
    },
    {
      title: "Hurricane Ian Recovery",
      location: "Florida, USA",
      impact: "50,000+ evacuated safely, $2B damage prevented",
      description: "Early warning system provided 6-hour advance notice enabling mass evacuation",
      image: "/api/placeholder/400/250",
      metrics: ["6 hours warning", "50K evacuated", "Zero casualties"]
    },
    {
      title: "Pakistan Flood Prevention",
      location: "Punjab Province",
      impact: "500+ casualties prevented, 100K+ people warned",
      description: "AI prediction system identified flood risk 4 hours before traditional methods",
      image: "/api/placeholder/400/250",
      metrics: ["4 hours early", "100K warned", "500 lives saved"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Header />

      <main className="pt-16">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Floating decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/30 to-red-500/30 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-full blur-xl animate-pulse delay-500"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-8">
                <Sparkles size={18} className="mr-2 text-yellow-400" />
                Comprehensive Disaster Management Solutions
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
                What We
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
                  Do
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12 font-medium">
                We provide comprehensive disaster management solutions that save lives, protect communities,
                and build resilience against future emergencies through cutting-edge technology and human compassion.
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  to="/reports"
                  className="group bg-gradient-to-r from-red-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center">
                    <AlertTriangle size={20} className="mr-2" />
                    Report Emergency
                  </span>
                </Link>
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
                >
                  <Play size={20} className="mr-2" />
                  Explore Services
                </button>
              </div>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {coreServices.map((service, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    <service.icon size={32} className="text-white" />
                  </div>
                  <div className="text-white font-bold text-lg mb-2">{service.title}</div>
                  <div className="text-blue-200 text-sm">{service.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Our Core Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive, technology-driven solutions designed to handle every aspect of disaster management,
                from early detection to long-term recovery.
              </p>
            </div>

            {/* Service Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-gray-100 rounded-2xl p-2 inline-flex">
                {coreServices.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveService(index)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                      activeService === index
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <service.icon size={20} className="mr-2" />
                    {service.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Service Display */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-12 mb-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  {(() => {
                    const ActiveServiceIcon = coreServices[activeService].icon;
                    return (
                      <div className={`w-20 h-20 bg-gradient-to-r ${coreServices[activeService].gradient} rounded-3xl flex items-center justify-center mb-8`}>
                        <ActiveServiceIcon size={40} className="text-white" />
                      </div>
                    );
                  })()}

                  <h3 className="text-3xl font-black text-gray-900 mb-4">{coreServices[activeService].title}</h3>
                  <div className="text-lg text-blue-600 font-semibold mb-6">{coreServices[activeService].subtitle}</div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">{coreServices[activeService].description}</p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-8">
                    {coreServices[activeService].benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle size={16} className="text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Case Study */}
                  <div className={`bg-gradient-to-r ${coreServices[activeService].bgGradient} rounded-2xl p-6 border border-gray-200`}>
                    <div className="flex items-center mb-3">
                      <Trophy size={20} className="text-orange-600 mr-2" />
                      <span className="font-bold text-gray-900">Success Story</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{coreServices[activeService].caseStudy}</p>
                  </div>
                </div>

                <div>
                  {/* Features List */}
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Key Features</h4>
                    <div className="space-y-4">
                      {coreServices[activeService].features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <div className={`w-8 h-8 bg-gradient-to-r ${coreServices[activeService].gradient} rounded-lg flex items-center justify-center mr-4 mt-0.5`}>
                            <CheckCircle size={16} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">{feature}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <Link
                        to="/reports"
                        className={`w-full bg-gradient-to-r ${coreServices[activeService].gradient} text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center`}
                      >
                        Get Started
                        <ArrowRight size={18} className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreServices.map((service, index) => (
                <div
                  key={index}
                  className={`group bg-white rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer ${
                    activeService === index ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  onClick={() => setActiveService(index)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon size={32} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.subtitle}</p>

                  <div className="flex items-center text-blue-600 font-semibold text-sm">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced How It Works Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">How Our Platform Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our streamlined, AI-powered process ensures rapid response and effective coordination during emergencies,
                from initial detection to complete recovery.
              </p>

              {/* Process Animation Control */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setIsProcessPlaying(!isProcessPlaying)}
                  className={`flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    isProcessPlaying
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isProcessPlaying ? <Pause size={20} className="mr-2" /> : <Play size={20} className="mr-2" />}
                  {isProcessPlaying ? 'Pause Demo' : 'Watch Process'}
                </button>
              </div>
            </div>

            {/* Interactive Process Flow */}
            <div className="relative mb-16">
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 rounded-full transform -translate-y-1/2 hidden lg:block"></div>

              <div className="grid lg:grid-cols-4 gap-8 relative z-10">
                {processSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className={`relative w-24 h-24 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${
                        isProcessPlaying ? 'animate-pulse' : ''
                      }`}>
                        <StepIcon size={32} className="text-white" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold text-gray-900">{step.step}</span>
                        </div>
                      </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

                    {/* Expandable Details */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Key Activities:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Process Metrics */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Process Performance</h3>
                <p className="text-gray-600">Real-time metrics showing the effectiveness of our disaster response process</p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-black text-red-600 mb-2">2min</div>
                  <div className="text-gray-600 font-medium">Average Detection Time</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-blue-600 mb-2">5min</div>
                  <div className="text-gray-600 font-medium">Verification & Analysis</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-emerald-600 mb-2">8min</div>
                  <div className="text-gray-600 font-medium">Resource Coordination</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-purple-600 mb-2">15min</div>
                  <div className="text-gray-600 font-medium">Total Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Showcase */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Powered by Advanced Technology</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our platform leverages cutting-edge technology to provide the most effective disaster management solutions available today.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {technologyFeatures.map((tech, index) => (
                <div key={index} className="group bg-white rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <tech.icon size={32} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">{tech.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{tech.description}</p>

                  <div className="space-y-2">
                    {tech.capabilities.map((capability, capIndex) => (
                      <div key={capIndex} className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-3" />
                        <span className="text-gray-700 text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Impact Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Global Impact & Results</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Real numbers that demonstrate the tangible difference we're making in communities worldwide through our comprehensive disaster management platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {impactMetrics.map((stat, index) => (
                <div key={index} className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <stat.icon size={32} className="text-white" />
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Impact Visualization */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Impact Over Time</h3>
                <p className="text-lg text-gray-600">Our growing influence in global disaster management</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 size={40} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Response Efficiency</h4>
                  <p className="text-gray-600">60% improvement in emergency response times since platform launch</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp size={40} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Global Reach</h4>
                  <p className="text-gray-600">Expanded from 5 to 156 countries in just 5 years</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target size={40} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Success Rate</h4>
                  <p className="text-gray-600">98% successful disaster response coordination rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Case Studies Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Real-world examples of how our platform has made a critical difference during major disasters and emergencies.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white font-bold text-lg">{study.location}</div>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{study.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{study.description}</p>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6">
                      <div className="font-semibold text-blue-900 mb-2">Impact Achieved:</div>
                      <div className="text-blue-800">{study.impact}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {study.metrics.map((metric, metricIndex) => (
                        <span key={metricIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000"></div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Join thousands of communities, organizations, and responders who are using our platform to save lives
              and build resilience. Whether you're reporting an emergency or coordinating response efforts, we're here to help.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/reports"
                className="group bg-gradient-to-r from-red-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center">
                  <AlertTriangle size={20} className="mr-2" />
                  Report Emergency
                </span>
              </Link>
              <Link
                to="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
              >
                Learn More
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white mb-2">24/7</div>
                <div className="text-blue-200 text-sm">Always Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white mb-2">156</div>
                <div className="text-blue-200 text-sm">Countries Served</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white mb-2">2.3M</div>
                <div className="text-blue-200 text-sm">Lives Protected</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white mb-2">15min</div>
                <div className="text-blue-200 text-sm">Response Time</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WhatWeDo;
