import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getRoleBasedRedirectPath, logRoleBasedRedirection } from '../utils/roleRedirection';
import LoginForm from '../components/LoginForm';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const redirectPath = getRoleBasedRedirectPath(user);
    logRoleBasedRedirection(user, redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full opacity-30"></div>
      </div>

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-6 relative">
            <Lock size={32} className="text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to access disaster management features
          </p>
        </div>

        {/* Main Login Container */}
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/50 relative z-10">
          {/* Google Login */}
          <div className="mb-4">
            <GoogleLoginButton />
          </div>

          {/* Email OTP Login */}
          <div className="mb-6">
            <Link
              to="/email-otp"
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Mail className="w-5 h-5 mr-3 text-blue-600" />
              <span>Login with Email Code</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Or continue with password
              </span>
            </div>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>



        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Create account
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Need help?{' '}
            <Link to="/contact" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;