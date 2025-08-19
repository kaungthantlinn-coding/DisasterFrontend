import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  AlertTriangle,
  Clock,
  Send,
  CheckCircle,
  X,
  FileText,
  Heart,
  Shield,
  Zap,
  Building,
  Truck,
  Home,
  Utensils,
  Stethoscope,
  GraduationCap,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SupportRequestFormData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  
  // Request Details
  disasterType: string;
  urgencyLevel: 'immediate' | 'within_24h' | 'within_week' | 'non_urgent' | '';
  description: string;
  
  // Location and Date
  location: string;
  dateReported: string;
  
  // Assistance Types
  assistanceTypes: string[];
  
  // Status
  status: 'pending' | 'in_progress' | 'completed';
}

const disasterTypes = [
  { id: 'flood', label: 'Flood', icon: AlertTriangle, color: 'from-blue-500 to-blue-600' },
  { id: 'earthquake', label: 'Earthquake', icon: Zap, color: 'from-red-500 to-red-600' },
  { id: 'fire', label: 'Fire', icon: AlertTriangle, color: 'from-orange-500 to-orange-600' },
  { id: 'hurricane', label: 'Hurricane/Typhoon', icon: Shield, color: 'from-purple-500 to-purple-600' },
  { id: 'landslide', label: 'Landslide', icon: AlertTriangle, color: 'from-yellow-500 to-yellow-600' },
  { id: 'other', label: 'Other Disaster', icon: MessageSquare, color: 'from-gray-500 to-gray-600' }
];

const assistanceOptions = [
  { id: 'emergency_rescue', label: 'Emergency Rescue', icon: AlertTriangle },
  { id: 'medical_assistance', label: 'Medical Assistance', icon: Stethoscope },
  { id: 'food_water', label: 'Food & Water', icon: Utensils },
  { id: 'temporary_shelter', label: 'Temporary Shelter', icon: Home },
  { id: 'transportation', label: 'Transportation', icon: Truck },
  { id: 'psychological_support', label: 'Psychological Support', icon: Heart },
  { id: 'education_support', label: 'Education Support', icon: GraduationCap },
  { id: 'cleanup_restoration', label: 'Cleanup & Restoration', icon: Wrench },
  { id: 'financial_aid', label: 'Financial Aid', icon: Building },
  { id: 'other', label: 'Other', icon: MessageSquare }
];

const urgencyLevels = [
  { id: 'immediate', label: 'Immediate', description: 'Life-threatening emergency', color: 'from-red-500 to-red-600', icon: Zap },
  { id: 'within_24h', label: 'Within 24 Hours', description: 'Urgent assistance needed', color: 'from-orange-500 to-orange-600', icon: Clock },
  { id: 'within_week', label: 'Within a Week', description: 'Important but not urgent', color: 'from-yellow-500 to-yellow-600', icon: Clock },
  { id: 'non_urgent', label: 'Non-Urgent', description: 'General inquiry or support', color: 'from-green-500 to-green-600', icon: MessageSquare }
];

interface SupportRequestFormProps {
  onSubmitSuccess?: () => void;
}

const SupportRequestForm: React.FC<SupportRequestFormProps> = ({ onSubmitSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<SupportRequestFormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    disasterType: '',
    urgencyLevel: '',
    description: '',
    location: '',
    dateReported: new Date().toISOString().split('T')[0],
    assistanceTypes: [],
    status: 'pending'
  });

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      case 2:
        if (!formData.disasterType) newErrors.disasterType = 'Please select a disaster type';
        if (!formData.urgencyLevel) newErrors.urgencyLevel = 'Please select urgency level';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (formData.assistanceTypes.length === 0) newErrors.assistanceTypes = 'Please select at least one assistance type';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = useCallback(async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      onSubmitSuccess?.();
      
      // Reset form after successful submission
      setTimeout(() => {
        if (onSubmitSuccess) {
          onSubmitSuccess();
        } else {
          navigate('/dashboard');
        }
      }, 3000);
      
    } catch (error) {
      setErrors({ submit: 'Failed to submit support request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateStep, navigate, onSubmitSuccess]);

  const handleAssistanceTypeChange = (assistanceId: string) => {
    setFormData(prev => ({
      ...prev,
      assistanceTypes: prev.assistanceTypes.includes(assistanceId)
        ? prev.assistanceTypes.filter(id => id !== assistanceId)
        : [...prev.assistanceTypes, assistanceId]
    }));
  };

  const stepTitles = [
    'Personal Information',
    'Request Details & Assistance'
  ];

  if (submitSuccess) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your support request. Our team will review it and get back to you within 24 hours.
          </p>
          <div className="text-sm text-gray-500">
            <p>Reference ID: SR-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Support Request
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the help you need from our disaster response team
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center space-x-8">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              
              return (
                <div key={stepNumber} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isActive
                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle size={20} /> : stepNumber}
                    </div>
                    <span className={`mt-3 text-sm font-medium text-center ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {title}
                    </span>
                  </div>
                  {index < 1 && (
                    <div className={`w-16 h-0.5 mx-6 transition-colors duration-300 ${
                      isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+95-9-123456789"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Request Details & Assistance */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Request Details & Assistance</h2>
              
              {/* Disaster Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Disaster Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {disasterTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <label key={type.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="disasterType"
                          value={type.id}
                          checked={formData.disasterType === type.id}
                          onChange={(e) => setFormData(prev => ({ ...prev, disasterType: e.target.value }))}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                          formData.disasterType === type.id
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}>
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                            <Icon size={24} className="text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.disasterType && (
                  <p className="text-sm text-red-600 mt-2">{errors.disasterType}</p>
                )}
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Urgency Level *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {urgencyLevels.map((level) => {
                    const Icon = level.icon;
                    return (
                      <label key={level.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="urgencyLevel"
                          value={level.id}
                          checked={formData.urgencyLevel === level.id}
                          onChange={(e) => setFormData(prev => ({ ...prev, urgencyLevel: e.target.value as any }))}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.urgencyLevel === level.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center`}>
                              <Icon size={20} className="text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{level.label}</h3>
                              <p className="text-sm text-gray-600">{level.description}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.urgencyLevel && (
                  <p className="text-sm text-red-600 mt-2">{errors.urgencyLevel}</p>
                )}
              </div>

              {/* Location and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Yangon, Myanmar"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-600 mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Reported *
                  </label>
                  <div className="relative">
                    <Clock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dateReported}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateReported: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Assistance Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Type of Assistance Needed * (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {assistanceOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.assistanceTypes.includes(option.id);
                    return (
                      <label key={option.id} className="cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleAssistanceTypeChange(option.id)}
                          className="sr-only"
                        />
                        <div className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}>
                          <Icon size={18} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.assistanceTypes && (
                  <p className="text-sm text-red-600 mt-2">{errors.assistanceTypes}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                  rows={6}
                  maxLength={1000}
                  placeholder="Urgent help needed for flood victims in downtown area. Multiple families trapped."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.description.length}/1000 characters
                  </p>
                </div>
              </div>
            </div>
          )}



          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X size={20} className="mr-2" />
              Previous
            </button>

            {currentStep < 2 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Next
                <Send size={20} className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <Send size={20} className="ml-2" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportRequestForm;