import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  MapPin,

  AlertTriangle,
  Target,
  Camera,
  X,
  CheckCircle,
  Clock,
  Users,
  Phone,
  Mail,
  FileText,
  Zap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LocationPicker from '../components/Map/LocationPicker';
import { ReportsAPI } from '../apis/reports';

// Enhanced form data interface with better validation
interface FormData {
  // Step 1: Disaster Information
  disasterType: string;
  disasterDetail: string;
  customDisasterDetail: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | '';
  dateTime: string;
  
  // Step 2: Location & Impact
  location: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  impactType: string[];
  customImpactType: string;
  photos: File[];
  
  // Step 3: Assistance & Contact
  assistanceNeeded: string[];
  assistanceDescription: string;
  urgencyLevel: 'immediate' | 'within_24h' | 'within_week' | 'non_urgent' | '';
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  isEmergency: boolean;
}

// Enhanced disaster types with clean, real-world categories
const disasterTypes = {
  natural: {
    label: 'Natural Disasters',
    icon: Target,
    color: 'from-green-500 to-emerald-600',
    options: [
      'Earthquake',
      'Flood',
      'Hurricane/Typhoon',
      'Tornado',
      'Wildfire',
      'Landslide',
      'Tsunami',
      'Volcanic Eruption',
      'Drought',
      'Blizzard/Ice Storm',
      'Hailstorm',
      'Other Natural'
    ]
  },
  nonNatural: {
    label: 'Non-Natural Disasters',
    icon: AlertTriangle,
    color: 'from-red-500 to-orange-600',
    options: [
      'Industrial Accident',
      'Chemical Spill',
      'Oil Spill',
      'Nuclear Incident',
      'Building Collapse',
      'Transportation Accident',
      'Cyber Attack',
      'Infrastructure Failure',
      'Civil Unrest',
      'Other Non-Natural'
    ]
  }
};

const impactTypes = [
  'Property Damage',
  'Infrastructure Damage',
  'Environmental Impact',
  'Human Casualties',
  'Economic Loss',
  'Service Disruption',
  'Agricultural Loss',
  'Cultural Heritage Damage',
  'Other'
];

const assistanceTypes = [
  'Emergency Rescue',
  'Medical Assistance',
  'Food & Water',
  'Temporary Shelter',
  'Transportation',
  'Communication Support',
  'Financial Aid',
  'Cleanup & Restoration',
  'Psychological Support',
  'Legal Assistance',
  'Technical Expertise',
  'Volunteer Coordination'
];

interface ReportImpactProps {
  testMode?: boolean;
}

