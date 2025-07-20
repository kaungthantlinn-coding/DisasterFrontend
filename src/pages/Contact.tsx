import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
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
  Globe
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
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

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-6">
              <MessageCircle size={16} className="mr-2 text-blue-300" />
              Contact Us
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
              Get in Touch
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
                We're Here to Help
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Reach out to our team for emergency support, general inquiries, or partnership opportunities.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+15551234567"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Phone size={20} className="mr-2" />
                Emergency Call
              </a>
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
              >
                <MessageCircle size={20} className="mr-2" />
                Send Message
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div id="contact-form" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                    <p className="text-gray-600 mt-1">We'll get back to you within 24 hours</p>
                  </div>

                  <div className="p-6">
                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-gray-600 mb-8">
                          Thank you for contacting us. We'll respond within 24 hours.
                        </p>
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
                        >
                          Send Another Message
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
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter your full name"
                            />
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
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                              placeholder="your.email@example.com"
                            />
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
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="">Select a subject</option>
                            <option value="emergency">Emergency Support</option>
                            <option value="general">General Inquiry</option>
                            <option value="volunteer">Volunteer Opportunities</option>
                            <option value="partnership">Partnership</option>
                            <option value="technical">Technical Support</option>
                            <option value="other">Other</option>
                          </select>
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
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                            placeholder="Tell us how we can help you..."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader size={20} className="mr-2 animate-spin" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send size={20} className="mr-2" />
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Methods */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <Phone size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Emergency</p>
                        <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Mail size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">General</p>
                        <p className="text-gray-600 text-sm">contact@disasterwatch.org</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <Headphones size={16} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Support</p>
                        <p className="text-gray-600 text-sm">support@disasterwatch.org</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                    <Clock size={18} className="mr-2" />
                    Office Hours
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">Monday - Friday</span>
                      <span className="font-semibold text-blue-900">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">Saturday</span>
                      <span className="font-semibold text-blue-900">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">Emergency Line</span>
                      <span className="font-semibold text-blue-900">24/7</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin size={18} className="mr-2 text-blue-600" />
                    Our Location
                  </h3>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">DisasterWatch Headquarters</p>
                    <p className="text-gray-600 text-sm">123 Emergency Response Ave</p>
                    <p className="text-gray-600 text-sm">Disaster City, DC 12345</p>
                    <p className="text-gray-600 text-sm">United States</p>
                  </div>
                  <div className="mt-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={24} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Interactive Map</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the best way to contact us based on your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className={`${method.bgColor} ${method.borderColor} border-2 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${method.iconColor} bg-white rounded-xl mb-4 shadow-md`}>
                    <method.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {method.description}
                  </p>
                  <div className="space-y-1 mb-4">
                    <p className="font-semibold text-gray-900">{method.contact}</p>
                    <p className="text-xs text-gray-500">{method.availability}</p>
                  </div>
                  <a
                    href={method.action}
                    className={`inline-flex items-center justify-center w-full px-4 py-3 ${method.iconColor} bg-white border-2 ${method.borderColor} rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 text-sm`}
                  >
                    {method.actionText}
                  </a>
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