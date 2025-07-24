import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Globe,
  Users,
  Building,
  Heart,
  Shield,
  TrendingUp
} from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormStatus('error');
      setErrorMessage('There was an error submitting your message. Please try again.');
    }
  };

  // Office locations
  const offices = [
    {
      city: 'New York',
      address: '123 Broadway, New York, NY 10001',
      phone: '+1 (212) 555-1234',
      email: 'newyork@disasterresponse.org',
      hours: 'Mon-Fri: 9AM-5PM'
    },
    {
      city: 'London',
      address: '45 Oxford Street, London, W1D 2DZ',
      phone: '+44 20 7123 4567',
      email: 'london@disasterresponse.org',
      hours: 'Mon-Fri: 9AM-5PM'
    },
    {
      city: 'Tokyo',
      address: '1-1-2 Marunouchi, Chiyoda-ku, Tokyo',
      phone: '+81 3-1234-5678',
      email: 'tokyo@disasterresponse.org',
      hours: 'Mon-Fri: 9AM-5PM'
    }
  ];

  // Contact categories
  const categories = [
    { name: 'Emergency Response', icon: AlertCircle, color: 'from-red-500 to-red-600' },
    { name: 'Volunteer Opportunities', icon: Users, color: 'from-blue-500 to-blue-600' },
    { name: 'Media Inquiries', icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
    { name: 'Partnerships', icon: Building, color: 'from-emerald-500 to-emerald-600' }
  ];

  // Stats matching Home page style
  const stats = [
    { icon: Heart, value: '2.4M+', label: 'Lives Protected', color: 'from-red-500 to-red-600' },
    { icon: Globe, value: '150+', label: 'Countries Served', color: 'from-blue-500 to-blue-600' },
    { icon: Clock, value: '24/7', label: 'Global Monitoring', color: 'from-purple-500 to-purple-600' },
    { icon: Shield, value: '99.9%', label: 'Response Rate', color: 'from-emerald-500 to-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section - Matching Home/About style */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Floating background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium mb-8">
                <MessageSquare size={16} className="mr-2 text-cyan-300" />
                <span className="text-white/90">Get In Touch</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="block mb-2">Contact Our</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                  Response Team
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                Have questions or need assistance? Our team is ready to help with 
                emergency response, volunteer opportunities, or general inquiries.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="tel:+15551234567"
                  className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Phone size={20} className="mr-2" />
                  Emergency Call
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  <MessageSquare size={20} className="mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Matching Home page style */}
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
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md mb-6`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Categories */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <MessageSquare size={16} className="mr-2" />
                Contact Categories
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Help You?</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Select the category that best matches your inquiry for the fastest response.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-md mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{category.name}</h3>
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, subject: category.name }));
                      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section id="contact-form" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Fill out the form below and our team will get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                      placeholder="John Doe"
                      disabled={formStatus === 'submitting'}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                      placeholder="john@example.com"
                      disabled={formStatus === 'submitting'}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                      disabled={formStatus === 'submitting'}
                    >
                      <option value="">Select a subject</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category.name}>{category.name}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                      placeholder="How can we help you?"
                      disabled={formStatus === 'submitting'}
                    ></textarea>
                  </div>

                  {formStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                      <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                      <p className="text-red-700 text-sm">{errorMessage}</p>
                    </div>
                  )}

                  {formStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <p className="text-green-700 text-sm">Your message has been sent successfully! We'll get back to you soon.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Offices</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Visit us at one of our global offices or reach out through our contact channels.
                </p>

                <div className="space-y-8">
                  {offices.map((office, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Globe size={20} className="mr-2 text-blue-600" />
                        {office.city} Office
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-600">{office.address}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone size={18} className="text-blue-600 flex-shrink-0" />
                          <span className="text-gray-600">{office.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail size={18} className="text-blue-600 flex-shrink-0" />
                          <a href={`mailto:${office.email}`} className="text-blue-600 hover:text-blue-700 hover:underline">{office.email}</a>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock size={18} className="text-blue-600 flex-shrink-0" />
                          <span className="text-gray-600">{office.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Emergency Contact</h3>
                  <p className="mb-4">For urgent disaster-related emergencies:</p>
                  <div className="flex items-center space-x-3 text-xl font-bold">
                    <Phone size={24} />
                    <span>1-800-DISASTER</span>
                  </div>
                  <p className="mt-4 text-blue-100 text-sm">Available 24/7, 365 days a year</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <Globe size={16} className="mr-2" />
                Global Network
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Presence</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                With offices and response teams around the world, we're ready to respond wherever disaster strikes.
              </p>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <div className="aspect-[16/9] w-full">
                {/* Replace with your actual map component */}
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
                  <p className="text-gray-500 text-lg">Interactive Map Component</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Matching Home/About style */}
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
                  to="/about"
                  className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  Learn More
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

export default Contact;