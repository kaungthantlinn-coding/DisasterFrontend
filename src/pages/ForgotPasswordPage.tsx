import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useForgotPassword } from '../hooks/useForgotPassword';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    forgotPasswordMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      }
    );
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full opacity-30"></div>
        </div>

        {/* Back to Login Link */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => window.location.href = '/login'}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group cursor-pointer"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Login</span>
          </button>
        </div>

        <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg mb-6 relative">
              <CheckCircle size={32} className="text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-lg text-gray-600">
              We've sent password reset instructions to
            </p>
            <p className="text-lg font-semibold text-blue-600 mt-1">
              {email}
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/50 relative z-10">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                What's Next?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 font-semibold text-xs">1</span>
                  </div>
                  <p>Check your email inbox (and spam folder)</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 font-semibold text-xs">2</span>
                  </div>
                  <p>Click the password reset link in the email</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 font-semibold text-xs">3</span>
                  </div>
                  <p>Create a new secure password</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full opacity-30"></div>
      </div>

      {/* Back to Login Link */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => window.location.href = '/login'}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Login</span>
        </button>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-6 relative">
            <Mail size={32} className="text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-lg text-gray-600">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/50 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Error Message */}
            {forgotPasswordMutation.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>
                  {(forgotPasswordMutation.error as any)?.response?.data?.message || 
                   'Failed to send reset email. Please try again.'}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending || !email.trim() || !isValidEmail(email)}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {forgotPasswordMutation.isPending ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send size={20} className="mr-2" />
                  Send Reset Instructions
                </div>
              )}
            </button>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
