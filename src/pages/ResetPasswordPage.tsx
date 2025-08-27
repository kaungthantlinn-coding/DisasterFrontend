import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useResetPassword, useVerifyResetToken } from '../hooks/useResetPassword';
import { 
  generatePasswordResetDebugInfo, 
  logPasswordResetDebugInfo,
  getPasswordResetErrorMessage,
  exportDebugInfoForSupport
} from '../utils/passwordResetDebug';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

// Password confirmation validation state
interface ValidationState {
  newPassword: boolean;
  confirmPassword: boolean;
  passwordsMatch: boolean;
}

// Get validation state for form fields
const getValidationState = (formData: { newPassword: string; confirmPassword: string }, passwordStrength: PasswordStrength): ValidationState => {
  return {
    newPassword: formData.newPassword.length > 0 && passwordStrength.isValid,
    confirmPassword: formData.confirmPassword.length > 0,
    passwordsMatch: formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0
  };
};

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  // Get token from URL and ensure it's properly decoded
  const rawToken = searchParams.get('token') || '';
  const token = rawToken ? (() => {
    try {
      // First decode URI component
      let decoded = decodeURIComponent(rawToken);
      
      // Handle common URL encoding issue: spaces should be + in Base64
      // This happens when + characters get converted to spaces in URL parameters
      const hasSpaces = decoded.includes(' ');
      if (hasSpaces) {
        decoded = decoded.replace(/\s+/g, '+'); // Replace all whitespace with +
        console.log('🔧 Fixed spaces in token (converted to +)');
      }
      
      console.log('🔍 Token extraction:', {
        rawToken: rawToken.substring(0, 20) + '...',
        decodedToken: decoded.substring(0, 20) + '...',
        hadSpaces: hasSpaces,
        needsDecoding: rawToken !== decoded,
        tokenLength: decoded.length
      });
      
      return decoded;
    } catch (error) {
      console.error('❌ Failed to decode token from URL:', error);
      return rawToken; // Use raw token if decoding fails
    }
  })() : '';
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false,
  });

  const resetPasswordMutation = useResetPassword();
  const { data: tokenVerification, isLoading: isVerifyingToken, error: tokenError } = useVerifyResetToken(token);
  
  // Form validation state
  const validationState = getValidationState(formData, passwordStrength);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  // Enhanced debugging and validation
  useEffect(() => {
    if (token || tokenError || tokenVerification) {
      const debugInfo = generatePasswordResetDebugInfo(
        token,
        tokenVerification,
        tokenError
      );
      logPasswordResetDebugInfo(debugInfo);
    }
  }, [token, tokenError, tokenVerification]);

  // Password strength validation
  useEffect(() => {
    const validatePassword = (password: string): PasswordStrength => {
      const feedback: string[] = [];
      let score = 0;

      if (password.length >= 8) {
        score += 1;
      } else {
        feedback.push('At least 8 characters');
      }

      if (/[A-Z]/.test(password)) {
        score += 1;
      } else {
        feedback.push('One uppercase letter');
      }

      if (/[a-z]/.test(password)) {
        score += 1;
      } else {
        feedback.push('One lowercase letter');
      }

      if (/\d/.test(password)) {
        score += 1;
      } else {
        feedback.push('One number');
      }

      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score += 1;
      } else {
        feedback.push('One special character');
      }

      return {
        score,
        feedback,
        isValid: score >= 4,
      };
    };

    setPasswordStrength(validatePassword(formData.newPassword));
  }, [formData.newPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Password reset form submitted');
    setHasAttemptedSubmit(true);
    
    // Validate password strength
    if (!passwordStrength.isValid) {
      console.warn('⚠️ Password does not meet strength requirements');
      toast.error('Please ensure your password meets all the requirements.');
      return;
    }

    // Validate password confirmation
    if (formData.newPassword !== formData.confirmPassword) {
      console.warn('⚠️ Passwords do not match');
      toast.error('Passwords do not match. Please check and try again.');
      return;
    }

    // Final token validation before submission
    if (!token || token.trim().length === 0) {
      console.error('❌ No token available for password reset');
      toast.error('Invalid reset token. Please request a new password reset link.');
      return;
    }

    console.log('✅ All validations passed, submitting password reset');
    resetPasswordMutation.mutate({
      token,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Medium';
    return 'Strong';
  };

  // Show loading state while verifying token
  if (isVerifyingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset token...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (tokenError || (tokenVerification && !tokenVerification.valid)) {
    // Log error details for debugging
    console.error('🔒 Password reset token validation failed:', {
      tokenError,
      tokenVerification,
      token: token ? `${token.substring(0, 20)}...` : 'No token',
      errorType: tokenVerification?.errorType || 'UNKNOWN'
    });

    // Generate enhanced debug info and user-friendly error message
    const debugInfo = generatePasswordResetDebugInfo(token, tokenVerification, tokenError);
    const errorType = tokenVerification?.errorType || 'UNKNOWN';
    const errorMessage = getPasswordResetErrorMessage(debugInfo);
    
    // Function to copy debug info for support
    const copyDebugInfo = async () => {
      try {
        const debugReport = exportDebugInfoForSupport(debugInfo);
        await navigator.clipboard.writeText(debugReport);
        toast.success('Debug information copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy debug info:', error);
        toast.error('Failed to copy debug information');
      }
    };
    
    // Customize icon and color based on error type
    const getErrorIcon = () => {
      switch (errorType) {
        case 'MISSING_TOKEN':
        case 'INVALID_FORMAT':
          return { icon: AlertCircle, color: 'from-orange-500 to-orange-600' };
        case 'EXPIRED_OR_INVALID':
        case 'TOKEN_NOT_FOUND':
          return { icon: AlertCircle, color: 'from-red-500 to-red-600' };
        case 'NETWORK_ERROR':
          return { icon: AlertCircle, color: 'from-yellow-500 to-yellow-600' };
        case 'SERVER_ERROR':
          return { icon: AlertCircle, color: 'from-purple-500 to-purple-600' };
        default:
          return { icon: AlertCircle, color: 'from-red-500 to-red-600' };
      }
    };

    const { icon: ErrorIcon, color } = getErrorIcon();

    // Show retry option for network errors
    const showRetryOption = errorType === 'NETWORK_ERROR';

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${color} rounded-full flex items-center justify-center shadow-lg mb-6`}>
              <ErrorIcon size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {errorType === 'NETWORK_ERROR' ? 'Connection Problem' : 'Invalid Reset Link'}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {errorMessage}
            </p>
            
            {/* Error-specific help text */}
            {errorType === 'INVALID_FORMAT' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Tips:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Make sure you're using the complete link from your email</li>
                  <li>• Check if the link was broken across multiple lines</li>
                  <li>• Try copying and pasting the entire URL</li>
                </ul>
              </div>
            )}
            
            {errorType === 'EXPIRED_OR_INVALID' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-red-800 mb-2">Why did this happen?</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Reset links expire after 1 hour for security</li>
                  <li>• Each link can only be used once</li>
                  <li>• Requesting a new reset cancels previous links</li>
                </ul>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {showRetryOption && (
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
                >
                  Try Again
                </button>
              )}
              <Link
                to="/forgot-password"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Request New Reset Link
              </Link>
            </div>
            
            {/* Debug information for technical users */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
                  <span>Technical Details</span>
                  <span className="text-xs">(for troubleshooting)</span>
                </summary>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-2">
                  <div><strong>Error Type:</strong> {errorType}</div>
                  <div><strong>Token Present:</strong> {token ? 'Yes' : 'No'}</div>
                  <div><strong>Token Length:</strong> {token?.length || 0}</div>
                  <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
                  <button
                    onClick={copyDebugInfo}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Copy size={14} />
                    Copy Debug Info
                  </button>
                </div>
              </details>
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
            <Shield size={32} className="text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h1>
          <p className="text-lg text-gray-600">
            Enter your new password below to secure your account.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/50 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-gray-50 focus:bg-white ${
                    hasAttemptedSubmit && !validationState.newPassword
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : validationState.newPassword
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-600' :
                      passwordStrength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Password must include:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-gray-50 focus:bg-white ${
                    hasAttemptedSubmit && !validationState.passwordsMatch
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : validationState.passwordsMatch
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2">
                  {validationState.passwordsMatch ? (
                    <div className="flex items-center text-green-600 text-sm animate-fadeIn">
                      <CheckCircle size={16} className="mr-2" />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 text-sm animate-fadeIn">
                      <AlertCircle size={16} className="mr-2" />
                      <span>Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Enhanced validation feedback */}
              {hasAttemptedSubmit && formData.confirmPassword && !validationState.passwordsMatch && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700">
                    Please ensure both password fields match exactly.
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Error Messages */}
            {resetPasswordMutation.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <div className="flex items-center mb-2">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  <span className="font-semibold">Password Reset Failed</span>
                </div>
                <p className="text-xs text-red-600 mb-2">
                  {(resetPasswordMutation.error as any)?.response?.data?.message || 
                   'Failed to reset password. Please try again.'}
                </p>
                <div className="text-xs text-red-500">
                  <p>If this problem persists:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Try requesting a new password reset link</li>
                    <li>Check your internet connection</li>
                    <li>Contact support if the issue continues</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Form validation summary */}
            {hasAttemptedSubmit && (!validationState.newPassword || !validationState.passwordsMatch) && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm">
                <div className="flex items-center mb-2">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  <span className="font-semibold">Please Fix the Following:</span>
                </div>
                <ul className="text-xs space-y-1">
                  {!validationState.newPassword && <li>• Password must meet all strength requirements</li>}
                  {!validationState.passwordsMatch && <li>• Both password fields must match</li>}
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                resetPasswordMutation.isPending || 
                !validationState.newPassword || 
                !validationState.passwordsMatch ||
                !formData.newPassword ||
                !formData.confirmPassword
              }
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {resetPasswordMutation.isPending ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </div>
              ) : (
                <div className="flex items-center">
                  <Shield size={20} className="mr-2" />
                  Reset Password
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

export default ResetPasswordPage;
