/**
 * Password Reset Debugging Utilities
 * 
 * This file contains utilities to help debug password reset issues
 * and provide detailed logging for troubleshooting.
 */

interface TokenValidationResult {
  isValid: boolean;
  reason?: string;
  details?: Record<string, any>;
}

interface DebugInfo {
  timestamp: string;
  url: string;
  userAgent: string;
  token: {
    provided: boolean;
    length: number;
    preview: string;
    structure: TokenValidationResult;
  };
  api: {
    endpoint: string;
    status?: number;
    response?: any;
    error?: any;
  };
}

/**
 * Detects the likely format of a token
 */
const detectTokenFormat = (token: string): string => {
  if (/^[A-Za-z0-9+/]*={0,2}$/.test(token)) {
    return 'Base64';
  }
  if (/^[A-Za-z0-9_-]+$/.test(token)) {
    return 'Base64URL';
  }
  if (/^[A-Za-z0-9._-]+$/.test(token)) {
    return 'JWT-like';
  }
  return 'Unknown';
};

/**
 * Validates the structure of a password reset token
 */
export const validateResetTokenStructure = (token: string): TokenValidationResult => {
  if (!token || token.trim().length === 0) {
    return { 
      isValid: false, 
      reason: 'Token is empty or undefined',
      details: { tokenLength: 0 }
    };
  }
  
  const trimmedToken = token.trim();
  
  if (trimmedToken.length < 20) {
    return { 
      isValid: false, 
      reason: 'Token is too short (likely incomplete)',
      details: { 
        tokenLength: trimmedToken.length,
        expectedMinLength: 20 
      }
    };
  }
  
  if (trimmedToken.length > 1000) {
    return { 
      isValid: false, 
      reason: 'Token is suspiciously long',
      details: { 
        tokenLength: trimmedToken.length,
        expectedMaxLength: 1000 
      }
    };
  }
  
  // Check for common URL encoding issues
  const hasUrlEncoding = /%[0-9A-Fa-f]{2}/.test(trimmedToken);
  if (hasUrlEncoding) {
    try {
      const decoded = decodeURIComponent(trimmedToken);
      if (decoded !== trimmedToken) {
        return {
          isValid: true,
          reason: 'Token appears to be URL encoded but can be decoded',
          details: {
            originalLength: trimmedToken.length,
            decodedLength: decoded.length,
            needsDecoding: true
          }
        };
      }
    } catch (error) {
      return {
        isValid: false,
        reason: 'Token appears to be URL encoded but cannot be decoded',
        details: { decodingError: (error as Error).message }
      };
    }
  }
  
  // Check for valid characters (allowing base64, base64url, and JWT characters)
  const validPattern = /^[A-Za-z0-9+/=_.-]+$/;
  if (!validPattern.test(trimmedToken)) {
    const invalidChars = trimmedToken.split('').filter(char => !validPattern.test(char));
    const hasSpaces = invalidChars.includes(' ');
    
    return {
      isValid: false,
      reason: hasSpaces ? 
        'Token contains spaces (likely URL encoding issue - spaces should be + in Base64)' :
        'Token contains invalid characters',
      details: {
        invalidCharacters: [...new Set(invalidChars)],
        pattern: validPattern.toString(),
        note: 'Valid characters: A-Z, a-z, 0-9, +, /, =, _, ., -',
        hasSpaces: hasSpaces,
        suggestion: hasSpaces ? 'Try replacing spaces with + characters' : 'Check token format'
      }
    };
  }
  
  const tokenFormat = detectTokenFormat(trimmedToken);
  
  return { 
    isValid: true,
    details: {
      tokenLength: trimmedToken.length,
      hasUrlEncoding: hasUrlEncoding,
      detectedFormat: tokenFormat
    }
  };
};

/**
 * Generates comprehensive debug information for password reset issues
 */
export const generatePasswordResetDebugInfo = (
  token: string,
  apiResponse?: any,
  apiError?: any
): DebugInfo => {
  const now = new Date();
  const tokenValidation = validateResetTokenStructure(token);
  
  return {
    timestamp: now.toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    token: {
      provided: !!token,
      length: token?.length || 0,
      preview: token ? `${token.substring(0, 20)}...` : 'No token',
      structure: tokenValidation
    },
    api: {
      endpoint: '/Auth/verify-reset-token',
      status: apiResponse?.status || apiError?.response?.status,
      response: apiResponse,
      error: apiError ? {
        message: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data
      } : undefined
    }
  };
};

