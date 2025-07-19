import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  AlertTriangle,
  Users,
  Globe,
  Shield,
  MessageCircle,
  Headphones,
  CheckCircle,
  Loader,
  ExternalLink,
  Zap,
  Heart,
  Star,
  ArrowRight,
  Building,
  Calendar,
  HelpCircle,
  Sparkles,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  User,
  FileText,
  Briefcase,
  Camera,
  UserPlus
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    category: 'general',
    priority: 'normal',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Form submitted:', formData);
      setIsSubmitted(true);

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        subject: '',
        category: 'general',
        priority: 'normal',
        message: ''
      });
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Emergency Hotline",
      description: "24/7 emergency response line for urgent disasters",
      contact: "+1 (555) 123-4567",
      availability: "Available 24/7",
      responseTime: "Immediate",
      action: "tel:+15551234567",
      actionText: "Call Now",
      gradient: "from-red-500 to-orange-500",
      bgColor: "from-red-50 to-orange-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      priority: "critical"
    },
    {
      icon: Mail,
      title: "General Inquiries",
      description: "For general questions, partnerships, and support",
      contact: "info@disasterwatch.com",
      availability: "Business hours",
      responseTime: "Within 24 hours",
      action: "mailto:info@disasterwatch.com",
      actionText: "Send Email",
      gradient: "from-blue-500 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      priority: "normal"
    },
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Real-time assistance and quick answers",
      contact: "Available on website",
      availability: "Mon-Fri, 9 AM - 6 PM EST",
      responseTime: "Within minutes",
      action: "#",
      actionText: "Start Chat",
      gradient: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      priority: "normal"
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Platform issues and technical assistance",
      contact: "support@disasterwatch.com",
      availability: "Business hours",
      responseTime: "Within 4 hours",
      action: "mailto:support@disasterwatch.com",
      actionText: "Get Help",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      priority: "normal"
    }
  ];

  const offices = [
    {
      city: "New York",
      address: "123 Emergency Response Ave, Suite 500",
      zipCode: "New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "ny@disasterwatch.com",
      hours: ["Mon-Fri: 9:00 AM - 6:00 PM EST", "Sat: 10:00 AM - 4:00 PM EST", "Sun: Closed"]
    },
    {
      city: "San Francisco",
      address: "456 Innovation Drive, Floor 12",
      zipCode: "San Francisco, CA 94105",
      phone: "+1 (555) 987-6543",
      email: "sf@disasterwatch.com",
      hours: ["Mon-Fri: 6:00 AM - 3:00 PM PST", "Sat: 7:00 AM - 1:00 PM PST", "Sun: Closed"]
    },
    {
      city: "London",
      address: "789 Global Response Center",
      zipCode: "London, UK EC1A 1BB",
      phone: "+44 20 7123 4567",
      email: "london@disasterwatch.com",
      hours: ["Mon-Fri: 2:00 PM - 11:00 PM GMT", "Sat: 3:00 PM - 9:00 PM GMT", "Sun: Closed"]
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: HelpCircle, description: 'General questions and information' },
    { value: 'emergency', label: 'Emergency Report', icon: AlertTriangle, description: 'Report a disaster or emergency situation' },
    { value: 'technical', label: 'Technical Support', icon: Headphones, description: 'Platform issues and technical help' },
    { value: 'partnership', label: 'Partnership Opportunity', icon: Briefcase, description: 'Collaboration and business partnerships' },
    { value: 'media', label: 'Media Inquiry', icon: Camera, description: 'Press, interviews, and media requests' },
    { value: 'volunteer', label: 'Volunteer Application', icon: UserPlus, description: 'Join our volunteer network' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/disasterwatch', color: 'hover:text-blue-400' },
    { icon: Facebook, label: 'Facebook', url: 'https://facebook.com/disasterwatch', color: 'hover:text-blue-600' },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com/disasterwatch', color: 'hover:text-pink-500' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/company/disasterwatch', color: 'hover:text-blue-700' },
    { icon: Youtube, label: 'YouTube', url: 'https://youtube.com/disasterwatch', color: 'hover:text-red-500' }
  ];

  const faqs = [
    {
      question: "How quickly do you respond to emergency reports?",
      answer: "Emergency reports are processed immediately 24/7. Our response team is notified within minutes of submission."
    },
    {
      question: "Can I report disasters anonymously?",
      answer: "Yes, you can submit disaster reports without providing personal information, though contact details help us verify and follow up."
    },
    {
      question: "Do you provide direct disaster relief?",
      answer: "We coordinate with local emergency services and relief organizations to ensure proper response and resource allocation."
    },
    {
      question: "How can I volunteer with your organization?",
      answer: "Fill out our volunteer application form or contact us directly. We have opportunities for both remote and field volunteers."
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

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-6">
                <MessageCircle size={18} className="mr-2 text-blue-400" />
                24/7 Support Available
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Get in Touch
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
                We're Here to Help
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12 font-medium">
              Whether you need emergency assistance, have questions about our services, or want to partner with us,
              our dedicated team is ready to support you around the clock.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="tel:+15551234567"
                className="group bg-gradient-to-r from-red-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center">
                  <Phone size={20} className="mr-2" />
                  Emergency Hotline
                </span>
              </a>
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
              >
                Send Message
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>

            {/* Response Time Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Zap size={32} className="text-yellow-400 mx-auto mb-3" />
                <div className="text-white font-bold text-lg">Emergency</div>
                <div className="text-blue-200 text-sm">Immediate Response</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Clock size={32} className="text-green-400 mx-auto mb-3" />
                <div className="text-white font-bold text-lg">General Inquiry</div>
                <div className="text-blue-200 text-sm">Within 24 Hours</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Heart size={32} className="text-pink-400 mx-auto mb-3" />
                <div className="text-white font-bold text-lg">Support</div>
                <div className="text-blue-200 text-sm">Always Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Emergency Notice */}
        <section className="py-8 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-b border-red-200/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-red-200/60 shadow-lg">
              <div className="flex items-center justify-center space-x-4 text-red-700">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">Emergency Protocol</div>
                  <div className="font-medium">
                    For life-threatening emergencies, call 911 or your local emergency services first, then contact our emergency hotline for disaster coordination.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Contact Methods */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Choose Your Contact Method</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Select the most appropriate way to reach us based on your needs and urgency level.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="group relative bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  <div className="relative p-8">
                    {/* Priority indicator */}
                    {method.priority === 'critical' && (
                      <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}

                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <method.icon size={32} className="text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">{method.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{method.description}</p>

                    {/* Contact info */}
                    <div className="space-y-2 mb-6">
                      <div className="font-semibold text-gray-800">{method.contact}</div>
                      <div className="text-sm text-gray-500">{method.availability}</div>
                      <div className="text-xs font-medium text-blue-600">Response: {method.responseTime}</div>
                    </div>

                    {/* Action button */}
                    <a
                      href={method.action}
                      className={`w-full bg-gradient-to-r ${method.gradient} text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group/btn`}
                    >
                      <span>{method.actionText}</span>
                      <ExternalLink size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Contact Form Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div id="contact-form" className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-100">
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Send us a Message</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Fill out the form below and we'll get back to you as soon as possible. For urgent matters, please use our emergency hotline.
                    </p>
                  </div>

                  {/* Success Message */}
                  {isSubmitted && (
                    <div className="p-8 bg-green-50 border-b border-green-200">
                      <div className="flex items-center space-x-3 text-green-700">
                        <CheckCircle size={24} className="text-green-600" />
                        <div>
                          <div className="font-bold text-lg">Message Sent Successfully!</div>
                          <div className="text-sm">We'll get back to you within 24 hours.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {submitError && (
                    <div className="p-8 bg-red-50 border-b border-red-200">
                      <div className="flex items-center space-x-3 text-red-700">
                        <AlertTriangle size={24} className="text-red-600" />
                        <div>
                          <div className="font-bold">Error Sending Message</div>
                          <div className="text-sm">{submitError}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            placeholder="your.email@example.com"
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number (Optional)
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2">
                            Organization (Optional)
                          </label>
                          <input
                            type="text"
                            id="organization"
                            name="organization"
                            value={formData.organization}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200"
                            placeholder="Your organization"
                          />
                        </div>
                      </div>
                    </div>
                  
                    {/* Inquiry Details */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Inquiry Details</h3>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
                            Category *
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            {categories.map((category) => (
                              <label key={category.value} className="cursor-pointer">
                                <input
                                  type="radio"
                                  name="category"
                                  value={category.value}
                                  checked={formData.category === category.value}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                                  formData.category === category.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}>
                                  <div className="flex items-center">
                                    <div className={`p-2 rounded-xl mr-3 ${
                                      formData.category === category.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      <category.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900">{category.label}</div>
                                      <div className="text-sm text-gray-600">{category.description}</div>
                                    </div>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-3">
                            Priority Level
                          </label>
                          <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 mb-6"
                          >
                            {priorities.map(priority => (
                              <option key={priority.value} value={priority.value}>
                                {priority.label}
                              </option>
                            ))}
                          </select>

                          <div>
                            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                              Subject *
                            </label>
                            <input
                              type="text"
                              id="subject"
                              name="subject"
                              required
                              value={formData.subject}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                                errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              placeholder="Brief subject of your message"
                            />
                            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none ${
                            errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          placeholder="Please provide detailed information about your inquiry. Include any relevant context that will help us assist you better..."
                        />
                        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                        <div className="mt-2 text-sm text-gray-500">
                          {formData.message.length}/1000 characters
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative flex items-center justify-center">
                          {isSubmitting ? (
                            <>
                              <Loader className="w-5 h-5 mr-2 animate-spin" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                              Send Message
                            </>
                          )}
                        </span>
                      </button>

                      <p className="mt-4 text-sm text-gray-600 text-center">
                        By submitting this form, you agree to our privacy policy and terms of service.
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Quick Help */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Sparkles size={24} className="mr-3 text-purple-600" />
                    Quick Help
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      <div className="font-semibold text-blue-900 mb-2">Emergency Response</div>
                      <div className="text-sm text-blue-700 mb-3">
                        For immediate disaster reporting or emergency assistance
                      </div>
                      <a
                        href="tel:+15551234567"
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                      >
                        <Phone size={16} className="mr-2" />
                        Call Emergency Hotline
                      </a>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                      <div className="font-semibold text-green-900 mb-2">Live Chat</div>
                      <div className="text-sm text-green-700 mb-3">
                        Get instant answers to your questions
                      </div>
                      <button className="inline-flex items-center text-green-600 font-semibold hover:text-green-800 transition-colors">
                        <MessageCircle size={16} className="mr-2" />
                        Start Chat Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Office Locations */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Building size={24} className="mr-3 text-blue-600" />
                    Our Offices
                  </h3>
                  <div className="space-y-6">
                    {offices.map((office, index) => (
                      <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200/60">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">{office.city}</h4>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3 mt-0.5">
                              <MapPin size={16} className="text-blue-600" />
                            </div>
                            <div className="text-gray-700 text-sm leading-relaxed">
                              <div>{office.address}</div>
                              <div>{office.zipCode}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg mr-3">
                              <Phone size={16} className="text-green-600" />
                            </div>
                            <a href={`tel:${office.phone.replace(/\D/g, '')}`} className="text-gray-700 text-sm hover:text-blue-600 transition-colors">
                              {office.phone}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg mr-3">
                              <Mail size={16} className="text-purple-600" />
                            </div>
                            <a href={`mailto:${office.email}`} className="text-gray-700 text-sm hover:text-blue-600 transition-colors">
                              {office.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Clock size={24} className="mr-3 text-orange-600" />
                    Business Hours
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                      <div className="space-y-2 text-blue-700">
                        <div className="flex justify-between">
                          <span className="font-medium">Monday - Friday:</span>
                          <span className="font-semibold">9:00 AM - 6:00 PM EST</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Saturday:</span>
                          <span className="font-semibold">10:00 AM - 4:00 PM EST</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Sunday:</span>
                          <span className="font-semibold">Closed</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200">
                      <div className="flex justify-between font-bold text-red-700">
                        <span>Emergency Line:</span>
                        <span>24/7 Available</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group ${social.color}`}
                      >
                        <social.icon size={20} className="mr-2" />
                        <span className="font-semibold text-sm">{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Find quick answers to common questions. Can't find what you're looking for? Contact us directly.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-2xl">
                      <HelpCircle size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">Still have questions?</p>
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Ask Your Question
              </button>
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000"></div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Whether you need emergency assistance, want to report a disaster, or have questions about our services,
              we're here to help. Choose the best way to reach us and we'll respond promptly.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="tel:+15551234567"
                className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  <Phone size={20} className="mr-2" />
                  Call Emergency Line
                </span>
              </a>
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
              >
                Send Message
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
