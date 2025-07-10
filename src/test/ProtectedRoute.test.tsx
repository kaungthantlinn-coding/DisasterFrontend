import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from '../components/ProtectedRoute';

// Mock the authentication hook or service
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock login page for redirection tests
vi.mock('../pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

const MockChildComponent = () => <div data-testid="protected-content">Protected Content</div>;

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    // Mock authenticated state
    const { useAuth } = require('../hooks/useAuth');
    useAuth.mockReturnValue({ isAuthenticated: true, user: { id: '1', name: 'Test User' } });

    renderWithRouter(
      <ProtectedRoute>
        <MockChildComponent />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Mock unauthenticated state
    const { useAuth } = require('../hooks/useAuth');
    useAuth.mockReturnValue({ isAuthenticated: false, user: null });

    renderWithRouter(
      <ProtectedRoute>
        <MockChildComponent />
      </ProtectedRoute>
    );

    // Should not render the protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('shows loading state while authentication is being checked', () => {
    // Mock loading state
    const { useAuth } = require('../hooks/useAuth');
    useAuth.mockReturnValue({ isAuthenticated: undefined, user: null, isLoading: true });

    renderWithRouter(
      <ProtectedRoute>
        <MockChildComponent />
      </ProtectedRoute>
    );

    // Should show loading or not render content yet
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});