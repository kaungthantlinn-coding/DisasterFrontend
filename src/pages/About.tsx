import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  Users,
  Globe,
  Target,
  Award,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Zap,
  Eye,
  HandHeart
} from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const About: React.FC = () => {
  const { t } = useTranslation();
  const mainRef = useRef<HTMLElement>(null);



  useEffect(() => {
    // Remove navbar spacing - set padding-top to 0
    const removeNavbarSpacing = () => {
      if (mainRef.current) {
        mainRef.current.style.paddingTop = '0rem';
        mainRef.current.style.setProperty('padding-top', '0rem', 'important');
      }
    };

    removeNavbarSpacing();
    window.addEventListener('resize', removeNavbarSpacing);

    return () => window.removeEventListener('resize', removeNavbarSpacing);
  }, []);

  // Mission values data
  const values = [
    {
      icon: ShieldCheck,
      title: t('about.mission.values.reliability.title'),
      description: t('about.mission.values.reliability.description')
    },
    {
      icon: Heart,
      title: t('about.mission.values.communityFirst.title'),
      description: t('about.mission.values.communityFirst.description')
    },
    {
      icon: Zap,
      title: t('about.mission.values.rapidResponse.title'),
      description: t('about.mission.values.rapidResponse.description')
    },
    {
      icon: Globe,
      title: t('about.mission.values.globalReach.title'),
      description: t('about.mission.values.globalReach.description')
    }
  ];

  // Key features data
  const features = [
    {
      icon: Eye,
      title: t('about.whatWeDo.features.realTimeMonitoring.title'),
      description: t('about.whatWeDo.features.realTimeMonitoring.description')
    },
    {
      icon: Users,
      title: t('about.whatWeDo.features.communityNetwork.title'),
      description: t('about.whatWeDo.features.communityNetwork.description')
    },
    {
      icon: Target,
      title: t('about.whatWeDo.features.preciseAlerts.title'),
      description: t('about.whatWeDo.features.preciseAlerts.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Header />

      <main
        ref={mainRef}
        className="no-navbar-spacing"
        style={{
          paddingTop: '0rem'
        }}
      >
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Floating background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-indigo-300">
                  {t('about.hero.title')}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-blue-100 mb-12 leading-relaxed">
                {t('about.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/reports"
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center">
                    <Eye size={20} className="mr-2" />
                    {t('about.hero.viewReports')}
                  </span>
                </Link>
                <Link
                  to="/get-involved"
                  className="group bg-blue-600/20 backdrop-blur-xl border border-blue-400/40 text-blue-100 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-blue-500/30 hover:border-blue-300/60 hover:text-white hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  <HandHeart size={20} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                  {t('about.hero.getInvolved')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('about.mission.description')}
              </p>
            </div>

            {/* Mission Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-blue-100/50"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                  {t('about.whatWeDo.title')}
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t('about.whatWeDo.description')}
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
                    {t('about.whatWeDo.learnMore')}
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-600">System Status: {t('about.whatWeDo.systemStatus.active')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                        <div className="text-3xl font-bold mb-2">24/7</div>
                        <div className="text-blue-100 text-sm">{t('about.whatWeDo.systemStatus.monitoring')}</div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white">
                        <div className="text-3xl font-bold mb-2">{t('about.whatWeDo.systemStatus.realTime')}</div>
                        <div className="text-indigo-100 text-sm">{t('about.whatWeDo.systemStatus.alerts')}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm font-medium">{t('about.whatWeDo.systemStatus.communityReports')}</span>
                        </div>
                        <span className="text-sm text-gray-500">{t('about.whatWeDo.systemStatus.active')}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm font-medium">{t('about.whatWeDo.systemStatus.emergencyResponse')}</span>
                        </div>
                        <span className="text-sm text-gray-500">{t('about.whatWeDo.systemStatus.ready')}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm font-medium">{t('about.whatWeDo.systemStatus.volunteerNetwork')}</span>
                        </div>
                        <span className="text-sm text-gray-500">{t('about.whatWeDo.systemStatus.connected')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team/Organization Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                {t('about.organization.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('about.organization.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Core Team */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100/50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Users size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.organization.expertTeam.title')}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('about.organization.expertTeam.description')}
                </p>
                <div className="space-y-2">
                  {(() => {
                    const certifications = t('about.organization.expertTeam.certifications', { returnObjects: true });
                    const certArray = Array.isArray(certifications) ? certifications : [
                      "Emergency Management Certified",
                      "Technology Innovation Leaders",
                      "Community Safety Advocates"
                    ];
                    return certArray.map((cert, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Award size={16} className="mr-2 text-blue-600" />
                        {cert}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Global Network */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100/50">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Globe size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.organization.globalNetwork.title')}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('about.organization.globalNetwork.description')}
                </p>
                <div className="space-y-2">
                  {(() => {
                    const partnerships = t('about.organization.globalNetwork.partnerships', { returnObjects: true });
                    const partnerArray = Array.isArray(partnerships) ? partnerships : [
                      "Emergency Services Partners",
                      "NGO Collaborations",
                      "Community Organizations"
                    ];
                    return partnerArray.map((partnership, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle size={16} className="mr-2 text-indigo-600" />
                        {partnership}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Innovation Focus */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100/50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Target size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.organization.innovation.title')}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('about.organization.innovation.description')}
                </p>
                <div className="space-y-2">
                  {(() => {
                    const focusAreas = t('about.organization.innovation.focus', { returnObjects: true });
                    const focusArray = Array.isArray(focusAreas) ? focusAreas : [
                      "Real-time Technology",
                      "User-Centered Design",
                      "Continuous Improvement"
                    ];
                    return focusArray.map((focus, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Zap size={16} className="mr-2 text-blue-600" />
                        {focus}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                {t('about.leadership.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('about.leadership.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Executive Director */}
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-blue-200/50 hover:-translate-y-2">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-8">
                  {/* Profile Image */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 p-1 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                          alt="Dr. Sarah Chen - Executive Director"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    {/* Role Badge */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {t('about.leadership.team.sarahChen.badge')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{t('about.leadership.team.sarahChen.name')}</h3>
                      <p className="text-blue-600 font-semibold text-lg">{t('about.leadership.team.sarahChen.title')}</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.leadership.team.sarahChen.bio')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Response Coordinator */}
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-blue-200/50 hover:-translate-y-2">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-white to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-8">
                  {/* Profile Image */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 p-1 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                          alt="Captain Michael Rodriguez - Emergency Response Coordinator"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    {/* Role Badge */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {t('about.leadership.team.michaelRodriguez.badge')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{t('about.leadership.team.michaelRodriguez.name')}</h3>
                      <p className="text-blue-600 font-semibold text-lg">{t('about.leadership.team.michaelRodriguez.title')}</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.leadership.team.michaelRodriguez.bio')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technology Director */}
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-blue-200/50 hover:-translate-y-2">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-8">
                  {/* Profile Image */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 p-1 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                          alt="Dr. Priya Patel - Technology Director"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    {/* Role Badge */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {t('about.leadership.team.priyaPatel.badge')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{t('about.leadership.team.priyaPatel.name')}</h3>
                      <p className="text-blue-600 font-semibold text-lg">{t('about.leadership.team.priyaPatel.title')}</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.leadership.team.priyaPatel.bio')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Community Outreach Manager */}
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-blue-200/50 hover:-translate-y-2">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-8">
                  {/* Profile Image */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 p-1 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                          alt="Maria Santos - Community Outreach Manager"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    {/* Role Badge */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {t('about.leadership.team.mariaSantos.badge')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{t('about.leadership.team.mariaSantos.name')}</h3>
                      <p className="text-blue-600 font-semibold text-lg">{t('about.leadership.team.mariaSantos.title')}</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.leadership.team.mariaSantos.bio')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Operations Manager */}
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-blue-200/50 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-8">
                  {/* Profile Image */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 p-1 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                          alt="James Thompson - Operations Manager"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    {/* Role Badge */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {t('about.leadership.team.jamesThompson.badge')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{t('about.leadership.team.jamesThompson.name')}</h3>
                      <p className="text-blue-600 font-semibold text-lg">{t('about.leadership.team.jamesThompson.title')}</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.leadership.team.jamesThompson.bio')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact/CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
                  {t('about.cta.title')}
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  {t('about.cta.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    to="/get-involved"
                    className="group bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center"
                  >
                    <HandHeart size={20} className="mr-2" />
                    {t('about.cta.getInvolved')}
                  </Link>
                  <Link
                    to="/contact"
                    className="group bg-blue-600/20 backdrop-blur-xl border border-blue-400/40 text-blue-100 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-500/30 hover:border-blue-300/60 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <Mail size={20} className="mr-2" />
                    {t('about.cta.contactUs')}
                  </Link>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">{t('about.cta.contact.title')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-blue-100">
                    <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="font-semibold">{t('about.cta.contact.email.label')}</div>
                      <div className="text-blue-200">{t('about.cta.contact.email.value')}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="font-semibold">{t('about.cta.contact.phone.label')}</div>
                      <div className="text-blue-200">{t('about.cta.contact.phone.value')}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="font-semibold">{t('about.cta.contact.responseTime.label')}</div>
                      <div className="text-blue-200">{t('about.cta.contact.responseTime.value')}</div>
                    </div>
                  </div>
                </div>
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