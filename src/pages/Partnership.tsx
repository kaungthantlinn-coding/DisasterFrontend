import React, { useState } from 'react';
import { Header } from '../components/Layout';
import { Handshake, Building, Users, Globe, CheckCircle, ArrowRight, Mail, Phone } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '../utils/notifications';

interface PartnershipType {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  requirements: string[];
}

const partnershipTypes: PartnershipType[] = [
  {
    title: "Corporate Partnership",
    description: "Partner with us to enhance your corporate social responsibility while making a meaningful impact on disaster preparedness and response.",
    icon: <Building size={24} />,
    benefits: [
      "Brand visibility in disaster response initiatives",
      "Employee volunteer opportunities",
      "CSR reporting and impact metrics",
      "Access to disaster preparedness training"
    ],
    requirements: [
      "Commitment to humanitarian values",
      "Minimum 2-year partnership agreement",
      "Dedicated partnership liaison",
      "Quarterly impact reviews"
    ]
  },
  {
    title: "NGO Collaboration",
    description: "Join our network of humanitarian organizations to coordinate resources and maximize impact during emergency situations.",
    icon: <Users size={24} />,
    benefits: [
      "Resource sharing and coordination",
      "Joint training and capacity building",
      "Coordinated response protocols",
      "Shared best practices and knowledge"
    ],
    requirements: [
      "Registered humanitarian organization",
      "Proven track record in disaster response",
      "Commitment to coordination protocols",
      "Regular participation in network activities"
    ]
  },
  {
    title: "Government Partnership",
    description: "Collaborate with government agencies to strengthen national disaster preparedness and response capabilities.",
    icon: <Globe size={24} />,
    benefits: [
      "Enhanced national preparedness",
      "Policy development support",
      "Capacity building programs",
      "International best practice sharing"
    ],
    requirements: [
      "Official government mandate",
      "Commitment to transparency",
      "Data sharing agreements",
      "Regular coordination meetings"
    ]
  }
];

const Partnership: React.FC = () => {
  const [selectedPartnership, setSelectedPartnership] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    partnershipType: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.organizationName || !formData.contactName || !formData.email || !formData.partnershipType) {
      showErrorToast('Please fill in all required fields.', 'Form Validation Error');
      return;
    }

    // Handle form submission
    console.log('Partnership application submitted:', formData);
    showSuccessToast(
      'Thank you for your interest in partnering with us! We will review your application and contact you within 48 hours.',
      'Partnership Application Submitted'
    );

    // Reset form
    setFormData({
      organizationName: '',
      contactName: '',
      email: '',
      phone: '',
      partnershipType: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg">
                <Handshake size={32} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Partnership Opportunities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join us in building a more resilient world. Partner with GDRC to enhance disaster 
              preparedness, response capabilities, and community resilience globally.
            </p>
          </div>

          {/* Partnership Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {partnershipTypes.map((partnership, index) => (
              <div 
                key={index} 
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border cursor-pointer ${
                  selectedPartnership === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white/20'
                }`}
                onClick={() => setSelectedPartnership(selectedPartnership === index ? null : index)}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      {partnership.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{partnership.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {partnership.description}
                  </p>
                  
                  {selectedPartnership === index && (
                    <div className="space-y-6 border-t border-gray-200 pt-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {partnership.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <ArrowRight size={14} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <CheckCircle size={16} className="text-blue-500 mr-2" />
                          Requirements
                        </h4>
                        <ul className="space-y-2">
                          {partnership.requirements.map((requirement, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <ArrowRight size={14} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                              {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Apply for Partnership</h2>
              <p className="text-gray-600">
                Ready to make a difference? Fill out the form below and we'll get back to you within 48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your organization name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Partnership Type *
                </label>
                <select
                  name="partnershipType"
                  value={formData.partnershipType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select partnership type</option>
                  <option value="corporate">Corporate Partnership</option>
                  <option value="ngo">NGO Collaboration</option>
                  <option value="government">Government Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us about your organization and how you'd like to partner with us..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Submit Partnership Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnership;
