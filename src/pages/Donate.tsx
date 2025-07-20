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
  QrCode,
  Smartphone,
  Copy,
  Download
} from 'lucide-react';

interface DonationFormData {
  amount: number;
  customAmount: string;
  frequency: 'one-time' | 'monthly';
  paymentMethod: 'card' | 'kpay' | 'wavepay';
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  anonymous: boolean;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const Donate: React.FC = () => {
  const { t } = useTranslation();
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
    phone: '',
    anonymous: false,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const totalSteps = 3;
  const presetAmounts = [1000, 5000, 10000, 25000, 50000]; // Myanmar Kyat amounts

  const impactData = [
    { amount: 1000, impact: "Emergency supplies for 1 family", icon: Home },
    { amount: 5000, impact: "Food for 5 people for a week", icon: Utensils },
    { amount: 10000, impact: "Medical aid for 3 victims", icon: Stethoscope },
    { amount: 25000, impact: "Clean water for 15 families", icon: Droplets },
    { amount: 50000, impact: "Emergency shelter for 10 families", icon: Home }
  ];

  const stats = [
    { value: "2.3M", label: "Lives Helped", icon: Users, color: "from-blue-500 to-indigo-600" },
    { value: "98%", label: "Direct Impact", icon: Target, color: "from-emerald-500 to-green-600" },
    { value: "24/7", label: "Response Time", icon: Clock, color: "from-purple-500 to-pink-600" },
    { value: "156", label: "Countries", icon: Globe, color: "from-orange-500 to-red-600" }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'kpay',
      name: 'KBZ Pay',
      icon: QrCode,
      description: 'Scan QR code to pay',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'wavepay',
      name: 'Wave Pay',
      icon: Smartphone,
      description: 'Scan QR code to pay',
      color: 'from-purple-500 to-purple-600'
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

  const generateQRData = () => {
    const amount = formData.customAmount ? parseFloat(formData.customAmount) : formData.amount;
    return `${formData.paymentMethod}://pay?amount=${amount}&currency=MMK&reference=DONATION_${Date.now()}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-6">
            <Heart size={18} className="mr-2 text-red-400" />
            Emergency Relief Fund
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Help Save Lives
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
              During Crisis
            </span>
          </h1>

          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-8">
            Your donation provides immediate emergency relief to disaster victims in Myanmar.
          </p>

          {/* Quick Impact Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-blue-200 text-xs font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center mx-auto"
          >
            <Heart size={20} className="mr-2" />
            Donate Now
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Multi-Step Donation Form */}
          <div className="lg:col-span-2">
            <div id="donation-form" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Progress Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Make a Donation</h2>
                  <div className="text-sm text-gray-600">
                    Step {currentStep} of {totalSteps}
                  </div>
                </div>
                
                {/* Progress Bar */}
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

              {isSubmitted ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Donation Successful!
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Thank you for your generous donation. Your contribution will help save lives during disasters.
                  </p>
                  <Link
                    to="/"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    Return to Home
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6">
                  {/* Step 1: Amount & Frequency */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          Donation Amount (MMK)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                          {presetAmounts.map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => handleAmountSelect(amount)}
                              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                                formData.amount === amount && !formData.customAmount
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="text-sm font-bold">{amount.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">MMK</div>
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <input
                            type="number"
                            min="1000"
                            step="1000"
                            value={formData.customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            className="w-full pl-4 pr-16 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="Custom amount"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            MMK
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          Frequency
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: 'one-time', label: 'One-time', icon: Gift },
                            { value: 'monthly', label: 'Monthly', icon: TrendingUp }
                          ].map((freq) => (
                            <button
                              key={freq.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, frequency: freq.value as any }))}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                                formData.frequency === freq.value
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <freq.icon size={20} className="mr-2" />
                              <span className="font-semibold">{freq.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Payment Method */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          Choose Payment Method
                        </label>
                        <div className="grid gap-4">
                          {paymentMethods.map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
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
                                  <div className="font-semibold text-gray-900">{method.name}</div>
                                  <div className="text-sm text-gray-600">{method.description}</div>
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

                  {/* Step 3: Payment Details & Personal Info */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name *
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
                              Last Name *
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                              placeholder="09xxxxxxxxx"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      {formData.paymentMethod === 'card' && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cardholder Name *
                              </label>
                              <input
                                type="text"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                placeholder="Name on card"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card Number *
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
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Expiry Date *
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
                                  CVV *
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

                      {/* QR Code Payment */}
                      {(formData.paymentMethod === 'kpay' || formData.paymentMethod === 'wavepay') && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {formData.paymentMethod === 'kpay' ? 'KBZ Pay' : 'Wave Pay'} Payment
                          </h3>
                          <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center border-2 border-gray-200">
                              <div className="text-center">
                                <QrCode size={120} className="text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">QR Code</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              Scan this QR code with your {formData.paymentMethod === 'kpay' ? 'KBZ Pay' : 'Wave Pay'} app
                            </p>
                            <div className="bg-white rounded-lg p-3 mb-4">
                              <p className="text-xs text-gray-500 mb-1">Payment Details:</p>
                              <p className="font-semibold">Amount: {(formData.customAmount ? parseFloat(formData.customAmount) : formData.amount).toLocaleString()} MMK</p>
                              <p className="text-sm text-gray-600">Reference: DONATION_{Date.now()}</p>
                            </div>
                            <div className="flex gap-2 justify-center">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(generateQRData())}
                                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                              >
                                <Copy size={16} className="mr-2" />
                                Copy Payment Link
                              </button>
                              <button
                                type="button"
                                className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                              >
                                <Download size={16} className="mr-2" />
                                Save QR Code
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Anonymous Option */}
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="anonymous"
                            checked={formData.anonymous}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">Make this donation anonymous</span>
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
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                        currentStep === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <ArrowLeft size={18} className="mr-2" />
                      Previous
                    </button>
                    
                    {currentStep < totalSteps ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                      >
                        Continue
                        <ArrowRight size={18} className="ml-2" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                      >
                        <Heart size={18} className="mr-2" />
                        Complete Donation
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Display */}
            {(() => {
              const currentImpact = getCurrentImpact();
              if (!currentImpact) return null;
              const IconComponent = currentImpact.icon;
              return (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                  <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center">
                    <Heart size={20} className="mr-2 text-red-500" />
                    Your Impact
                  </h3>
                  <div className="flex items-center">
                    <div className="p-3 bg-emerald-500 rounded-xl mr-4">
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-emerald-800 font-medium">{currentImpact.impact}</p>
                      <p className="text-emerald-600 text-sm mt-1">
                        {(formData.customAmount ? parseFloat(formData.customAmount) : formData.amount).toLocaleString()} MMK donation
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Trust Indicators */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Shield size={20} className="mr-2 text-blue-600" />
                Secure & Trusted
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Lock size={14} className="text-green-600 mr-2" />
                  <span className="text-gray-700">SSL encrypted</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle size={14} className="text-blue-600 mr-2" />
                  <span className="text-gray-700">4-star charity rating</span>
                </div>
                <div className="flex items-center text-sm">
                  <Target size={14} className="text-emerald-600 mr-2" />
                  <span className="text-gray-700">98% to programs</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Accepted Payments</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CreditCard size={16} className="text-blue-600 mr-2" />
                  <span className="text-blue-800">Visa, Mastercard, JCB</span>
                </div>
                <div className="flex items-center text-sm">
                  <QrCode size={16} className="text-green-600 mr-2" />
                  <span className="text-blue-800">KBZ Pay</span>
                </div>
                <div className="flex items-center text-sm">
                  <Smartphone size={16} className="text-purple-600 mr-2" />
                  <span className="text-blue-800">Wave Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;