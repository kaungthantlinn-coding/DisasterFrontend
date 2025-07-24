import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Shield,
  Users,
  Globe,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  TrendingUp,
  Clock,
  Target,
  Gift,
  DollarSign,
  Home,
  Utensils,
  Stethoscope,
  Droplets,
  Star,
  Award,
  Eye
} from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

interface DonationFormData {
  amount: number;
  customAmount: string;
  frequency: 'one-time' | 'monthly';
  paymentMethod: 'card' | 'paypal' | 'bank';
  email: string;
  firstName: string;
  lastName: string;
  anonymous: boolean;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const Donate: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 50,
    customAmount: '',
    frequency: 'one-time',
    paymentMethod: 'card',
    email: '',
    firstName: '',
    lastName: '',
    anonymous: false,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const totalSteps = 3;
  const presetAmounts = [25, 50, 100, 250, 500];

  // Impact data showing what donations can achieve
  const impactData = [
    { amount: 25, impact: 'Emergency supplies for 1 family', icon: Home, color: 'from-blue-500 to-blue-600' },
    { amount: 50, impact: 'Clean water for 1 week', icon: Droplets, color: 'from-cyan-500 to-cyan-600' },
    { amount: 100, impact: 'Medical aid for 5 people', icon: Stethoscope, color: 'from-green-500 to-green-600' },
    { amount: 250, impact: 'Food supplies for 1 month', icon: Utensils, color: 'from-orange-500 to-orange-600' },
    { amount: 500, impact: 'Emergency shelter setup', icon: Shield, color: 'from-purple-500 to-purple-600' }
  ];