/**
 * Logs detailed debug information to console with proper formatting
 */
export const logPasswordResetDebugInfo = (debugInfo: DebugInfo): void => {
  console.group('🔍 Password Reset Debug Information');
  
  console.log('📅 Timestamp:', debugInfo.timestamp);
  console.log('🌐 URL:', debugInfo.url);
  console.log('🖥️ User Agent:', debugInfo.userAgent.substring(0, 100) + '...');
  
  console.group('🎫 Token Information');
  console.log('✅ Token Provided:', debugInfo.token.provided);
  console.log('📏 Token Length:', debugInfo.token.length);
  console.log('👀 Token Preview:', debugInfo.token.preview);
  console.log('🔍 Structure Valid:', debugInfo.token.structure.isValid);
  if (!debugInfo.token.structure.isValid) {
    console.warn('❌ Validation Issue:', debugInfo.token.structure.reason);
    if (debugInfo.token.structure.details) {
      console.log('📋 Details:', debugInfo.token.structure.details);
    }
  }
  console.groupEnd();
  
  console.group('🌐 API Information');
  console.log('🎯 Endpoint:', debugInfo.api.endpoint);
  if (debugInfo.api.status) {
    console.log('📊 Status:', debugInfo.api.status);
  }
  if (debugInfo.api.response) {
    console.log('✅ Response:', debugInfo.api.response);
  }
  if (debugInfo.api.error) {
    console.error('❌ Error:', debugInfo.api.error);
  }
  console.groupEnd();
  
  console.groupEnd();
};

/**
 * Provides user-friendly error messages based on debug information
 */
export const getPasswordResetErrorMessage = (debugInfo: DebugInfo): string => {
  if (!debugInfo.token.provided) {
    return 'No reset token found in the URL. Please check that you\'re using the complete link from your email.';
  }
  
  if (!debugInfo.token.structure.isValid) {
    const reason = debugInfo.token.structure.reason;
    
    if (reason?.includes('too short')) {
      return 'The reset link appears to be incomplete. Make sure you\'re using the full link from your email, and that it wasn\'t broken across multiple lines.';
    }
    
    if (reason?.includes('invalid characters')) {
      return 'The reset link appears to be corrupted. Please try copying and pasting the complete link from your email again.';
    }
    
    if (reason?.includes('URL encoded')) {
      return 'The reset link has encoding issues. Try refreshing the page or requesting a new password reset link.';
    }
    
    return 'The reset link format is invalid. Please request a new password reset link.';
  }
  
  if (debugInfo.api.error) {
    const status = debugInfo.api.error.status;
    
    if (status === 400) {
      return 'This password reset link has expired or has already been used. Please request a new password reset link.';
    }
    
    if (status === 404) {
      return 'This password reset link was not found. It may have expired or been used already. Please request a new password reset link.';
    }
    
    if (status === 500) {
      return 'There was a server error while processing your request. Please try again in a few minutes or request a new password reset link.';
    }
    
    if (status === 0 || !status) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
  }
  
  return 'An unexpected error occurred. Please try requesting a new password reset link.';
};

/**
 * Exports debug information as a formatted string for support tickets
 */
export const exportDebugInfoForSupport = (debugInfo: DebugInfo): string => {
  return `
Password Reset Debug Report
==========================
Generated: ${debugInfo.timestamp}
URL: ${debugInfo.url}
User Agent: ${debugInfo.userAgent}

Token Information:
- Provided: ${debugInfo.token.provided}
- Length: ${debugInfo.token.length}
- Preview: ${debugInfo.token.preview}
- Structure Valid: ${debugInfo.token.structure.isValid}
${!debugInfo.token.structure.isValid ? `- Issue: ${debugInfo.token.structure.reason}` : ''}

API Information:
- Endpoint: ${debugInfo.api.endpoint}
${debugInfo.api.status ? `- Status: ${debugInfo.api.status}` : ''}
${debugInfo.api.error ? `- Error: ${JSON.stringify(debugInfo.api.error, null, 2)}` : ''}
${debugInfo.api.response ? `- Response: ${JSON.stringify(debugInfo.api.response, null, 2)}` : ''}
`.trim();
};