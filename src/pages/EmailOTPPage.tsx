import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { OTPInput, OTPTimer } from '../components/OTPInput';
import { useSendEmailOTP, useVerifyEmailOTP, useOTPTimer, useOTPResend } from '../hooks/useEmailOTP';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

type EmailOTPStep = 'email' | 'verify';

const EmailOTPPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Get email from URL params or location state
  const initialEmail = searchParams.get('email') || (location.state as any)?.email || '';
  const initialStep = initialEmail ? 'verify' : 'email';
  
  const [currentStep, setCurrentStep] = useState<EmailOTPStep>(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOTP] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [otpError, setOtpError] = useState<string>('');
  
  // Refs for preventing multiple submissions
  const isVerifyingRef = useRef(false);
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hooks
  const sendOTPMutation = useSendEmailOTP();
  const verifyOTPMutation = useVerifyEmailOTP();
  const { seconds, isActive, startTimer, resetTimer, formatTime, isExpired } = useOTPTimer(300); // 5 minutes
  const { resendOTP, canResend, isResending } = useOTPResend();

  // Common styles
  const buttonBaseStyles = "w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200";
  const linkStyles = "font-medium text-blue-600 hover:text-blue-500 transition-colors";
  const stepCircleBase = "flex items-center justify-center w-8 h-8 rounded-full";
  const containerStyles = "bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100";

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email.trim()));
  }, [email]);

  // Auto-start timer if we're on verify step and have email
  useEffect(() => {
    if (currentStep === 'verify' && email && !isActive) {
      startTimer();
    }
  }, [currentStep, email, isActive, startTimer]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailValid) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await sendOTPMutation.mutateAsync({ 
        email: email.trim(), 
        purpose: 'login' 
      });
      
      setCurrentStep('verify');
      startTimer();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to send OTP:', error);
    }
  };

  // Clear any existing timeout when component unmounts
  useEffect(() => {
    return () => {
      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
      }
      // Reset verifying flag on unmount
      isVerifyingRef.current = false;
    };
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log('🔍 DEBUG: State changed:', {
      otpError,
      otpLength: otp.length,
      isVerifying: isVerifyingRef.current,
      mutationPending: verifyOTPMutation.isPending
    });
  }, [otpError, otp, verifyOTPMutation.isPending]);

  const handleOTPComplete = (otpValue: string) => {
    setOTP(otpValue);
  };

  const handleOTPVerify = async (otpValue?: string) => {
    // Prevent multiple simultaneous attempts using ref
    if (isVerifyingRef.current || verifyOTPMutation.isPending) {
      console.log('⏳ DEBUG: Already verifying, skipping...', {
        refBlocked: isVerifyingRef.current,
        mutationPending: verifyOTPMutation.isPending
      });
      return;
    }

    // Clear any pending auto-submit timeout
    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
      autoSubmitTimeoutRef.current = null;
    }

    const codeToVerify = otpValue || otp;
    
    console.log('🔍 DEBUG: handleOTPVerify called with:', {
      otpValue,
      currentOTP: otp,
      codeToVerify,
      email: email.trim(),
      codeLength: codeToVerify?.length,
      isValidDigits: /^\d+$/.test(codeToVerify),
      trimmedCode: codeToVerify.trim()
    });
    
    // Enhanced validation
    const cleanCode = codeToVerify.trim();
    if (!cleanCode || cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      const errorMsg = 'Please enter a valid 6-digit code';
      console.error('❌ DEBUG: OTP validation failed:', {
        original: codeToVerify,
        cleaned: cleanCode,
        length: cleanCode?.length,
        isDigitsOnly: /^\d+$/.test(cleanCode),
        reason: 'Invalid format - must be 6 digits'
      });
      
      setOtpError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Set verifying flag
    isVerifyingRef.current = true;
    setOtpError(''); // Clear previous errors
    
    console.log('✅ DEBUG: OTP validation passed, calling API with clean code:', cleanCode);
    
    try {
      const result = await verifyOTPMutation.mutateAsync({
        email: email.trim(),
        otp: cleanCode, // Use cleaned code
        purpose: 'login'
      });
      console.log('✅ DEBUG: Verify OTP successful:', result);
      // Navigation is handled by the mutation hook
    } catch (error: any) {
      console.error('❌ DEBUG: Failed to verify OTP in component:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Set persistent error message that stays visible
      let errorMessage = 'Verification failed. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Invalid or expired verification code. Please request a new code.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many attempts. Please wait before trying again.';
      }
      
      console.log('🔴 DEBUG: Setting persistent error:', errorMessage);
      
      // Set error state first
      setOtpError(errorMessage);
      
      // Show toast notification
      toast.error(errorMessage);
      
      // Clear OTP to force user to re-enter
      setOTP('');
    } finally {
      // Always reset the verifying flag
      isVerifyingRef.current = false;
    }
  };

  const handleResendCode = async () => {
    try {
      await resendOTP(email.trim(), 'login');
      setOTP(''); // Clear current OTP
      setOtpError(''); // Clear any errors
      resetTimer();
      startTimer();
      
      // Clear any pending auto-submit
      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
        autoSubmitTimeoutRef.current = null;
      }
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setOTP('');
    setOtpError(''); // Clear any errors
    resetTimer();
    
    // Clear any pending auto-submit
    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
      autoSubmitTimeoutRef.current = null;
    }
    
    // Reset verifying flag
    isVerifyingRef.current = false;
  };

  // Step configuration
  const stepConfig = {
    email: {
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      title: 'Login with Email',
      description: 'Enter your email address to receive a verification code'
    },
    verify: {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: 'Enter Verification Code',
      description: `We've sent a 6-digit code to ${email}`
    }
  };

  const currentStepConfig = stepConfig[currentStep];

  // Reusable components
  const LoadingButton = ({ 
    isLoading, 
    disabled, 
    onClick, 
    children, 
    loadingText, 
    variant = 'primary' 
  }: {
    isLoading: boolean;
    disabled: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    loadingText: string;
    variant?: 'primary' | 'success';
  }) => {
    const variantStyles = variant === 'success' 
      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    
    return (
      <button
        type={onClick ? 'button' : 'submit'}
        onClick={onClick}
        disabled={disabled}
        className={`${buttonBaseStyles} ${
          !disabled && !isLoading
            ? `${variantStyles} focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02]`
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    );
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-4">
        <div className={`${stepCircleBase} ${
          currentStep === 'email' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
        }`}>
          <span className="text-sm font-semibold">1</span>
        </div>
        <div className={`w-8 h-px ${
          currentStep === 'verify' ? 'bg-green-600' : 'bg-gray-300'
        }`} />
        <div className={`${stepCircleBase} ${
          currentStep === 'verify' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
        }`}>
          <span className="text-sm font-semibold">2</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Header />
      
      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <StepIndicator />

          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {currentStepConfig.icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {currentStepConfig.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {currentStepConfig.description}
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className={containerStyles}>
            
            {/* Step 1: Email Input */}
            {currentStep === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={sendOTPMutation.isPending}
                      className={`
                        appearance-none block w-full px-3 py-2 pl-10 border rounded-lg shadow-sm 
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                        ${isEmailValid || !email ? 'border-gray-300' : 'border-red-300 bg-red-50'}
                        sm:text-sm
                      `}
                      placeholder="Enter your email address"
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  
                  {email && !isEmailValid && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <div>
                  <LoadingButton
                    isLoading={sendOTPMutation.isPending}
                    disabled={!isEmailValid || sendOTPMutation.isPending}
                    loadingText="Sending code..."
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send verification code
                  </LoadingButton>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className={linkStyles}>
                      Sign in with password
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 'verify' && (
              <div className="space-y-6">
                {/* Back Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleBackToEmail}
                    disabled={verifyOTPMutation.isPending}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change email address
                  </button>
                </div>

                {/* OTP Input */}
                <div className="space-y-4">
                  <OTPInput
                    length={6}
                    value={otp}
                    onChange={(value) => {
                      console.log('🔍 DEBUG: OTP Input changed:', { value, length: value.length });
                      setOTP(value);
                      
                      // Only clear error if user is actively fixing it (typing different digits)
                      if (value.length < 6) {
                        setOtpError(''); // Clear error when user starts modifying
                      }
                      
                      // Cancel any pending auto-submit
                      if (autoSubmitTimeoutRef.current) {
                        clearTimeout(autoSubmitTimeoutRef.current);
                        autoSubmitTimeoutRef.current = null;
                      }
                    }}
                    onComplete={handleOTPComplete}
                    disabled={verifyOTPMutation.isPending || isVerifyingRef.current}
                    error={otpError || verifyOTPMutation.error?.message}
                    autoFocus={true}
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {otpError && (
                      <button
                        onClick={() => {
                          console.log('🔍 DEBUG: Clear error button clicked');
                          setOtpError('');
                          setOTP('');
                        }}
                        className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Clear & Try Again
                      </button>
                    )}
                    
                    <LoadingButton
                      onClick={() => {
                        console.log('🔍 DEBUG: Manual verify button clicked');
                        setOtpError(''); // Clear error when user explicitly tries again
                        handleOTPVerify();
                      }}
                      isLoading={verifyOTPMutation.isPending || isVerifyingRef.current}
                      disabled={
                        otp.length !== 6 || 
                        verifyOTPMutation.isPending || 
                        isVerifyingRef.current
                      }
                      loadingText="Verifying..."
                      variant="success"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify & Login
                    </LoadingButton>
                  </div>

                  {/* Error Message Display */}
                  {otpError && (
                    <div className="flex items-center gap-2 mt-3 p-4 bg-red-50 border-2 border-red-300 rounded-lg shadow-sm">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">{otpError}</p>
                        <p className="text-xs text-red-600 mt-1">
                          Clear the code and try again, or request a new verification code.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Debug Info - Remove in production */}
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                    <strong>Debug:</strong> Error state: {otpError || 'none'} | 
                    OTP: {otp || 'empty'} | 
                    Verifying: {isVerifyingRef.current ? 'yes' : 'no'}
                  </div>
                </div>

                {/* Timer and Resend */}
                <OTPTimer
                  seconds={seconds}
                  isActive={isActive}
                  formatTime={formatTime}
                  onResend={handleResendCode}
                  canResend={canResend && isExpired}
                  isResending={isResending}
                  email={email}
                />

                {/* Help Text */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    Check your spam folder if you don't see the email
                  </p>
                  <p className="text-xs text-gray-500">
                    The verification code will create an account if you're a new user
                  </p>
                </div>
              </div>
            )}

            {/* Alternative Login Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmailOTPPage;