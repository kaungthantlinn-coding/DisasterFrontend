/**
 * Token Expiration Monitoring Service
 * Monitors JWT token expiration and automatically logs out users when tokens expire
 */

import React from 'react';
import { isTokenExpired, getTokenTimeRemaining, debugToken } from '../utils/jwtUtils';
import { useAuthStore } from '../stores/authStore';
import { showErrorToast } from '../utils/notifications';

export class TokenExpirationService {
  private static instance: TokenExpirationService;
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 30000; // Check every 30 seconds
  private readonly WARNING_THRESHOLD_SECONDS = 300; // 5 minutes
  private warningShown = false;
  private isMonitoring = false;

  private constructor() {}

  public static getInstance(): TokenExpirationService {
    if (!TokenExpirationService.instance) {
      TokenExpirationService.instance = new TokenExpirationService();
    }
    return TokenExpirationService.instance;
  }

  /**
   * Start monitoring token expiration
   */
  public startMonitoring(): void {
    if (this.isMonitoring) {
      console.log('🔒 Token expiration monitoring already active');
      return;
    }

    const authState = useAuthStore.getState();
    console.log('🔒 Starting token expiration monitoring');
    console.log('🔒 Auth state at startup:', {
      isAuthenticated: authState.isAuthenticated,
      hasToken: !!authState.accessToken,
      tokenLength: authState.accessToken?.length || 0
    });

    this.isMonitoring = true;

    // Initial check
    this.checkTokenExpiration();

    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.checkTokenExpiration();
    }, this.CHECK_INTERVAL_MS);

    // Listen for auth state changes
    this.setupAuthStateListener();

    console.log('🔒 Token expiration monitoring successfully started');
  }

  /**
   * Stop monitoring token expiration
   */
  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
    this.warningShown = false;
    console.log('🔒 Token expiration monitoring stopped');
  }

  /**
   * Check if the current token is expired and handle accordingly
   */
  private checkTokenExpiration(): void {
    const authState = useAuthStore.getState();
    const { accessToken, isAuthenticated } = authState;

    // Skip if user is not authenticated
    if (!isAuthenticated || !accessToken) {
      return;
    }

    // Check if token is expired
    const expired = isTokenExpired(accessToken);
    const timeRemaining = getTokenTimeRemaining(accessToken);

    if (expired) {
      console.warn('🔒 Access token has expired - logging out user');
      this.handleTokenExpiration();
      return;
    }

    // Check if token is expiring soon and show warning
    if (timeRemaining <= this.WARNING_THRESHOLD_SECONDS && !this.warningShown) {
      this.showExpirationWarning(timeRemaining);
    }

    // Reset warning flag if token has more time
    if (timeRemaining > this.WARNING_THRESHOLD_SECONDS) {
      this.warningShown = false;
    }
  }

  /**
   * Handle token expiration by logging out the user
   */
  private handleTokenExpiration(): void {
    const authState = useAuthStore.getState();
    
    // Log the expiration event
    console.log('🔒 Token expired - performing automatic logout');
    
    // Clear auth state
    authState.logout();
    
    // Show notification to user
    showErrorToast(
      'Your session has expired. Please log in again.',
      'Session Expired'
    );
    
    // Redirect to login page
    this.redirectToLogin();
    
    // Stop monitoring since user is logged out
    this.stopMonitoring();
  }

  /**
   * Show warning when token is about to expire
   */
  private showExpirationWarning(timeRemaining: number): void {
    this.warningShown = true;
    const minutes = Math.ceil(timeRemaining / 60);
    
    console.warn(`🔒 Token expiring in ${minutes} minutes`);
    
    showErrorToast(
      `Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}. Please save your work.`,
      'Session Expiring Soon'
    );
  }

  /**
   * Redirect to login page
   */
  private redirectToLogin(): void {
    // Store current location for redirect after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/signup') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    // Redirect to login
    window.location.href = '/login';
  }

  /**
   * Setup listener for auth state changes
   */
  private setupAuthStateListener(): void {
    // Subscribe to auth store changes
    useAuthStore.subscribe((state, prevState) => {
      // Start monitoring when user logs in
      if (state.isAuthenticated && !prevState.isAuthenticated) {
        console.log('🔒 User logged in - starting token monitoring');
        this.warningShown = false;
      }
      
      // Stop monitoring when user logs out
      if (!state.isAuthenticated && prevState.isAuthenticated) {
        console.log('🔒 User logged out - stopping token monitoring');
        this.stopMonitoring();
      }
    });
  }

  /**
   * Force check token expiration (for manual testing)
   */
  public forceCheck(): void {
    console.log('🔒 Force checking token expiration');
    this.checkTokenExpiration();
  }

  /**
   * Get monitoring status
   */
  public isActive(): boolean {
    return this.isMonitoring;
  }

  /**
   * Debug current token status
   */
  public debugCurrentToken(): void {
    const { accessToken } = useAuthStore.getState();
    debugToken(accessToken);
  }

  /**
   * Check if current token is expired (public method)
   */
  public isCurrentTokenExpired(): boolean {
    const { accessToken } = useAuthStore.getState();
    return isTokenExpired(accessToken);
  }

  /**
   * Get time remaining for current token
   */
  public getCurrentTokenTimeRemaining(): number {
    const { accessToken } = useAuthStore.getState();
    return getTokenTimeRemaining(accessToken);
  }
}

// Export singleton instance
export const tokenExpirationService = TokenExpirationService.getInstance();

/**
 * React hook for token expiration monitoring
 */
export const useTokenExpirationMonitoring = () => {
  const { isAuthenticated } = useAuthStore();

  // Start monitoring when component mounts and user is authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      tokenExpirationService.startMonitoring();
    }

    // Cleanup on unmount
    return () => {
      // Don't stop monitoring on component unmount - let it run globally
      // tokenExpirationService.stopMonitoring();
    };
  }, [isAuthenticated]);

  return {
    isMonitoring: tokenExpirationService.isActive(),
    forceCheck: () => tokenExpirationService.forceCheck(),
    debugToken: () => tokenExpirationService.debugCurrentToken(),
    isExpired: tokenExpirationService.isCurrentTokenExpired(),
    timeRemaining: tokenExpirationService.getCurrentTokenTimeRemaining(),
  };
};


