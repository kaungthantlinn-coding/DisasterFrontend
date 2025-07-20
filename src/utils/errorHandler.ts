/**
 * Comprehensive error handling utilities for the disaster management application
 */

// Custom error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Result type for better error handling
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Error tracking service
export class ErrorTracker {
  private static instance: ErrorTracker;
  private isProduction = import.meta.env.PROD;

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Track an error with context information
   */
  track(
    error: Error, 
    context?: {
      userId?: string;
      action?: string;
      component?: string;
      additionalData?: Record<string, unknown>;
    }
  ): void {
    const errorInfo = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context,
    };

    // Log to console in development
    if (!this.isProduction) {
      console.error('Error tracked:', errorInfo);
    }

    // In production, send to error tracking service
    if (this.isProduction) {
      this.sendToErrorService(errorInfo);
    }
  }

  /**
   * Track user actions for analytics
   */
  trackUserAction(
    action: string, 
    data?: Record<string, unknown>
  ): void {
    const actionInfo = {
      action,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...data,
    };

    if (!this.isProduction) {
      console.log('User action tracked:', actionInfo);
    }

    if (this.isProduction) {
      this.sendToAnalyticsService(actionInfo);
    }
  }

  private async sendToErrorService(errorInfo: Record<string, unknown>): Promise<void> {
    try {
      // Replace with your error tracking service (Sentry, LogRocket, etc.)
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      });
    } catch (error) {
      console.error('Failed to send error to tracking service:', error);
    }
  }

  private async sendToAnalyticsService(actionInfo: Record<string, unknown>): Promise<void> {
    try {
      // Replace with your analytics service
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actionInfo),
      });
    } catch (error) {
      console.error('Failed to send analytics data:', error);
    }
  }
}

// Error handler utilities
export const errorHandler = {
  /**
   * Handle API errors and convert them to user-friendly messages
   */
  handleApiError(error: unknown): string {
    if (error instanceof ApiError) {
      switch (error.statusCode) {
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'You are not authorized. Please log in and try again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }

    if (error instanceof NetworkError) {
      return 'Network error. Please check your connection and try again.';
    }

    if (error instanceof ValidationError) {
      return `Validation error: ${error.message}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred.';
  },

  /**
   * Create a safe async function wrapper that handles errors
   */
  withErrorHandling<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    context?: {
      component?: string;
      action?: string;
      fallbackValue?: R;
    }
  ) {
    return async (...args: T): Promise<R | undefined> => {
      try {
        return await fn(...args);
      } catch (error) {
        ErrorTracker.getInstance().track(error as Error, {
          component: context?.component,
          action: context?.action,
        });

        if (context?.fallbackValue !== undefined) {
          return context.fallbackValue;
        }

        throw error;
      }
    };
  },

  /**
   * Retry a function with exponential backoff
   */
  async withRetry<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number;
      baseDelay?: number;
      maxDelay?: number;
      shouldRetry?: (error: Error) => boolean;
    } = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      shouldRetry = (error) => {
        // Retry on network errors and 5xx status codes
        return error instanceof NetworkError || 
               (error instanceof ApiError && error.statusCode >= 500);
      },
    } = options;

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries || !shouldRetry(lastError)) {
          throw lastError;
        }

        const delay = Math.min(
          baseDelay * Math.pow(2, attempt),
          maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  },

  /**
   * Convert axios error to custom error types
   */
  fromAxiosError(error: unknown): Error {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as {
        response?: {
          status: number;
          data?: {
            message?: string;
            code?: string;
            details?: Record<string, unknown>;
          };
        };
        request?: unknown;
        message: string;
      };

      if (axiosError.response) {
        const { status, data } = axiosError.response;
        return new ApiError(
          data?.message || 'API request failed',
          status,
          data?.code,
          data?.details
        );
      }

      if (axiosError.request) {
        return new NetworkError(
          'Network request failed',
          new Error(axiosError.message)
        );
      }
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error('Unknown error occurred');
  },
};

// React hook for error handling
export const useErrorHandler = () => {
  const tracker = ErrorTracker.getInstance();

  const handleError = (error: Error, context?: {
    component?: string;
    action?: string;
  }) => {
    tracker.track(error, context);
  };

  const trackAction = (action: string, data?: Record<string, unknown>) => {
    tracker.trackUserAction(action, data);
  };

  const getErrorMessage = (error: unknown): string => {
    return errorHandler.handleApiError(error);
  };

  return {
    handleError,
    trackAction,
    getErrorMessage,
  };
};

// Global error handlers
export const setupGlobalErrorHandlers = (): void => {
  const tracker = ErrorTracker.getInstance();

  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    // Filter out known Leaflet positioning errors that are handled gracefully
    if (event.message.includes('_leaflet_pos') ||
        event.message.includes('Cannot read properties of undefined (reading \'_leaflet_pos\')')) {
      // These are non-critical Leaflet animation errors that we handle gracefully
      return;
    }

    tracker.track(new Error(event.message), {
      component: 'Global',
      action: 'unhandled_error',
      additionalData: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    tracker.track(error, {
      component: 'Global',
      action: 'unhandled_promise_rejection',
    });
  });

  // Handle React error boundaries
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Check if this is a React error boundary error
    if (args[0]?.includes?.('React will try to recreate this component tree')) {
      tracker.track(new Error('React Error Boundary triggered'), {
        component: 'React',
        action: 'error_boundary',
        additionalData: { args },
      });
    }
    originalConsoleError.apply(console, args);
  };
};

// Initialize error tracking
if (typeof window !== 'undefined') {
  setupGlobalErrorHandlers();
}