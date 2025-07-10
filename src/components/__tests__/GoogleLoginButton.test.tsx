import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GoogleLoginButton from '../GoogleLoginButton';

// Mock Google API
const mockGoogleAccounts = {
  id: {
    initialize: vi.fn(),
    renderButton: vi.fn(),
  },
};

// Mock the global google object
Object.defineProperty(window, 'google', {
  value: {
    accounts: mockGoogleAccounts,
  },
  writable: true,
});

// Mock document.createElement for script injection
const mockScript = {
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
  src: '',
  async: false,
};

const originalCreateElement = document.createElement;
document.createElement = vi.fn().mockImplementation((tagName: string) => {
  if (tagName === 'script') {
    return mockScript;
  }
  return originalCreateElement.call(document, tagName);
});

// Mock appendChild
const mockAppendChild = vi.fn();
document.head.appendChild = mockAppendChild;

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the google signin container', () => {
    render(<GoogleLoginButton />);
    
    const container = screen.getByTestId('google-signin-button') || 
                     document.getElementById('google-signin-button');
    expect(container).toBeTruthy();
  });

  it('renders a container with correct structure', () => {
    const { container } = render(<GoogleLoginButton />);
    
    // Check that the component renders without crashing
    expect(container.firstChild).toBeTruthy();
    
    // Check for the presence of a div element
    const divElement = container.querySelector('div');
    expect(divElement).toBeTruthy();
  });

  it('attempts to load Google API script', () => {
    render(<GoogleLoginButton />);
    
    // Verify that createElement was called to create a script tag
    expect(document.createElement).toHaveBeenCalledWith('script');
    expect(mockAppendChild).toHaveBeenCalled();
  });

  it('initializes Google Sign-In when API loads successfully', () => {
    render(<GoogleLoginButton />);
    
    // Simulate script loading successfully
    if (mockScript.onload) {
      mockScript.onload();
    }
    
    // Check if Google API methods were called
    expect(mockGoogleAccounts.id.initialize).toHaveBeenCalled();
    expect(mockGoogleAccounts.id.renderButton).toHaveBeenCalled();
  });

  it('handles script load error gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<GoogleLoginButton />);
    
    // Simulate script loading error
    if (mockScript.onerror) {
      mockScript.onerror();
    }
    
    // Should handle error gracefully
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load Google API script');
    
    consoleSpy.mockRestore();
  });
});