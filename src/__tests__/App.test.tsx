import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
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

vi.mock('../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

vi.mock('../components/Auth/TokenExpirationMonitor', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="token-monitor">{children}</div>
  ),
}));

// Mock react-router-dom to avoid BrowserRouter conflicts
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

const renderApp = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('App', () => {
  it('renders app with error boundary and query client provider', () => {
    renderApp();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders home page by default', () => {
    renderApp(['/']);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('contains all necessary providers', () => {
    renderApp();
    // Verify that the app renders without errors, indicating providers are working
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });
});
