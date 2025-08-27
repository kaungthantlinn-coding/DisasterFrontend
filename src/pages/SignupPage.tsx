import React from 'react';
import { Navigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getRoleBasedRedirectPath } from '../utils/roleRedirection';
import SignupForm from '../components/SignupForm';
import GoogleLoginButton from '../components/GoogleLoginButton';

const SignupPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const redirectPath = getRoleBasedRedirectPath(user);
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-6 relative">
            <Shield size={32} className="text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join DisasterWatch
          </h1>
          <p className="text-lg text-gray-600">
            Create your account to access disaster management features
          </p>
        </div>

        {/* Enhanced Main Form Container */}
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/50 relative z-10">
          {/* Google Sign Up */}
          <div className="mb-6">
            <GoogleLoginButton />
          </div>

          {/* Enhanced Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Or create account with email
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <SignupForm />
        </div>


      </div>
    </div>
  );
};

export default SignupPage;
