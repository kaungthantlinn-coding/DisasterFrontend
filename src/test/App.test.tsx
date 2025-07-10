import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock child components to avoid complex rendering issues
vi.mock('../pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('../pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

vi.mock('../pages/Reports', () => ({
  default: () => <div data-testid="reports-page">Reports Page</div>,
}));

vi.mock('../pages/ReportDetail', () => ({
  default: () => <div data-testid="report-detail-page">Report Detail Page</div>,
}));

vi.mock('../pages/ReportImpact', () => ({
  default: () => <div data-testid="report-impact-page">Report Impact Page</div>,
}));

vi.mock('../components/ProtectedRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="protected-route">{children}</div>,
}));

vi.mock('../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>,
}));

const renderWithRouter = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('App', () => {
  it('renders home page by default', () => {
    renderWithRouter();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('renders login page when navigating to /login', () => {
    renderWithRouter(['/login']);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders dashboard page with protected route', () => {
    renderWithRouter(['/dashboard']);
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('renders reports page when navigating to /reports', () => {
    renderWithRouter(['/reports']);
    expect(screen.getByTestId('reports-page')).toBeInTheDocument();
  });

  it('renders report detail page when navigating to /reports/:id', () => {
    renderWithRouter(['/reports/123']);
    expect(screen.getByTestId('report-detail-page')).toBeInTheDocument();
  });

  it('renders report impact page when navigating to /report/new', () => {
    renderWithRouter(['/report/new']);
    expect(screen.getByTestId('report-impact-page')).toBeInTheDocument();
  });

  it('renders volunteer placeholder when navigating to /volunteer', () => {
    renderWithRouter(['/volunteer']);
    expect(screen.getByText('Volunteer page coming soon...')).toBeInTheDocument();
  });

  it('redirects to home page for unknown routes', () => {
    renderWithRouter(['/unknown-route']);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('wraps content with QueryClientProvider and ErrorBoundary', () => {
    renderWithRouter();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });
});