  // Stats matching your design system
  const stats = [
    { icon: Users, value: '2.4M+', label: 'Lives Protected', color: 'from-blue-500 to-blue-600' },
    { icon: Target, value: '98%', label: 'Funds to Programs', color: 'from-emerald-500 to-emerald-600' },
    { icon: Clock, value: '24/7', label: 'Emergency Response', color: 'from-purple-500 to-purple-600' },
    { icon: Globe, value: '150+', label: 'Countries Served', color: 'from-orange-500 to-orange-600' }
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Secure payment with Visa, Mastercard, or American Express',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Shield,
      description: 'Pay securely with your PayPal account',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: DollarSign,
      description: 'Direct bank transfer for larger donations',
      color: 'from-green-500 to-green-600'
    }
  ];

  // Success stories
  const successStories = [
    {
      title: 'Earthquake Response in Turkey',
      description: 'Your donations helped provide emergency shelter and medical aid to 15,000 families.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      impact: '15,000 families helped'
    },
    {
      title: 'Flood Relief in Bangladesh',
      description: 'Clean water systems and food supplies reached 8,500 people in affected areas.',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      impact: '8,500 people reached'
    },
    {
      title: 'Wildfire Recovery in California',
      description: 'Emergency response teams and recovery resources for 12,000 displaced residents.',
      image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      impact: '12,000 residents assisted'
    }
  ];

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount, customAmount: '' }));
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, customAmount: value, amount: numValue }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getCurrentImpact = () => {
    const currentAmount = formData.customAmount ? parseFloat(formData.customAmount) : formData.amount;
    return impactData.find(item => item.amount <= currentAmount) || impactData[0];
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
    console.log('Donation submitted:', formData);
    setIsSubmitted(true);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section - Matching your design system */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Floating background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium mb-8">
                <Heart size={16} className="mr-2 text-red-300" />
                <span className="text-white/90">Make a Difference</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="block mb-2">Support Disaster</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                  Response Efforts
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                Your donation helps us provide immediate emergency response, life-saving resources, 
                and long-term recovery support to communities affected by disasters worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Heart size={20} className="mr-2" />
                  Donate Now
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/about"
                  className="group bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  <Eye size={20} className="mr-2" />
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Matching your design system */}
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

        {/* Donation Impact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-6">
                <Target size={16} className="mr-2" />
                Your Impact
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                See How Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Donation Helps</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Every dollar makes a difference. Here's how your contribution directly impacts disaster response efforts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {impactData.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80 text-center"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">${item.amount}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>      
  {/* Donation Form Section */}
        <section id="donation-form" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Make Your Donation</h2>
              <p className="text-xl text-gray-600">
                Choose your donation amount and help us continue our life-saving work.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Progress Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Secure Donation</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Lock size={16} className="mr-2" />
                    <span>Step {currentStep} of {totalSteps}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center space-x-4">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        i + 1 <= currentStep 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {i + 1 <= currentStep ? <CheckCircle size={20} /> : i + 1}
                      </div>
                      {i < totalSteps - 1 && (
                        <div className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
                          i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {isSubmitted ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Thank You for Your Generosity!
                  </h3>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Your donation of ${formData.customAmount || formData.amount} will make a real difference 
                    in disaster response efforts. You'll receive a confirmation email shortly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/"
                      className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <Home size={20} className="mr-2" />
                      Return Home
                    </Link>
                    <Link
                      to="/reports"
                      className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                    >
                      <Eye size={20} className="mr-2" />
                      View Impact Reports
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8">
                  {/* Step 1: Amount & Frequency */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-6">
                          Choose Your Donation Amount
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                          {presetAmounts.map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => handleAmountSelect(amount)}
                              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                                formData.amount === amount && !formData.customAmount
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="text-2xl font-bold">${amount}</div>
                              <div className="text-sm text-gray-500 mt-1">USD</div>
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={formData.customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            className="w-full pl-12 pr-16 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter custom amount"
                          />
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-lg">
                            $
                          </span>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            USD
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-6">
                          Donation Frequency
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: 'one-time', label: 'One-time Donation', icon: Gift, description: 'Make a single donation' },
                            { value: 'monthly', label: 'Monthly Donation', icon: TrendingUp, description: 'Ongoing monthly support' }
                          ].map((freq) => (
                            <button
                              key={freq.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, frequency: freq.value as any }))}
                              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                                formData.frequency === freq.value
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center mb-3">
                                <freq.icon size={24} className="mr-3" />
                                <span className="font-semibold text-lg">{freq.label}</span>
                              </div>
                              <p className="text-sm text-gray-600">{freq.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Impact Preview */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h4>
                        <div className="flex items-center">
                          {(() => {
                            const impact = getCurrentImpact();
                            const IconComponent = impact.icon;
                            return (
                              <>
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${impact.color} text-white mr-4`}>
                                  <IconComponent size={24} />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    ${formData.customAmount || formData.amount} {formData.frequency === 'monthly' ? 'per month' : ''}
                                  </p>
                                  <p className="text-gray-600">{impact.impact}</p>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Payment Method */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-6">
                          Choose Payment Method
                        </label>
                        <div className="space-y-4">
                          {paymentMethods.map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                                formData.paymentMethod === method.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`p-3 rounded-xl mr-4 bg-gradient-to-r ${method.color} text-white`}>
                                  <method.icon size={24} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 text-lg">{method.name}</div>
                                  <div className="text-gray-600">{method.description}</div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 ${
                                  formData.paymentMethod === method.id
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }`}>
                                  {formData.paymentMethod === method.id && (
                                    <CheckCircle size={20} className="text-white -m-0.5" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Personal Info & Payment Details */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter your first name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter your last name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
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
                      </div>

                      {/* Payment Details for Card */}
                      {formData.paymentMethod === 'card' && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h3>
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cardholder Name
                              </label>
                              <input
                                type="text"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                placeholder="Name as it appears on card"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card Number
                              </label>
                              <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                                required
                                maxLength={19}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  name="expiryDate"
                                  value={formData.expiryDate}
                                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                                  required
                                  maxLength={5}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                  placeholder="MM/YY"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  name="cvv"
                                  value={formData.cvv}
                                  onChange={handleInputChange}
                                  required
                                  maxLength={4}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                  placeholder="123"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Other Payment Methods */}
                      {formData.paymentMethod !== 'card' && (
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {formData.paymentMethod === 'paypal' ? 'PayPal Payment' : 'Bank Transfer Details'}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {formData.paymentMethod === 'paypal' 
                              ? 'You will be redirected to PayPal to complete your donation securely.'
                              : 'Bank transfer details will be provided after you submit this form.'
                            }
                          </p>
                        </div>
                      )}

                      {/* Anonymous Option */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <label className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            name="anonymous"
                            checked={formData.anonymous}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mt-1"
                          />
                          <div className="ml-3">
                            <span className="font-medium text-gray-900">Make this donation anonymous</span>
                            <p className="text-sm text-gray-600 mt-1">
                              Your name will not be displayed publicly, but we'll still send you a receipt.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                        currentStep === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <ArrowLeft size={20} className="mr-2" />
                      Previous
                    </button>

                    {currentStep === totalSteps ? (
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                      >
                        <Heart size={20} className="mr-2" />
                        Complete Donation
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center"
                      >
                        Next
                        <ArrowRight size={20} className="ml-2" />
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-6">
                <Award size={16} className="mr-2" />
                Success Stories
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Your Donations <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">In Action</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                See how your generous contributions have made a real difference in disaster-affected communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100/80"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
                      <Star size={14} className="mr-1" />
                      {story.impact}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{story.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{story.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Matching your design system */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Every Donation Saves Lives
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Join thousands of supporters who are making a difference in disaster response and recovery efforts worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Heart size={20} className="mr-3" />
                  Donate Today
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  Contact Us
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

export default Donate;