const ReportImpact: React.FC<ReportImpactProps> = ({ testMode = false }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    disasterType: '',
    disasterDetail: '',
    customDisasterDetail: '',
    description: '',
    severity: '',
    dateTime: '',
    location: null,
    impactType: [],
    customImpactType: '',
    photos: [],
    assistanceNeeded: [],
    assistanceDescription: '',
    urgencyLevel: '',
    contactName: user?.name || '',
    contactPhone: '',
    contactEmail: user?.email || '',
    isEmergency: false
  });

  // Enhanced validation with specific error messages
  const validateStep = useCallback((step: number): boolean => {
    console.log('validateStep called for step:', step);
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        console.log('Validating step 1...');
        if (!formData.disasterType) newErrors.disasterType = 'Please select a disaster category';
        if (!formData.disasterDetail) newErrors.disasterDetail = 'Please specify the type of disaster';
        if (formData.disasterDetail === 'Other Natural' || formData.disasterDetail === 'Other Non-Natural') {
          if (!formData.customDisasterDetail) newErrors.customDisasterDetail = 'Please specify the disaster type';
        }
        console.log('Description validation - trim():', formData.description.trim());
        console.log('Description validation - length:', formData.description.length);
        if (!formData.description.trim()) {
          console.log('Setting description error: empty description');
          newErrors.description = 'Please provide a description';
        } else if (formData.description.length < 20) {
          console.log('Setting description error: too short');
          newErrors.description = 'Description must be at least 20 characters';
        }
        if (!formData.severity) newErrors.severity = 'Please select severity level';
        if (!formData.dateTime) newErrors.dateTime = 'Please specify when the disaster occurred';
        break;
        
      case 2:
        if (!formData.location) newErrors.location = 'Please select a location on the map';
        if (formData.impactType.length === 0) newErrors.impactType = 'Please select at least one impact type';
        if (formData.impactType.includes('Other') && !formData.customImpactType) {
          newErrors.customImpactType = 'Please specify the custom impact type';
        }
        break;
        
      case 3:
        if (formData.assistanceNeeded.length === 0) newErrors.assistanceNeeded = 'Please select at least one type of assistance needed';
        if (!formData.assistanceDescription.trim()) newErrors.assistanceDescription = 'Please describe the assistance needed';
        if (!formData.urgencyLevel) newErrors.urgencyLevel = 'Please select urgency level';
        if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
        if (!formData.contactPhone.trim() && !formData.contactEmail.trim()) {
          newErrors.contact = 'Please provide either phone number or email';
        }
        break;
    }
    
    console.log('newErrors object:', newErrors);
    console.log('Setting errors with setErrors...');
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', isValid);
    return isValid;
  }, [formData]);

  // Check if current step can proceed without setting errors
  const checkCanProceed = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.disasterType && 
          formData.disasterDetail && 
          formData.description.trim() && 
          formData.description.length >= 20 &&
          formData.severity && 
          formData.dateTime &&
          (formData.disasterDetail !== 'Other Natural' && 
           formData.disasterDetail !== 'Other Non-Natural' || 
           formData.customDisasterDetail)
        );
        
      case 2:
        return !!(
          formData.location &&
          formData.impactType.length > 0 &&
          (!formData.impactType.includes('Other') || formData.customImpactType)
        );
        
      case 3:
        return !!(
          formData.assistanceNeeded.length > 0 &&
          formData.assistanceDescription.trim() &&
          formData.urgencyLevel &&
          formData.contactName.trim() &&
          (formData.contactPhone.trim() || formData.contactEmail.trim())
        );
        
      default:
        return true;
    }
  }, [formData]);

  // Only run validation when explicitly needed, not on every form change
  const canProceed = useMemo(() => {
    return checkCanProceed(currentStep);
  }, [currentStep, checkCanProceed]);

  const handleNext = useCallback(() => {
    console.log('handleNext called, currentStep:', currentStep);
    console.log('formData.description:', formData.description);
    console.log('formData.description.length:', formData.description.length);
    
    const isValid = validateStep(currentStep);
    console.log('validateStep result:', isValid);
    
    if (isValid) {
      console.log('Validation passed, moving to next step');
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setErrors({});
    } else {
      console.log('Validation failed, staying on current step');
    }
    // If validation fails, errors will be set by validateStep
  }, [currentStep, validateStep, formData.description]);

  // Handle Next button click - always validate, even if button would be disabled
  const handleNextClick = useCallback(() => {
    console.log('handleNextClick called, canProceed:', canProceed);
    if (canProceed) {
      handleNext();
    } else {
      // Even if we can't proceed, run validation to show errors
      console.log('Button disabled, but running validation to show errors');
      validateStep(currentStep);
    }
  }, [canProceed, handleNext, validateStep, currentStep]);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  const handleLocationSelect = useCallback((lat: number, lng: number, address: string) => {
    setFormData(prev => ({ ...prev, location: { address, lat, lng } }));
  }, []);

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...validFiles].slice(0, 10) // Max 10 photos
    }));
  }, []);

  const removePhoto = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  }, []);

  const toggleImpactType = useCallback((type: string) => {
    setFormData(prev => ({
      ...prev,
      impactType: prev.impactType.includes(type)
        ? prev.impactType.filter(t => t !== type)
        : [...prev.impactType, type]
    }));
  }, []);

  const toggleAssistanceType = useCallback((type: string) => {
    setFormData(prev => ({
      ...prev,
      assistanceNeeded: prev.assistanceNeeded.includes(type)
        ? prev.assistanceNeeded.filter(t => t !== type)
        : [...prev.assistanceNeeded, type]
    }));
  }, []);

  // Map UI disaster types to backend disaster types
  const mapDisasterType = useCallback((disasterDetail: string): string => {
    const mapping: Record<string, string> = {
      // Natural disasters
      'Earthquake': 'earthquake',
      'Flood': 'flood',
      'Hurricane/Typhoon': 'hurricane',
      'Tornado': 'tornado',
      'Wildfire': 'wildfire',
      'Landslide': 'landslide',
      'Tsunami': 'tsunami',
      'Volcanic Eruption': 'volcano',
      'Drought': 'drought',
      'Blizzard/Ice Storm': 'storm',
      'Hailstorm': 'storm',
      // Human-made disasters
      'Industrial Accident': 'industrial_accident',
      'Chemical Spill': 'chemical_spill',
      'Oil Spill': 'chemical_spill',
      'Nuclear Incident': 'nuclear_incident',
      'Building Collapse': 'structural_failure',
      'Transportation Accident': 'transportation_accident',
      'Cyber Attack': 'cyber_attack',
      'Terrorism': 'other',
      'Civil Unrest': 'other',
      // Health emergencies
      'Disease Outbreak': 'other',
      'Pandemic': 'other',
      'Food Poisoning': 'other',
      'Water Contamination': 'other',
      'Air Quality Crisis': 'other',
      'Medical Emergency': 'other'
    };
    
    return mapping[disasterDetail] || 'other';
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (!validateStep(3)) return;

    setIsSubmitting(true);
    
    try {
      // Ensure required fields are not empty before submission
      if (!formData.severity) {
        setErrors({ severity: 'Please select severity level' });
        return;
      }
      
      if (!formData.urgencyLevel) {
        setErrors({ urgencyLevel: 'Please select urgency level' });
        return;
      }
      
      // Prepare submission data with proper disaster type mapping
      const submissionData = {
        disasterType: mapDisasterType(formData.disasterDetail),
        disasterDetail: formData.disasterDetail,
        customDisasterDetail: formData.customDisasterDetail,
        description: formData.description,
        severity: formData.severity as 'low' | 'medium' | 'high' | 'critical',
        dateTime: formData.dateTime,
        location: {
          address: formData.location?.address || '',
          lat: formData.location?.lat || 0,
          lng: formData.location?.lng || 0
        },
        impactType: formData.impactType,
        customImpactType: formData.customImpactType,
        assistanceNeeded: formData.assistanceNeeded,
        assistanceDescription: formData.assistanceDescription,
        urgencyLevel: formData.urgencyLevel as 'immediate' | 'within_24h' | 'within_week' | 'non_urgent',
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        isEmergency: formData.isEmergency,
        photos: formData.photos
      };
      
      // Submit the report using the API
      await ReportsAPI.submitReport(submissionData);
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/reports');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      setErrors({ submit: 'Failed to submit report. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [isAuthenticated, validateStep, formData, navigate, mapDisasterType]);

  const stepTitles = [
    'Disaster Information',
    'Location & Impact',
    'Assistance & Contact',
    'Review & Submit'
  ];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for reporting this disaster. Our team will review your submission and take appropriate action.
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock size={16} className="mr-2" />
            Redirecting to reports page...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Clean Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Report a Disaster Impact
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help your community by reporting disaster impacts and requesting assistance
            </p>
          </div>
          
          {/* Beautiful Progress Steps */}
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
                    {index < stepTitles.length - 1 && (
                      <div className={`w-16 h-0.5 mx-6 transition-colors duration-300 ${
                        isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean Form Container */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 lg:p-12">
            {/* Emergency Alert */}
            {formData.isEmergency && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                <AlertTriangle size={20} className="text-red-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Emergency Situation Detected</h3>
                  <p className="text-red-700 text-sm mt-1">
                    For immediate life-threatening emergencies, please call emergency services (911) first.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Disaster Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Disaster Information</h2>
                  
                  {/* Emergency Toggle */}
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isEmergency}
                        onChange={(e) => setFormData(prev => ({ ...prev, isEmergency: e.target.checked }))}
                        className="mr-3 text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <span className="font-semibold text-orange-800">This is an emergency situation</span>
                        <p className="text-sm text-orange-700">Check this if immediate response is needed</p>
                      </div>
                    </label>
                  </div>

                  {/* Refined Disaster Type Selection */}
                  <div className="mb-8">
                    <label className="block text-lg font-semibold text-gray-900 mb-6">
                      Disaster Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(disasterTypes).map(([key, category]) => (
                        <label
                          key={key}
                          className={`group relative flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            formData.disasterType === key
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="disasterType"
                            value={key}
                            checked={formData.disasterType === key}
                            onChange={(e) => setFormData(prev => ({ ...prev, disasterType: e.target.value, disasterDetail: '' }))}
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 mr-4"
                          />
                          <div className="flex-1">
                            <span className={`text-lg font-semibold transition-colors duration-200 ${
                              formData.disasterType === key ? 'text-blue-900' : 'text-gray-900 group-hover:text-blue-800'
                            }`}>
                              {category.label}
                            </span>
                          </div>
                          {/* Selection indicator */}
                          {formData.disasterType === key && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle size={16} className="text-white" />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.disasterType && (
                      <p className="mt-3 text-sm text-red-600 flex items-center" data-testid="disasterType-error">
                        <AlertTriangle size={16} className="mr-2" />
                        {errors.disasterType}
                      </p>
                    )}
                  </div>

                  {/* Specific Disaster Type */}
                  {formData.disasterType && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Specific Type *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {disasterTypes[formData.disasterType as keyof typeof disasterTypes].options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, disasterDetail: option }))}
                            className={`p-3 border rounded-xl text-sm transition-all duration-200 ${
                              formData.disasterDetail === option
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {errors.disasterDetail && (
                        <p className="mt-2 text-sm text-red-600" data-testid="disasterDetail-error">{errors.disasterDetail}</p>
                      )}
                    </div>
                  )}

                  {/* Custom Disaster Detail */}
                  {(formData.disasterDetail === 'Other Natural' || 
                    formData.disasterDetail === 'Other Non-Natural') && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Please specify *
                      </label>
                      <input
                        type="text"
                        value={formData.customDisasterDetail}
                        onChange={(e) => setFormData(prev => ({ ...prev, customDisasterDetail: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Specify the type of disaster"
                      />
                      {errors.customDisasterDetail && (
                        <p className="mt-2 text-sm text-red-600" data-testid="customDisasterDetail-error">{errors.customDisasterDetail}</p>
                      )}
                    </div>
                  )}

                  {/* Severity Level */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Severity Level *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'low', label: 'Low', color: 'from-green-500 to-green-600' },
                        { value: 'medium', label: 'Medium', color: 'from-yellow-500 to-yellow-600' },
                        { value: 'high', label: 'High', color: 'from-orange-500 to-orange-600' },
                        { value: 'critical', label: 'Critical', color: 'from-red-500 to-red-600' }
                      ].map((severity) => (
                        <button
                          key={severity.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, severity: severity.value as any }))}
                          className={`p-3 border rounded-xl transition-all duration-200 ${
                            formData.severity === severity.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${severity.color} mx-auto mb-2`} />
                          <span className="text-sm font-medium">{severity.label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.severity && (
                      <p className="mt-2 text-sm text-red-600" data-testid="severity-error">{errors.severity}</p>
                    )}
                  </div>

                  {/* Date and Time */}
                  <div className="mb-6">
                    <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-2">
                      When did this occur? *
                    </label>
                    <input
                      id="dateTime"
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                      max={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.dateTime && (
                      <p className="mt-2 text-sm text-red-600" data-testid="dateTime-error">{errors.dateTime}</p>
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
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Provide detailed information about what happened, current situation, and any immediate concerns..."
                    />
                    <div className="flex justify-between mt-2">
                      <div>
                        {errors.description && (
                          <p className="text-sm text-red-600" data-testid="description-error">{errors.description}</p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formData.description.length}/500 characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Impact */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Location & Impact Assessment</h2>

                {/* Location Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Location *
                  </label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                  </div>
                  {formData.location && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center">
                      <MapPin size={16} className="text-green-600 mr-2" />
                      <span className="text-sm text-green-800">{formData.location.address}</span>
                    </div>
                  )}
                  {errors.location && (
                    <p className="mt-2 text-sm text-red-600" data-testid="location-error">{errors.location}</p>
                  )}
                </div>

                {/* Impact Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Type of Impact *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {impactTypes.map((type) => (
                      <label key={type} className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-200">
                        <input
                          type="checkbox"
                          checked={formData.impactType.includes(type)}
                          onChange={() => toggleImpactType(type)}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.impactType && (
                    <p className="mt-2 text-sm text-red-600" data-testid="impactType-error">{errors.impactType}</p>
                  )}
                </div>

                {/* Custom Impact Type */}
                {formData.impactType.includes('Other') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please specify other impact type *
                    </label>
                    <input
                      type="text"
                      value={formData.customImpactType}
                      onChange={(e) => setFormData(prev => ({ ...prev, customImpactType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Specify the type of impact"
                    />
                    {errors.customImpactType && (
                      <p className="mt-2 text-sm text-red-600" data-testid="customImpactType-error">{errors.customImpactType}</p>
                    )}
                  </div>
                )}



                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Photos (Optional - Max 10 photos, 10MB each)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload photos</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Assistance & Contact */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Assistance Needed & Contact Information</h2>

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

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review & Submit</h2>

                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                  {/* Disaster Information */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText size={20} className="mr-2" />
                      Disaster Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <p className="font-medium">
                          {formData.disasterDetail || formData.customDisasterDetail}
                          {formData.isEmergency && <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">EMERGENCY</span>}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Severity:</span>
                        <p className="font-medium capitalize">{formData.severity}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Date & Time:</span>
                        <p className="font-medium">{new Date(formData.dateTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Urgency:</span>
                        <p className="font-medium capitalize">{formData.urgencyLevel?.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-600">Description:</span>
                      <p className="font-medium mt-1">{formData.description}</p>
                    </div>
                  </div>

                  {/* Location & Impact */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin size={20} className="mr-2" />
                      Location & Impact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">{formData.location?.address}</p>
                        <p className="text-xs text-gray-500">
                          {formData.location?.lat.toFixed(6)}, {formData.location?.lng.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">People Affected:</span>
                        <p className="font-medium">{formData.affectedPeople}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Impact Types:</span>
                        <p className="font-medium">
                          {formData.impactType.join(', ')}
                          {formData.impactType.includes('Other') && formData.customImpactType &&
                            ` (${formData.customImpactType})`
                          }
                        </p>
                      </div>
                      {formData.estimatedDamage && (
                        <div>
                          <span className="text-gray-600">Estimated Damage:</span>
                          <p className="font-medium capitalize">{formData.estimatedDamage}</p>
                        </div>
                      )}
                    </div>
                    
                    {formData.photos.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-600">Photos ({formData.photos.length}):</span>
                        <div className="flex space-x-2 mt-2">
                          {formData.photos.slice(0, 5).map((photo, index) => (
                            <img
                              key={index}
                              src={URL.createObjectURL(photo)}
                              alt={`Preview ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                          {formData.photos.length > 5 && (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-600">
                              +{formData.photos.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Assistance & Contact */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Users size={20} className="mr-2" />
                      Assistance & Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Assistance Needed:</span>
                        <p className="font-medium">{formData.assistanceNeeded.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <p className="font-medium">{formData.contactName}</p>
                        {formData.contactPhone && <p className="text-gray-600">{formData.contactPhone}</p>}
                        {formData.contactEmail && <p className="text-gray-600">{formData.contactEmail}</p>}
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-600">Assistance Description:</span>
                      <p className="font-medium mt-1">{formData.assistanceDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
                  <AlertTriangle size={20} className="text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800">Important Notice</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Your report will be reviewed by our emergency response team. We may contact you for additional information. 
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
                    You need to be logged in to submit a disaster impact report. This helps us verify reports and contact you if needed.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate('/login')}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setShowLoginPrompt(false)}
                      className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-100">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} className="mr-2" />
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNextClick}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-sm ${
                    canProceed 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700' 
                      : 'bg-gray-300 text-gray-600 cursor-pointer'
                  }`}
                >
                  Next
                  <ChevronRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
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

export default ReportImpact;