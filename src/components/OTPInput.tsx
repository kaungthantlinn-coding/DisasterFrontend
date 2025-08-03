import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { AlertCircle, Mail, RefreshCw } from 'lucide-react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error,
  autoFocus = true,
  placeholder = '',
  className = ''
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize input refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input when component mounts
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Handle completion callback
  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow digits
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    
    const newValue = value.split('');
    newValue[index] = digit;
    
    // Fill array to correct length
    while (newValue.length < length) {
      newValue.push('');
    }
    
    const updatedValue = newValue.join('').slice(0, length);
    onChange(updatedValue);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const newValue = value.split('');
      
      if (newValue[index]) {
        // Clear current input
        newValue[index] = '';
      } else if (index > 0) {
        // Move to previous input and clear it
        newValue[index - 1] = '';
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
      
      while (newValue.length < length) {
        newValue.push('');
      }
      
      onChange(newValue.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    } else if (e.key === 'Delete') {
      e.preventDefault();
      const newValue = value.split('');
      newValue[index] = '';
      
      while (newValue.length < length) {
        newValue.push('');
      }
      
      onChange(newValue.join(''));
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pastedData) {
      onChange(pastedData.padEnd(length, ''));
      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <div className={`otp-input-container ${className}`}>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg
              transition-all duration-200 ease-in-out
              ${focusedIndex === index
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50'
                : error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
              }
              ${disabled 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-900'
              }
              ${value[index] ? 'border-green-400 bg-green-50' : ''}
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            `}
            aria-label={`Verification code digit ${index + 1}`}
          />
        ))}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

interface OTPTimerProps {
  seconds: number;
  isActive: boolean;
  formatTime: () => string;
  onResend?: () => void;
  canResend?: boolean;
  isResending?: boolean;
  email?: string;
}

export const OTPTimer: React.FC<OTPTimerProps> = ({
  seconds,
  isActive,
  formatTime,
  onResend,
  canResend = true,
  isResending = false,
  email
}) => {
  if (isActive && seconds > 0) {
    return (
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Code expires in <span className="font-semibold text-blue-600">{formatTime()}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-600 mb-2">
        Didn't receive the code?
      </p>
      
      {email && (
        <div className="flex items-center justify-center gap-2 mb-3 text-sm text-gray-500">
          <Mail className="w-4 h-4" />
          <span>Check your email: <strong>{email}</strong></span>
        </div>
      )}
      
      <button
        onClick={onResend}
        disabled={!canResend || isResending}
        className={`
          inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
          transition-all duration-200
          ${canResend && !isResending
            ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
            : 'text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
        {isResending ? 'Resending...' : 'Resend code'}
      </button>
      
      {!canResend && (
        <p className="text-xs text-gray-500 mt-1">
          Wait a moment before requesting another code
        </p>
      )}
    </div>
  );
};

export default OTPInput;