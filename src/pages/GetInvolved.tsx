import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import {
  Users,
  Heart,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Shield,
  Clock,
  Sparkles,
  TrendingUp,
  Play,
  UserPlus,
  GraduationCap,
  Calendar,
  Target,
  BarChart3,
  Trophy,
  Code,
  Megaphone,
  Timer,
  Quote
} from 'lucide-react';

const GetInvolved: React.FC = () => {
  const volunteerHighlights = [
    {
      title: 'Emergency Response',
      description: 'Immediate disaster assistance',
      icon: Shield,
      gradient: 'from-red-500 to-orange-500',
      stats: { number: '24/7', label: 'Response Ready' }
    },
    {
      title: 'Community Building',
      description: 'Local resilience programs',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-500',
      stats: { number: '1,200+', label: 'Communities Served' }
    },
    {
      title: 'Technology Support',
      description: 'Platform development',
      icon: Code,
      gradient: 'from-emerald-500 to-green-500',
      stats: { number: '50+', label: 'Tech Volunteers' }
    },
    {
      title: 'Training & Education',
      description: 'Skill development programs',
      icon: GraduationCap,
      gradient: 'from-purple-500 to-pink-500',
      stats: { number: '10K+', label: 'People Trained' }
    }
  ];

  const volunteerRoles = [
    {
      title: "Emergency Response Specialist",
      description: "Join our rapid response team to provide immediate assistance during disasters and coordinate relief efforts.",
      requirements: ["First aid/CPR certification", "Physical fitness", "Emergency response training", "24/7 availability"],
      commitment: "On-call basis",
      timeframe: "Immediate deployment",
      impact: "Direct life-saving assistance",
      icon: Shield,
      gradient: "from-red-500 to-orange-500",
      level: "Advanced"
    },
    {
      title: "Community Coordinator",
      description: "Help organize local disaster preparedness programs, community outreach, and resilience building initiatives.",
      requirements: ["Strong communication skills", "Local community knowledge", "Event planning experience", "Leadership abilities"],
      commitment: "10-15 hours/month",
      timeframe: "3-month minimum",
      impact: "Community preparedness improvement",
      icon: Users,
      gradient: "from-blue-500 to-indigo-500",
      level: "Intermediate"
    },
    {
      title: "Technology Specialist",
      description: "Assist with platform development, data analysis, AI model training, and technical infrastructure maintenance.",
      requirements: ["Programming skills (Python/JavaScript)", "Data analysis experience", "Cloud platform knowledge", "Problem-solving abilities"],
      commitment: "Flexible hours",
      timeframe: "Project-based",
      impact: "Platform enhancement and innovation",
      icon: Code,
      gradient: "from-emerald-500 to-green-500",
      level: "Advanced"
    },
    {
      title: "Training Instructor",
      description: "Teach disaster preparedness and response skills to community members, volunteers, and partner organizations.",
      requirements: ["Teaching/training experience", "Emergency management knowledge", "Public speaking skills", "Curriculum development"],
      commitment: "5-10 hours/month",
      timeframe: "6-month minimum",
      impact: "Knowledge transfer and capacity building",
      icon: GraduationCap,
      gradient: "from-purple-500 to-pink-500",
      level: "Intermediate"
    },
    {
      title: "Communications Specialist",
      description: "Help with content creation, social media management, public relations, and community engagement initiatives.",
      requirements: ["Content creation skills", "Social media expertise", "Writing abilities", "Design experience (preferred)"],
      commitment: "8-12 hours/month",
      timeframe: "3-month minimum",
      impact: "Awareness and engagement growth",
      icon: Megaphone,
      gradient: "from-yellow-500 to-orange-500",
      level: "Beginner"
    },
    {
      title: "Research Analyst",
      description: "Conduct research on disaster trends, analyze response effectiveness, and contribute to policy recommendations.",
      requirements: ["Research experience", "Data analysis skills", "Academic background preferred", "Report writing abilities"],
      commitment: "6-10 hours/month",
      timeframe: "Project-based",
      impact: "Evidence-based improvements",
      icon: BarChart3,
      gradient: "from-teal-500 to-cyan-500",
      level: "Intermediate"
    }
  ];

  const volunteerTestimonials = [
    {
      name: "Sarah Martinez",
      role: "Emergency Response Volunteer",
      location: "California, USA",
      quote: "Volunteering with DisasterWatch has been the most rewarding experience of my life. I've helped coordinate responses to three major disasters and seen firsthand how our work saves lives.",
      image: "/api/placeholder/80/80",
      duration: "3 years",
      impact: "Helped 500+ families"
    },
    {
      name: "Maria Rodriguez",
      role: "Community Coordinator Volunteer",
      location: "Mexico City, Mexico",
      quote: "Through DisasterWatch, I've been able to build resilience in my community. We've trained over 1,000 people in disaster preparedness, and our response times have improved dramatically.",
      image: "/api/placeholder/80/80",
      duration: "18 months",
      impact: "1,000+ people trained"
    },
    {
      name: "Alex Thompson",
      role: "Technology Volunteer",
      location: "London, UK",
      quote: "As a software developer, I wanted to use my skills for good. Contributing to DisasterWatch's platform development has allowed me to directly impact disaster response capabilities worldwide.",
      image: "/api/placeholder/80/80",
      duration: "2 years",
      impact: "Built 5 key features"
    },
    {
      name: "Dr. Priya Patel",
      role: "Training Instructor Volunteer",
      location: "Mumbai, India",
      quote: "Teaching disaster preparedness skills through DisasterWatch has been incredibly fulfilling. Seeing communities become more resilient and prepared gives me hope for the future.",
      image: "/api/placeholder/80/80",
      duration: "1 year",
      impact: "Trained 800+ people"
    }
  ];

  const volunteerStats = [
    { number: "50K+", label: "Active Volunteers", icon: Users, color: "from-blue-500 to-indigo-600" },
    { number: "156", label: "Countries Served", icon: Globe, color: "from-emerald-500 to-green-600" },
    { number: "2.3M", label: "Lives Impacted", icon: Heart, color: "from-red-500 to-orange-600" },
    { number: "24/7", label: "Response Ready", icon: Clock, color: "from-purple-500 to-pink-600" },
    { number: "98%", label: "Volunteer Satisfaction", icon: Star, color: "from-yellow-500 to-orange-600" },
    { number: "15min", label: "Avg Response Time", icon: Timer, color: "from-teal-500 to-cyan-600" }
  ];

  const benefits = [
    {
      title: "Professional Development",
      description: "Gain valuable skills in emergency management, leadership, and crisis communication",
      icon: TrendingUp
    },
    {
      title: "Global Network",
      description: "Connect with professionals and volunteers from around the world",
      icon: Globe
    },
    {
      title: "Training & Certification",
      description: "Access to specialized training programs and professional certifications",
      icon: Award
    },
    {
      title: "Recognition Programs",
      description: "Awards, certificates, and public recognition for outstanding service",
      icon: Trophy
    },
    {
      title: "Flexible Scheduling",
      description: "Choose opportunities that fit your schedule and availability",
      icon: Calendar
    },
    {
      title: "Real Impact",
      description: "See the direct results of your efforts in saving lives and building resilience",
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Header />

      <main className="pt-16">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-blue-900 to-purple-900"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Floating decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-emerald-400/30 to-blue-500/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-xl animate-pulse delay-500"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-8">
                <Sparkles size={18} className="mr-2 text-yellow-400" />
                Join Our Global Network of Volunteer Heroes
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
                Become a
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300">
                  Volunteer
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12 font-medium">
                Join over 50,000 volunteers worldwide making a direct difference in disaster response and community resilience.
                Your skills, passion, and commitment can save lives and build stronger communities across the globe.
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  to="/contact"
                  className="group bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center">
                    <UserPlus size={20} className="mr-2" />
                    Apply to Volunteer
                  </span>
                </Link>
                <button
                  onClick={() => document.getElementById('volunteer-roles')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
                >
                  <Play size={20} className="mr-2" />
                  View Opportunities
                </button>
              </div>
            </div>

            {/* Volunteer Opportunity Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {volunteerHighlights.map((highlight, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${highlight.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    <highlight.icon size={32} className="text-white" />
                  </div>
                  <div className="text-white font-bold text-lg mb-2">{highlight.title}</div>
                  <div className="text-blue-200 text-sm">{highlight.description}</div>
                  <div className="text-blue-300 text-xs mt-2">{highlight.stats.number} {highlight.stats.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Volunteer Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-6">Why Volunteer With DisasterWatch?</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Volunteering with DisasterWatch means joining a global community of dedicated individuals
                  committed to making the world safer and more resilient. Every contribution, no matter how
                  small, creates ripple effects that can save lives and strengthen communities.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Make a direct impact on disaster response and prevention</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Gain valuable skills in emergency management and leadership</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Connect with like-minded professionals worldwide</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Flexible scheduling that fits your availability</span>
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  Apply to Volunteer
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {volunteerStats.slice(0, 4).map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={index} className={`bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl text-center shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <StatIcon size={24} className="text-white" />
                      </div>
                      <div className="text-3xl font-black text-gray-900 mb-2">{stat.number}</div>
                      <div className="text-gray-600 text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Volunteer Roles Section */}
        <section id="volunteer-roles" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Volunteer Opportunities</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Find the perfect role that matches your skills, interests, and availability.
                From emergency response to technology development, there's a place for everyone.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {volunteerRoles.map((role, index) => {
                const RoleIcon = role.icon;
                return (
                  <div key={index} className="group bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    {/* Header */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${role.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <RoleIcon size={32} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            role.level === 'Advanced' ? 'bg-red-100 text-red-700' :
                            role.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {role.level}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm">{role.description}</p>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle size={16} className="mr-2 text-blue-600" />
                        Requirements:
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {role.requirements.map((req, reqIndex) => (
                          <div key={reqIndex} className="flex items-start space-x-2">
                            <Star size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-xs text-gray-500 mb-1">Time Commitment</div>
                        <div className="font-semibold text-gray-900 text-sm">{role.commitment}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-xs text-gray-500 mb-1">Duration</div>
                        <div className="font-semibold text-gray-900 text-sm">{role.timeframe}</div>
                      </div>
                    </div>

                    {/* Impact */}
                    <div className={`bg-gradient-to-r ${role.gradient} bg-opacity-10 rounded-2xl p-4 mb-6`}>
                      <div className="flex items-center mb-2">
                        <Target size={16} className="text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-900 text-sm">Your Impact:</span>
                      </div>
                      <p className="text-gray-700 text-sm">{role.impact}</p>
                    </div>

                    {/* Action Button */}
                    <Link
                      to="/contact"
                      className={`w-full bg-gradient-to-r ${role.gradient} text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group/btn`}
                    >
                      <span>Apply for This Role</span>
                      <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Why Join Our Community?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Beyond the satisfaction of making a difference, our volunteers and partners enjoy numerous benefits
                that support their personal and professional growth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const BenefitIcon = benefit.icon;
                return (
                  <div key={index} className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                      <BenefitIcon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Volunteer Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Voices from Our Volunteers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Hear from dedicated volunteers who are making a real difference through their service with DisasterWatch across the globe.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {volunteerTestimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative">
                  {/* Quote icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Quote size={24} className="text-blue-600" />
                  </div>

                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-blue-600 font-medium">{testimonial.location}</div>
                    </div>
                  </div>

                  <blockquote className="text-gray-700 italic leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={16} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{testimonial.duration}</div>
                      <div className="text-xs text-gray-600">{testimonial.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Volunteer Impact Statistics */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Volunteer Impact by the Numbers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our global volunteer network has achieved remarkable results in disaster response and prevention.
                See the tangible impact of volunteer dedication and service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {volunteerStats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                    <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <StatIcon size={32} className="text-white" />
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Volunteer Call to Action Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000"></div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to Become a Volunteer Hero?
            </h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Join over 50,000 volunteers worldwide who are making a direct impact in disaster response and community resilience.
              Whether you have 5 hours a week or can respond to emergencies, there's a perfect volunteer role for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  <UserPlus size={20} className="mr-2" />
                  Contact Us
                </span>
              </Link>
              <button
                onClick={() => document.getElementById('volunteer-roles')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
              >
                View Opportunities
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>

            {/* Volunteer Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white mb-2">5min</div>
                <div className="text-blue-200 text-sm">Application Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white mb-2">24/7</div>
                <div className="text-blue-200 text-sm">Support Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white mb-2">156</div>
                <div className="text-blue-200 text-sm">Countries Active</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black text-white mb-2">Free</div>
                <div className="text-blue-200 text-sm">Training Provided</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default GetInvolved;
