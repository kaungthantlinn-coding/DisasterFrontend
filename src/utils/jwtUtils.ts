/**
 * JWT Token Utilities for handling token expiration and validation
 */

export interface JwtPayload {
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at time (Unix timestamp)
  sub: string; // Subject (user ID)
  email?: string;
  roles?: string[];
  [key: string]: any;
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: This is for reading token data only, not for security validation
 */
export const decodeJwtToken = (token: string): JwtPayload | null => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);
    
    return parsedPayload as JwtPayload;
  } catch (error) {
    console.warn('Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 * @param token - The JWT token to check
 * @param bufferSeconds - Additional buffer time in seconds (default: 30 seconds)
 * @returns true if token is expired or invalid, false if still valid
 */
export const isTokenExpired = (token: string | null, bufferSeconds: number = 30): boolean => {
  if (!token) {
    return true;
  }

  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // Get current time in seconds (Unix timestamp)
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Check if token is expired (with buffer)
  return payload.exp <= (currentTime + bufferSeconds);
};

/**
 * Get token expiration time as a Date object
 */
export const getTokenExpirationDate = (token: string | null): Date | null => {
  if (!token) {
    return null;
  }

  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
};

/**
 * Get time remaining until token expires (in seconds)
 * @param token - The JWT token
 * @returns seconds until expiration, or 0 if expired/invalid
 */
export const getTokenTimeRemaining = (token: string | null): number => {
  if (!token) {
    return 0;
  }

  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeRemaining = payload.exp - currentTime;
  
  return Math.max(0, timeRemaining);
};

/**
 * Format time remaining in a human-readable format
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) {
    return 'Expired';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Extract user information from JWT token
 */
export const getUserFromToken = (token: string | null): Partial<{ userId: string; email: string; roles: string[] }> | null => {
  if (!token) {
    return null;
  }

  const payload = decodeJwtToken(token);
  if (!payload) {
    return null;
  }

  return {
    userId: payload.sub,
    email: payload.email,
    roles: payload.roles || [],
  };
};

/**
 * Validate token structure (basic client-side validation)
 */
export const isValidTokenStructure = (token: string | null): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Check if token has 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  // Try to decode the payload
  const payload = decodeJwtToken(token);
  return payload !== null && typeof payload.exp === 'number';
};

/**
 * Check if token needs renewal (within 5 minutes of expiration)
 */
export const shouldRenewToken = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  const timeRemaining = getTokenTimeRemaining(token);
  // Suggest renewal if less than 5 minutes remaining
  return timeRemaining > 0 && timeRemaining < 300;
};

/**
 * Get token age in seconds
 */
export const getTokenAge = (token: string | null): number => {
  if (!token) {
    return 0;
  }

  const payload = decodeJwtToken(token);
  if (!payload || !payload.iat) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime - payload.iat;
};

/**
 * Debug token information (for development only)
 */
export const debugToken = (token: string | null): void => {
  if (!token) {
    console.log('🔒 No token provided');
    return;
  }

  const payload = decodeJwtToken(token);
  if (!payload) {
    console.log('🔒 Invalid token structure');
    return;
  }

  const isExpired = isTokenExpired(token);
  const timeRemaining = getTokenTimeRemaining(token);
  const expirationDate = getTokenExpirationDate(token);

  console.log('🔒 JWT Token Debug Info:');
  console.log('  - Valid Structure:', isValidTokenStructure(token));
  console.log('  - Is Expired:', isExpired);
  console.log('  - Time Remaining:', formatTimeRemaining(timeRemaining));
  console.log('  - Expires At:', expirationDate?.toLocaleString());
  console.log('  - User ID:', payload.sub);
  console.log('  - Email:', payload.email);
  console.log('  - Roles:', payload.roles);
};
