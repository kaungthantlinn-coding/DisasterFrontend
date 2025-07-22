import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ContactMap from '../components/Map/ContactMap';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Loader,
  MessageCircle,
  Headphones,
  Shield,
  Users,
  Globe,
  AlertCircle
} from 'lucide-react';
import { showSuccessToast, showErrorToast, showLoading, closeAlert } from '../utils/notifications';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast('Please fill in all required fields correctly.', 'Form Validation Error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Show loading alert
    showLoading('Sending your message...');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Form submitted:', formData);
      closeAlert();

      // Show success notification
      showSuccessToast(
        'Thank you for contacting us! We\'ll get back to you within 24 hours.',
        'Message Sent Successfully'
      );

      setSubmitStatus('success');

      // Reset form after successful submission
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormErrors({});
    } catch (error) {
      closeAlert();
      showErrorToast(
        'Failed to send your message. Please try again or contact us directly.',
        'Message Send Failed'
      );
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Emergency Hotline",
      description: "24/7 emergency disaster response",
      contact: "+1 (555) 123-4567",
      availability: "Available 24/7",
      action: "tel:+15551234567",
      actionText: "Call Now",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200"
    },
    {
      icon: Mail,
      title: "General Inquiries",
      description: "Questions about our services",
      contact: "contact@disasterwatch.org",
      availability: "Response within 24 hours",
      action: "mailto:contact@disasterwatch.org",
      actionText: "Send Email",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: Headphones,
      title: "Support Center",
      description: "Technical support and assistance",
      contact: "support@disasterwatch.org",
      availability: "Mon-Fri, 9AM-6PM",
      action: "mailto:support@disasterwatch.org",
      actionText: "Get Support",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-200"
    }
  ];

  const stats = [
    { value: "24/7", label: "Emergency Response", icon: Clock },
    { value: "2.3M", label: "People Helped", icon: Users },
    { value: "156", label: "Countries Served", icon: Globe },
    { value: "98%", label: "Response Rate", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Header />

      <main className="pt-0">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 relative overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-300/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600/20 backdrop-blur-xl border border-blue-400/30 text-blue-100 text-sm font-semibold mb-8 shadow-lg">
              <MessageCircle size={16} className="mr-2 text-blue-300" />
              Contact Us
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight drop-shadow-xl">
              Get in Touch
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-200">
                We're Here to Help
              </span>
            </h1>

            <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Reach out to our team for emergency support, general inquiries, or partnership opportunities.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon size={22} className="text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-2 group-hover:scale-105 transition-transform duration-300">{stat.value}</div>
                  <div className="text-blue-200 text-sm font-medium leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="tel:+15551234567"
                className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center justify-center"
              >
                <Phone size={22} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                Emergency Call
              </a>
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-blue-600/20 backdrop-blur-xl border border-blue-400/40 text-blue-100 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-500/30 hover:border-blue-300/60 hover:text-white hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <MessageCircle size={22} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                Send Message
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 relative overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-green-100/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-blue-50/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Enhanced Contact Form */}
              <div className="lg:col-span-2">
                <div id="contact-form" className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 border border-gray-100/50 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-8 border-b border-blue-100/50">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <MessageCircle size={24} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Send us a Message</h2>
                        <p className="text-blue-600 font-medium">We'll get back to you within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {submitStatus === 'success' ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                          <CheckCircle size={40} />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-md mx-auto">
                          Thank you for contacting us. We'll respond within 24 hours.
                        </p>
                        <button
                          onClick={() => setSubmitStatus('idle')}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Send Another Message
                        </button>
                      </div>
                    ) : submitStatus === 'error' ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                          <AlertCircle size={40} />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">
                          Something went wrong
                        </h3>
                        <p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-md mx-auto">
                          Please try again or contact us directly.
                        </p>
                        <button
                          onClick={() => setSubmitStatus('idle')}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={`input-field ${formErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                              placeholder="Enter your full name"
                            />
                            {formErrors.name && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {formErrors.name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`input-field ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                              placeholder="your.email@example.com"
                            />
                            {formErrors.email && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {formErrors.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subject *
                          </label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className={`input-field ${formErrors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                          >
                            <option value="">Select a subject</option>
                            <option value="emergency">Emergency Support</option>
                            <option value="general">General Inquiry</option>
                            <option value="volunteer">Volunteer Opportunities</option>
                            <option value="partnership">Partnership</option>
                            <option value="technical">Technical Support</option>
                            <option value="other">Other</option>
                          </select>
                          {formErrors.subject && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              {formErrors.subject}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Message *
                          </label>
                          <textarea
                            name="message"
                            rows={6}
                            value={formData.message}
                            onChange={handleInputChange}
                            className={`input-field resize-none ${formErrors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                            placeholder="Tell us how we can help you..."
                          />
                          {formErrors.message && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              {formErrors.message}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader size={22} className="mr-3 animate-spin" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send size={22} className="mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Sidebar */}
              <div className="space-y-8">
                {/* Enhanced Contact Methods */}
                <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <Phone size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Quick Contact</h3>
                  </div>
                  <div className="space-y-4">
                    <a
                      href="tel:+15551234567"
                      className="flex items-center p-4 rounded-2xl hover:bg-red-50 hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-red-200"
                    >
                      <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Phone size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Emergency</p>
                        <p className="text-red-600 font-semibold">+1 (555) 123-4567</p>
                      </div>
                    </a>
                    <a
                      href="mailto:contact@disasterwatch.org"
                      className="flex items-center p-4 rounded-2xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-blue-200"
                    >
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Mail size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">General</p>
                        <p className="text-blue-600 font-semibold">contact@disasterwatch.org</p>
                      </div>
                    </a>
                    <a
                      href="mailto:support@disasterwatch.org"
                      className="flex items-center p-4 rounded-2xl hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-indigo-200"
                    >
                      <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Headphones size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Support</p>
                        <p className="text-indigo-600 font-semibold">support@disasterwatch.org</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Enhanced Office Hours */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-3xl p-8 border border-blue-200/50 hover:shadow-xl hover:border-blue-300/50 transition-all duration-500 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <Clock size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">Office Hours</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl hover:bg-blue-100/50 transition-all duration-300 border border-transparent hover:border-blue-200/50 hover:shadow-md">
                      <span className="text-blue-700 font-semibold">Monday - Friday</span>
                      <span className="font-bold text-blue-900 text-lg">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl hover:bg-blue-100/50 transition-all duration-300 border border-transparent hover:border-blue-200/50 hover:shadow-md">
                      <span className="text-blue-700 font-semibold">Saturday</span>
                      <span className="font-bold text-blue-900 text-lg">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200 shadow-md">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-red-700 font-bold">Emergency Line</span>
                      </div>
                      <span className="font-black text-red-900 text-lg">24/7</span>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Find Us on the Map
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Visit our headquarters or get directions to our emergency response center
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <ContactMap height="400px" className="w-full" />
            </div>

            {/* Enhanced Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="group text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 hover:shadow-xl hover:border-blue-300/50 hover:scale-105 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Address</h3>
                <p className="text-gray-600 leading-relaxed">123 Emergency Response Ave<br />Disaster City, DC 12345</p>
              </div>

              <div className="group text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200/50 hover:shadow-xl hover:border-green-300/50 hover:scale-105 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Phone</h3>
                <p className="text-gray-600">
                  <a href="tel:+15551234567" className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200">
                    +1 (555) 123-4567
                  </a>
                </p>
              </div>

              <div className="group text-center p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200/50 hover:shadow-xl hover:border-indigo-300/50 hover:scale-105 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Email</h3>
                <p className="text-gray-600">
                  <a href="mailto:contact@disasterwatch.org" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
                    contact@disasterwatch.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Contact Methods Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100/20 rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 border border-blue-200 text-sm font-bold mb-8 text-blue-700">
                <Phone size={18} className="mr-2" />
                Contact Options
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                  Multiple Ways to Reach Us
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Choose the best way to contact us based on your needs and urgency level
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className={`${method.bgColor} ${method.borderColor} border-2 rounded-3xl p-10 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group relative overflow-hidden`}
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-24 h-24 ${method.iconColor} bg-white rounded-3xl mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <method.icon size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                      {method.description}
                    </p>
                    <div className="space-y-3 mb-8">
                      <p className="font-bold text-gray-900 text-xl">{method.contact}</p>
                      <div className="inline-flex items-center px-4 py-2 bg-white/80 rounded-full">
                        <Clock size={14} className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600 font-semibold">{method.availability}</span>
                      </div>
                    </div>
                    <a
                      href={method.action}
                      className={`inline-flex items-center justify-center w-full px-8 py-5 ${method.iconColor} bg-white border-2 ${method.borderColor} rounded-2xl font-bold text-lg hover:bg-gray-50 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      {method.actionText}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;