import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GoogleLoginButton from '../GoogleLoginButton';

// Mock Google API
let mockScript: any = {};
const mockAppendChild = vi.fn(<T extends Node>(node: T): T => {
  mockScript = node;
  return node;
});
document.head.appendChild = mockAppendChild;

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.google = undefined;
  });

  it('renders the google signin container', () => {
    renderWithClient(<GoogleLoginButton />);
    expect(screen.getByTestId('google-signin-button-container')).toBeInTheDocument();
  });

  it('loads Google script when client ID is available', async () => {
    renderWithClient(<GoogleLoginButton />);
    
    // Verify that the script is appended to document head
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockScript.src).toBe('https://accounts.google.com/gsi/client');
    expect(mockScript.async).toBe(true);
    expect(mockScript.defer).toBe(true);
  });
});