import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import {
  Heart,
  Shield,
  Users,
  Globe,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  Star,
  ArrowRight,
  Lock,
  Award,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Gift,
  Calendar,
  DollarSign,
  Sparkles,
  Home,
  Utensils,
  Stethoscope,
  GraduationCap,
  Droplets,
  Lightbulb
} from 'lucide-react';

interface DonationFormData {
  amount: number;
  customAmount: string;
  frequency: 'one-time' | 'monthly' | 'yearly';
  paymentMethod: 'card' | 'paypal' | 'bank';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  anonymous: boolean;
  newsletter: boolean;
  dedication: string;
  coverFees: boolean;
}

const Donate: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 50,
    customAmount: '',
    frequency: 'one-time',
    paymentMethod: 'card',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    anonymous: false,
    newsletter: true,
    dedication: '',
    coverFees: false
  });

  const presetAmounts = [25, 50, 100, 250, 500, 1000];
  const totalSteps = 3;

  const impactData = [
    { amount: 25, impact: "Provides emergency supplies for 2 families", icon: Home },
    { amount: 50, impact: "Feeds 10 people for a week during crisis", icon: Utensils },
    { amount: 100, impact: "Medical aid for 5 disaster victims", icon: Stethoscope },
    { amount: 250, impact: "Educational support for 20 children", icon: GraduationCap },
    { amount: 500, impact: "Clean water access for 50 families", icon: Droplets },
    { amount: 1000, impact: "Emergency shelter for 25 families", icon: Home }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      location: "Flood Survivor, Philippines",
      quote: "The rapid response team arrived within hours. Your donations saved my family when we lost everything.",
      image: "/api/placeholder/60/60"
    },
    {
      name: "Dr. Michael Rodriguez",
      location: "Emergency Coordinator",
      quote: "With community support, we've been able to provide immediate medical care to over 10,000 disaster victims.",
      image: "/api/placeholder/60/60"
    },
    {
      name: "Amara Okafor",
      location: "Earthquake Survivor, Turkey",
      quote: "The emergency shelter program gave us hope when we had nowhere to go. Thank you for caring.",
      image: "/api/placeholder/60/60"
    }
  ];

  const stats = [
    { value: "2.3M", label: "Lives Helped", icon: Users, color: "from-blue-500 to-indigo-600" },
    { value: "156", label: "Countries Served", icon: Globe, color: "from-emerald-500 to-green-600" },
    { value: "98%", label: "Funds to Programs", icon: Target, color: "from-purple-500 to-pink-600" },
    { value: "24/7", label: "Emergency Response", icon: Clock, color: "from-orange-500 to-red-600" }
  ];

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount, customAmount: '' }));
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, customAmount: value, amount: numValue }));
  };

  const getCurrentImpact = () => {
    const currentAmount = formData.customAmount ? parseFloat(formData.customAmount) : formData.amount;
    return impactData.find(item => item.amount <= currentAmount) || impactData[0];
  };

  const calculateTotal = () => {
    const baseAmount = formData.customAmount ? parseFloat(formData.customAmount) : formData.amount;
    const feeAmount = formData.coverFees ? baseAmount * 0.029 + 0.30 : 0;
    return baseAmount + feeAmount;
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle donation submission
    console.log('Donation submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/30 to-red-500/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-6">
              <Heart size={18} className="mr-2 text-red-400" />
              Emergency Relief Fund
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Help Save Lives
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
              During Crisis
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12 font-medium">
            Your donation provides immediate emergency relief to disaster victims worldwide. 
            Every contribution makes a direct impact on saving lives and rebuilding communities.
          </p>

          {/* Quick Impact Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-gradient-to-r from-red-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center">
                Donate Now
                <Heart size={20} className="ml-2 group-hover:scale-110 transition-transform" />
              </span>
            </button>
            <Link
              to="/reports"
              className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
            >
              View Impact Reports
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <div id="donation-form" className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
              {/* Progress Indicator */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Make a Donation</h2>
                  <div className="text-sm text-gray-600">
                    Step {currentStep} of {totalSteps}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        i + 1 <= currentStep 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {i + 1 <= currentStep ? <CheckCircle size={16} /> : i + 1}
                      </div>
                      {i < totalSteps - 1 && (
                        <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                          i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {/* Step 1: Amount Selection */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Your Donation Amount</h3>

                      {/* Preset Amounts */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        {presetAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handleAmountSelect(amount)}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                              formData.amount === amount && !formData.customAmount
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="text-2xl font-bold">${amount}</div>
                          </button>
                        ))}
                      </div>

                      {/* Custom Amount */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Or enter a custom amount
                        </label>
                        <div className="relative">
                          <DollarSign size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            min="1"
                            step="0.01"
                            value={formData.customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg font-semibold"
                            placeholder="Enter amount"
                          />
                        </div>
                      </div>

                      {/* Frequency Selection */}
                      <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          Donation Frequency
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { value: 'one-time', label: 'One-time', icon: Gift },
                            { value: 'monthly', label: 'Monthly', icon: Calendar },
                            { value: 'yearly', label: 'Yearly', icon: TrendingUp }
                          ].map((freq) => (
                            <button
                              key={freq.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, frequency: freq.value as any }))}
                              className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center ${
                                formData.frequency === freq.value
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <freq.icon size={24} className="mb-2" />
                              <span className="font-semibold">{freq.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Impact Display */}
                      {(() => {
                        const currentImpact = getCurrentImpact();
                        if (!currentImpact) return null;
                        const IconComponent = currentImpact.icon;
                        return (
                          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                            <div className="flex items-center mb-3">
                              <div className="p-2 bg-emerald-500 rounded-xl mr-4">
                                <IconComponent size={24} className="text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-emerald-900">Your Impact</h4>
                                <p className="text-emerald-700">{currentImpact.impact}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Payment Method</h3>

                      {/* Payment Methods */}
                      <div className="grid gap-4 mb-8">
                        {[
                          { value: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, American Express' },
                          { value: 'paypal', label: 'PayPal', icon: Smartphone, description: 'Pay with your PayPal account' },
                          { value: 'bank', label: 'Bank Transfer', icon: Building, description: 'Direct bank transfer' }
                        ].map((method) => (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value as any }))}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                              formData.paymentMethod === method.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`p-3 rounded-xl mr-4 ${
                                formData.paymentMethod === method.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                <method.icon size={24} />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">{method.label}</div>
                                <div className="text-sm text-gray-600">{method.description}</div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 ${
                                formData.paymentMethod === method.value
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {formData.paymentMethod === method.value && (
                                  <CheckCircle size={20} className="text-white -m-0.5" />
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Cover Processing Fees */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <label className="flex items-start cursor-pointer">
                          <div className="relative mt-1">
                            <input
                              type="checkbox"
                              checked={formData.coverFees}
                              onChange={(e) => setFormData(prev => ({ ...prev, coverFees: e.target.checked }))}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-md border-2 transition-all duration-200 ${
                              formData.coverFees
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.coverFees && (
                                <CheckCircle size={16} className="text-white absolute inset-0.5" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-semibold text-blue-900">
                              Cover processing fees (+${((formData.customAmount ? parseFloat(formData.customAmount) : formData.amount) * 0.029 + 0.30).toFixed(2)})
                            </div>
                            <div className="text-sm text-blue-700">
                              Help us maximize your impact by covering the payment processing fees
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Donation Summary */}
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-4">Donation Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Donation amount:</span>
                            <span className="font-semibold">${(formData.customAmount ? parseFloat(formData.customAmount) : formData.amount).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Frequency:</span>
                            <span className="font-semibold capitalize">{formData.frequency}</span>
                          </div>
                          {formData.coverFees && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Processing fees:</span>
                              <span className="font-semibold">${((formData.customAmount ? parseFloat(formData.customAmount) : formData.amount) * 0.029 + 0.30).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-300 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="font-bold text-gray-900">Total:</span>
                              <span className="font-bold text-blue-600 text-lg">${calculateTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Donor Information */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Your Information</h3>

                      {/* Personal Information */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="your.email@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number (Optional)
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      {/* Dedication Message */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Dedication Message (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={formData.dedication}
                          onChange={(e) => setFormData(prev => ({ ...prev, dedication: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                          placeholder="In memory of... or In honor of..."
                        />
                      </div>

                      {/* Preferences */}
                      <div className="space-y-4">
                        <label className="flex items-start cursor-pointer">
                          <div className="relative mt-1">
                            <input
                              type="checkbox"
                              checked={formData.anonymous}
                              onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-md border-2 transition-all duration-200 ${
                              formData.anonymous
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.anonymous && (
                                <CheckCircle size={16} className="text-white absolute inset-0.5" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-semibold text-gray-900">Make this donation anonymous</div>
                            <div className="text-sm text-gray-600">Your name will not be displayed publicly</div>
                          </div>
                        </label>

                        <label className="flex items-start cursor-pointer">
                          <div className="relative mt-1">
                            <input
                              type="checkbox"
                              checked={formData.newsletter}
                              onChange={(e) => setFormData(prev => ({ ...prev, newsletter: e.target.checked }))}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-md border-2 transition-all duration-200 ${
                              formData.newsletter
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.newsletter && (
                                <CheckCircle size={16} className="text-white absolute inset-0.5" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-semibold text-gray-900">Subscribe to our newsletter</div>
                            <div className="text-sm text-gray-600">Receive updates on our disaster relief efforts</div>
                          </div>
                        </label>
                      </div>

                      {/* Final Summary */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mt-8">
                        <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                          <Heart size={20} className="mr-2 text-red-500" />
                          Final Donation Summary
                        </h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Amount:</span>
                              <span className="font-semibold text-blue-900">${(formData.customAmount ? parseFloat(formData.customAmount) : formData.amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Frequency:</span>
                              <span className="font-semibold text-blue-900 capitalize">{formData.frequency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Payment:</span>
                              <span className="font-semibold text-blue-900 capitalize">{formData.paymentMethod}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Processing fees:</span>
                              <span className="font-semibold text-blue-900">
                                {formData.coverFees ? `$${((formData.customAmount ? parseFloat(formData.customAmount) : formData.amount) * 0.029 + 0.30).toFixed(2)}` : 'Not covered'}
                              </span>
                            </div>
                            <div className="border-t border-blue-300 pt-2">
                              <div className="flex justify-between">
                                <span className="font-bold text-blue-900">Total:</span>
                                <span className="font-bold text-red-600 text-xl">${calculateTotal().toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {(() => {
                          const currentImpact = getCurrentImpact();
                          if (!currentImpact) return null;
                          const IconComponent = currentImpact.icon;
                          return (
                            <div className="mt-4 pt-4 border-t border-blue-300">
                              <div className="flex items-center">
                                <IconComponent size={20} className="mr-2 text-emerald-600" />
                                <span className="text-blue-800 font-medium">{currentImpact.impact}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Continue
                      <ArrowRight size={18} className="ml-2 inline" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Complete Donation
                      <Heart size={18} className="ml-2 inline" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trust Indicators */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield size={24} className="mr-3 text-blue-600" />
                Secure & Trusted
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Lock size={16} className="text-green-600 mr-3" />
                  <span className="text-gray-700">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center">
                  <Award size={16} className="text-blue-600 mr-3" />
                  <span className="text-gray-700">Charity Navigator 4-star rating</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-emerald-600 mr-3" />
                  <span className="text-gray-700">98% of funds go to programs</span>
                </div>
              </div>
            </div>

            {/* Recent Testimonial */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Impact</h3>
              <div className="space-y-6">
                {testimonials.slice(0, 1).map((testimonial, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start space-x-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-gray-700 italic mb-3">"{testimonial.quote}"</p>
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-600">{testimonial.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Impact Stories Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Stories of Impact</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how your donations are making a real difference in the lives of disaster survivors around the world.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Transparency & Accountability</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We believe in complete transparency about how your donations are used to maximize impact.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Fund Allocation Chart */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Your Donation is Used</h3>
                <div className="space-y-6">
                  {[
                    { category: "Emergency Relief Programs", percentage: 78, color: "bg-blue-500" },
                    { category: "Medical Aid & Supplies", percentage: 12, color: "bg-emerald-500" },
                    { category: "Infrastructure Rebuilding", percentage: 8, color: "bg-purple-500" },
                    { category: "Administrative Costs", percentage: 2, color: "bg-gray-400" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">{item.category}</span>
                        <span className="font-bold text-gray-900">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Award size={24} className="mr-3 text-yellow-500" />
                    Certifications & Awards
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                        <Star size={24} className="text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Charity Navigator 4-Star Rating</div>
                        <div className="text-sm text-gray-600">Highest rating for accountability and transparency</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <Shield size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">GuideStar Platinum Seal</div>
                        <div className="text-sm text-gray-600">Recognized for transparency and impact</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Better Business Bureau Accredited</div>
                        <div className="text-sm text-gray-600">Meets all 20 standards for charity accountability</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Lock size={24} className="mr-3 text-green-500" />
                    Security & Privacy
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-600 mr-3" />
                      <span className="text-gray-700">256-bit SSL encryption for all transactions</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-600 mr-3" />
                      <span className="text-gray-700">PCI DSS compliant payment processing</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-600 mr-3" />
                      <span className="text-gray-700">GDPR compliant data protection</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-600 mr-3" />
                      <span className="text-gray-700">No sharing of personal information</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000"></div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Every Second Counts
            </h2>
            <p className="text-xl text-orange-100 mb-12 leading-relaxed">
              Disasters don't wait. Your immediate action can be the difference between life and death for families in crisis. Join thousands of compassionate donors making an impact today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-white text-red-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  Start Saving Lives Now
                  <Zap size={20} className="ml-2 group-hover:scale-110 transition-transform" />
                </span>
              </button>
              <Link
                to="/reports"
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
              >
                See Current Emergencies
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
