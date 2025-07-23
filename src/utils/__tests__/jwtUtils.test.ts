/**
 * Tests for JWT utilities
 */

import {
  decodeJwtToken,
  isTokenExpired,
  getTokenExpirationDate,
  getTokenTimeRemaining,
  formatTimeRemaining,
  getUserFromToken,
  isValidTokenStructure,
  shouldRenewToken,
  getTokenAge,
} from '../jwtUtils';

// Mock JWT tokens for testing
const createMockToken = (expirationInSeconds: number, issuedAtInSeconds?: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expirationInSeconds;
  const iat = issuedAtInSeconds || now;
  
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: 'user123',
    email: 'test@example.com',
    roles: ['user'],
    exp,
    iat,
  }));
  const signature = 'mock-signature';
  
  return `${header}.${payload}.${signature}`;
};

describe('JWT Utils', () => {
  describe('decodeJwtToken', () => {
    it('should decode a valid JWT token', () => {
      const token = createMockToken(3600); // 1 hour from now
      const decoded = decodeJwtToken(token);
      
      expect(decoded).toBeTruthy();
      expect(decoded?.sub).toBe('user123');
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.roles).toEqual(['user']);
    });

    it('should return null for invalid token', () => {
      expect(decodeJwtToken('invalid-token')).toBeNull();
      expect(decodeJwtToken('')).toBeNull();
      expect(decodeJwtToken('not.a.jwt')).toBeNull();
    });

    it('should return null for malformed token', () => {
      expect(decodeJwtToken('header.invalid-payload.signature')).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const token = createMockToken(3600); // 1 hour from now
      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const token = createMockToken(-3600); // 1 hour ago
      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for token expiring within buffer', () => {
      const token = createMockToken(15); // 15 seconds from now
      expect(isTokenExpired(token, 30)).toBe(true); // 30 second buffer
    });

    it('should return true for null token', () => {
      expect(isTokenExpired(null)).toBe(true);
      expect(isTokenExpired('')).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid-token')).toBe(true);
    });
  });

  describe('getTokenExpirationDate', () => {
    it('should return correct expiration date', () => {
      const token = createMockToken(3600); // 1 hour from now
      const expirationDate = getTokenExpirationDate(token);
      
      expect(expirationDate).toBeInstanceOf(Date);
      expect(expirationDate!.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return null for invalid token', () => {
      expect(getTokenExpirationDate(null)).toBeNull();
      expect(getTokenExpirationDate('invalid')).toBeNull();
    });
  });

  describe('getTokenTimeRemaining', () => {
    it('should return correct time remaining', () => {
      const token = createMockToken(3600); // 1 hour from now
      const timeRemaining = getTokenTimeRemaining(token);
      
      expect(timeRemaining).toBeGreaterThan(3500); // Should be close to 3600
      expect(timeRemaining).toBeLessThanOrEqual(3600);
    });

    it('should return 0 for expired token', () => {
      const token = createMockToken(-3600); // 1 hour ago
      expect(getTokenTimeRemaining(token)).toBe(0);
    });

    it('should return 0 for invalid token', () => {
      expect(getTokenTimeRemaining(null)).toBe(0);
      expect(getTokenTimeRemaining('invalid')).toBe(0);
    });
  });

  describe('formatTimeRemaining', () => {
    it('should format hours and minutes', () => {
      expect(formatTimeRemaining(3661)).toBe('1h 1m'); // 1 hour 1 minute 1 second
      expect(formatTimeRemaining(3600)).toBe('1h 0m'); // 1 hour
    });

    it('should format minutes and seconds', () => {
      expect(formatTimeRemaining(61)).toBe('1m 1s'); // 1 minute 1 second
      expect(formatTimeRemaining(60)).toBe('1m 0s'); // 1 minute
    });

    it('should format seconds only', () => {
      expect(formatTimeRemaining(30)).toBe('30s');
      expect(formatTimeRemaining(1)).toBe('1s');
    });

    it('should return "Expired" for zero or negative', () => {
      expect(formatTimeRemaining(0)).toBe('Expired');
      expect(formatTimeRemaining(-10)).toBe('Expired');
    });
  });

  describe('getUserFromToken', () => {
    it('should extract user information', () => {
      const token = createMockToken(3600);
      const user = getUserFromToken(token);
      
      expect(user).toEqual({
        userId: 'user123',
        email: 'test@example.com',
        roles: ['user'],
      });
    });

    it('should return null for invalid token', () => {
      expect(getUserFromToken(null)).toBeNull();
      expect(getUserFromToken('invalid')).toBeNull();
    });
  });

  describe('isValidTokenStructure', () => {
    it('should return true for valid token structure', () => {
      const token = createMockToken(3600);
      expect(isValidTokenStructure(token)).toBe(true);
    });

    it('should return false for invalid structure', () => {
      expect(isValidTokenStructure(null)).toBe(false);
      expect(isValidTokenStructure('')).toBe(false);
      expect(isValidTokenStructure('not.a.jwt')).toBe(false);
      expect(isValidTokenStructure('only-one-part')).toBe(false);
    });
  });

  describe('shouldRenewToken', () => {
    it('should return true for token expiring soon', () => {
      const token = createMockToken(200); // 200 seconds (< 5 minutes)
      expect(shouldRenewToken(token)).toBe(true);
    });

    it('should return false for token with plenty of time', () => {
      const token = createMockToken(3600); // 1 hour
      expect(shouldRenewToken(token)).toBe(false);
    });

    it('should return false for expired token', () => {
      const token = createMockToken(-100); // Expired
      expect(shouldRenewToken(token)).toBe(false);
    });

    it('should return false for invalid token', () => {
      expect(shouldRenewToken(null)).toBe(false);
      expect(shouldRenewToken('invalid')).toBe(false);
    });
  });

  describe('getTokenAge', () => {
    it('should return correct token age', () => {
      const issuedAt = Math.floor(Date.now() / 1000) - 1800; // 30 minutes ago
      const token = createMockToken(3600, issuedAt);
      const age = getTokenAge(token);
      
      expect(age).toBeGreaterThan(1700); // Should be close to 1800
      expect(age).toBeLessThanOrEqual(1800);
    });

    it('should return 0 for invalid token', () => {
      expect(getTokenAge(null)).toBe(0);
      expect(getTokenAge('invalid')).toBe(0);
    });
  });
});
