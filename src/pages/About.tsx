import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Heart,
  Users,
  Globe,
  Target,
  ArrowRight,
  CheckCircle,
  Zap,
  Eye,
  HandHeart,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const About: React.FC = () => {
  // Mission values data
  const values = [
    {
      icon: Shield,
      title: 'Reliability & Trust',
      description: 'Providing accurate, verified information when communities need it most.',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: Heart,
      title: 'Community First',
      description: 'Putting community safety and well-being at the center of everything we do.',
      color: 'from-red-600 to-red-700',
      bgColor: 'from-red-50 to-red-100'
    },
    {
      icon: Zap,
      title: 'Rapid Response',
      description: 'Delivering critical information and resources with speed and precision.',
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-100'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Building resilient communities worldwide through technology and collaboration.',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100'
    }
  ];

  // Key features data
  const features = [
    {
      icon: Eye,
      title: 'Real-Time Monitoring',
      description: 'Advanced AI-powered systems track disasters as they develop, providing instant updates.'
    },
    {
      icon: Users,
      title: 'Community Network',
      description: 'Connect with local responders, volunteers, and community members for coordinated action.'
    },
    {
      icon: Target,
      title: 'Precise Alerts',
      description: 'Location-based notifications ensure you receive relevant information for your area.'
    }
  ];

  // Team members
  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Executive Director',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'Leading disaster management expert with 15+ years in emergency response and community resilience.',
      badge: 'Leadership',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'Captain Michael Rodriguez',
      role: 'Emergency Response Coordinator',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'Former fire chief with extensive experience in disaster response and emergency management.',
      badge: 'Response',
      color: 'from-red-600 to-orange-600'
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Technology Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'AI and machine learning specialist focused on predictive disaster modeling and early warning systems.',
      badge: 'Innovation',
      color: 'from-purple-600 to-indigo-600'
    },
    {
      name: 'Maria Santos',
      role: 'Community Outreach Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'Community engagement expert building bridges between technology and local communities.',
      badge: 'Community',
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const stats = [
    { icon: Users, value: '2.4M+', label: 'Lives Protected', color: 'text-blue-600' },
    { icon: Globe, value: '150+', label: 'Countries Served', color: 'text-green-600' },
    { icon: Clock, value: '24/7', label: 'Monitoring', color: 'text-purple-600' },
    { icon: Star, value: '99.9%', label: 'Uptime', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Floating background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium mb-8">
                <Heart size={16} className="mr-2 text-red-300" />
                <span className="text-white/90">About Our Mission</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="block mb-2">Saving Lives Through</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                  Smart Technology
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                We're building the world's most advanced disaster response platform, 
                connecting communities with life-saving information and resources when they need it most.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/reports"
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Eye size={20} className="mr-2" />
                  View Live Reports
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/get-involved"
                  className="group bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  <HandHeart size={20} className="mr-2" />
                  Get Involved
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <TrendingUp size={16} className="mr-2" />
                Our Impact
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Making a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Global Difference</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color === 'text-blue-600' ? 'from-blue-500 to-blue-600' : stat.color === 'text-green-600' ? 'from-green-500 to-green-600' : stat.color === 'text-purple-600' ? 'from-purple-500 to-purple-600' : 'from-orange-500 to-orange-600'} text-white shadow-md mb-6`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                These principles guide everything we do, from product development to community engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br ${value.bgColor} rounded-2xl p-8 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/50`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                  How We're Changing Disaster Response
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our platform combines cutting-edge technology with human expertise to create 
                  the most comprehensive disaster management system ever built.
                </p>

                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Link
                    to="/what-we-do"
                    className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Learn More About Our Work
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-600">System Status: Active</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                        <div className="text-3xl font-bold mb-2">24/7</div>
                        <div className="text-blue-100 text-sm">Monitoring</div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white">
                        <div className="text-3xl font-bold mb-2">Real-Time</div>
                        <div className="text-indigo-100 text-sm">Alerts</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm font-medium">Community Reports</span>
                        </div>
                        <span className="text-sm text-gray-500">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm font-medium">Emergency Response</span>
                        </div>
                        <span className="text-sm text-gray-500">Ready</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm font-medium">Volunteer Network</span>
                        </div>
                        <span className="text-sm text-gray-500">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Meet Our Leadership Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experienced professionals dedicated to building safer, more resilient communities worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80 hover:scale-105"
                >
                  <div className="relative">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${member.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      {member.badge}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Join our mission to build safer, more resilient communities through technology and collaboration.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/get-involved"
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Get Involved Today
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  Contact Us
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

export default About;