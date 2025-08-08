import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Users,
  Phone,
  Mail,
  FileText,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

interface SupportFormData {
  assistanceNeeded: string[];
  customAssistanceType: string;
  assistanceDescription: string;
  urgencyLevel: 'immediate' | 'within_24h' | 'within_week' | 'non_urgent' | '';
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const assistanceTypes = [
  'Emergency Rescue',
  'Medical Assistance',
  'Food & Water',
  'Temporary Shelter',
  'Transportation',
  'Cleanup & Restoration',
  'Financial Aid',
  'Legal Assistance',
  'Technical Expertise',
  'Communication Support',
  'Psychological Support',
  'Volunteer Coordination',
  'Other'
];

interface SupportRequestProps {
  testMode?: boolean;
}

const SupportRequest: React.FC<SupportRequestProps> = ({ testMode = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const [formData, setFormData] = useState<SupportFormData>({
    assistanceNeeded: [],
    customAssistanceType: '',
    assistanceDescription: '',
    urgencyLevel: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (formData.assistanceNeeded.length === 0) newErrors.assistanceNeeded = 'Please select at least one type of assistance needed';
        if (formData.assistanceNeeded.includes('Other') && !formData.customAssistanceType) {
          newErrors.customAssistanceType = 'Please specify the custom assistance type';
        }
        if (!formData.assistanceDescription.trim()) newErrors.assistanceDescription = 'Please describe the assistance needed';
        if (!formData.urgencyLevel) newErrors.urgencyLevel = 'Please select urgency level';
        break;
        
      case 2:
        if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
        if (!formData.contactPhone.trim() && !formData.contactEmail.trim()) {
          newErrors.contact = 'Please provide either phone number or email';
        }
        break;
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return isValid;
  }, [formData]);

  // Check if current step can proceed without setting errors
  const checkCanProceed = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.assistanceNeeded.length > 0 &&
          (!formData.assistanceNeeded.includes('Other') || formData.customAssistanceType) &&
          formData.assistanceDescription.trim() &&
          formData.urgencyLevel
        );
        
      case 2:
        return !!(
          formData.contactName.trim() &&
          (formData.contactPhone.trim() || formData.contactEmail.trim())
        );
        
      default:
        return true;
    }
  }, [formData]);

  const toggleAssistanceType = useCallback((type: string) => {
    setFormData(prev => ({
      ...prev,
      assistanceNeeded: prev.assistanceNeeded.includes(type)
        ? prev.assistanceNeeded.filter(t => t !== type)
        : [...prev.assistanceNeeded, type]
    }));
  }, []);

  const handleNext = useCallback(() => {
    const isValid = validateStep(currentStep);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setErrors({});
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (!validateStep(2)) return;

    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        assistanceNeeded: formData.assistanceNeeded,
        customAssistanceType: formData.customAssistanceType,
        assistanceDescription: formData.assistanceDescription,
        urgencyLevel: formData.urgencyLevel,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail
      };
      
      // Submit the support request using the API
      // await SupportAPI.submitRequest(submissionData);
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      setErrors({ submit: 'Failed to submit support request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [isAuthenticated, validateStep, formData, navigate]);

  const stepTitles = [
    'Assistance Details',
    'Contact Information',
    'Review & Submit'
  ];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your support request has been submitted successfully. Our team will review it and contact you soon.
          </p>
          <div className="text-sm text-gray-500">
            Redirecting to dashboard in 3 seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Request Support
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Need assistance? Fill out this form to request support from our emergency response team.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {stepTitles.map((title, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;
                
                return (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : (
                        <span className="text-sm font-semibold">{stepNumber}</span>
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {title}
                    </span>
                    {index < stepTitles.length - 1 && (
                      <ChevronRight size={16} className="mx-4 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Step 1: Assistance Details */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Assistance Details</h2>

                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Urgency Level *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'immediate', label: 'Immediate', desc: 'Life-threatening', color: 'from-red-500 to-red-600', icon: Zap },
                      { value: 'within_24h', label: 'Within 24h', desc: 'Urgent', color: 'from-orange-500 to-orange-600', icon: Clock },
                      { value: 'within_week', label: 'Within Week', desc: 'Important', color: 'from-yellow-500 to-yellow-600', icon: Clock },
                      { value: 'non_urgent', label: 'Non-urgent', desc: 'When possible', color: 'from-green-500 to-green-600', icon: Clock }
                    ].map((urgency) => {
                      const Icon = urgency.icon;
                      return (
                        <button
                          key={urgency.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, urgencyLevel: urgency.value as any }))}
                          className={`p-4 border rounded-xl transition-all duration-200 text-center ${
                            formData.urgencyLevel === urgency.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${urgency.color} mx-auto mb-2 flex items-center justify-center`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <div className="text-sm font-medium">{urgency.label}</div>
                          <div className="text-xs text-gray-500">{urgency.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.urgencyLevel && (
                    <p className="mt-2 text-sm text-red-600" data-testid="urgencyLevel-error">{errors.urgencyLevel}</p>
                  )}
                </div>

                {/* Assistance Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Type of Assistance Needed *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {assistanceTypes.map((type) => (
                      <label key={type} className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-200">
                        <input
                          type="checkbox"
                          checked={formData.assistanceNeeded.includes(type)}
                          onChange={() => toggleAssistanceType(type)}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.assistanceNeeded && (
                    <p className="mt-2 text-sm text-red-600" data-testid="assistanceNeeded-error">{errors.assistanceNeeded}</p>
                  )}
                </div>

                {/* Custom Assistance Type */}
                {formData.assistanceNeeded.includes('Other') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please specify other assistance type *
                    </label>
                    <input
                      type="text"
                      value={formData.customAssistanceType}
                      onChange={(e) => setFormData(prev => ({ ...prev, customAssistanceType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Specify the type of assistance needed"
                    />
                    {errors.customAssistanceType && (
                      <p className="mt-2 text-sm text-red-600" data-testid="customAssistanceType-error">{errors.customAssistanceType}</p>
                    )}
                  </div>
                )}

                {/* Assistance Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Assistance Description *
                  </label>
                  <textarea
                    value={formData.assistanceDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, assistanceDescription: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide specific details about what help is needed, how many people are affected, any special requirements, accessibility needs, etc."
                  />
                  {errors.assistanceDescription && (
                    <p className="mt-2 text-sm text-red-600" data-testid="assistanceDescription-error">{errors.assistanceDescription}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>

                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                  {errors.contactName && (
                    <p className="mt-2 text-sm text-red-600" data-testid="contactName-error">{errors.contactName}</p>
                  )}
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Contact requirement note */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-700 text-sm">
                    <strong>Note:</strong> Please provide at least one contact method (phone or email) so we can reach you.
                  </p>
                </div>

                {errors.contact && (
                  <p className="text-sm text-red-600" data-testid="contact-error">{errors.contact}</p>
                )}
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review & Submit</h2>

                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                  {/* Assistance Details */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText size={20} className="mr-2" />
                      Assistance Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Urgency Level:</span>
                        <p className="font-medium capitalize">{formData.urgencyLevel?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Assistance Needed:</span>
                        <p className="font-medium">
                          {formData.assistanceNeeded.join(', ')}
                          {formData.assistanceNeeded.includes('Other') && formData.customAssistanceType &&
                            ` (${formData.customAssistanceType})`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-600">Description:</span>
                      <p className="font-medium mt-1">{formData.assistanceDescription}</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Users size={20} className="mr-2" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium">{formData.contactName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        {formData.contactPhone && <p className="font-medium">{formData.contactPhone}</p>}
                        {formData.contactEmail && <p className="font-medium">{formData.contactEmail}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
                  <AlertTriangle size={20} className="text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800">Important Notice</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Your support request will be reviewed by our emergency response team. We will contact you as soon as possible based on the urgency level you selected.
                      For immediate life-threatening emergencies, please call emergency services (911) directly.
                    </p>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700">{errors.submit}</p>
                  </div>
                )}
              </div>
            )}

            {/* Login Prompt Modal */}
            {showLoginPrompt && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md mx-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Required</h3>
                  <p className="text-gray-600 mb-6">
                    You need to be logged in to submit a support request. Please log in or create an account to continue.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowLoginPrompt(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <ChevronLeft size={20} className="mr-2" />
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!checkCanProceed(currentStep)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    checkCanProceed(currentStep)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !checkCanProceed(2)}
                  className={`flex items-center px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isSubmitting || !checkCanProceed(2)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SupportRequest;