import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GoogleLoginButton from '../GoogleLoginButton';

// Mock the useGoogleLogin hook
vi.mock('../../hooks/useGoogleLogin', () => ({
  useGoogleLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  }),
  useGoogleClientId: () => ({
    data: 'test-client-id',
    isLoading: false,
    error: null,
  }),
}));

// Mock Google API
Object.defineProperty(window, 'google', {
  value: {
    accounts: {
      id: {
        initialize: vi.fn(),
        renderButton: vi.fn(),
      },
    },
  },
  writable: true,
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderWithQueryClient(<GoogleLoginButton />);
    expect(screen.getByText('Loading Google Sign-In...')).toBeInTheDocument();
  });

  it('loads Google API script', async () => {
    renderWithQueryClient(<GoogleLoginButton />);
    
    await waitFor(() => {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      expect(script).toBeInTheDocument();
    });
  });

  it('initializes Google Sign-In when script loads', async () => {
    renderWithQueryClient(<GoogleLoginButton />);
    
    // Simulate script load
    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script) {
      script.dispatchEvent(new Event('load'));
    }

    await waitFor(() => {
      expect(window.google.accounts.id.initialize).toHaveBeenCalledWith({
        client_id: 'test-client-id',
        callback: expect.any(Function),
      });
    });
  });

  it('renders Google Sign-In button after initialization', async () => {
    renderWithQueryClient(<GoogleLoginButton />);
    
    // Simulate script load and initialization
    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script) {
      script.dispatchEvent(new Event('load'));
    }

    await waitFor(() => {
      expect(window.google.accounts.id.renderButton).toHaveBeenCalled();
    });
  });

  it('handles script load error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithQueryClient(<GoogleLoginButton />);
    
    // Simulate script error
    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script) {
      script.dispatchEvent(new Event('error'));
    }

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load Google API script');
    });
    
    consoleSpy.mockRestore();
  });
});