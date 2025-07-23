import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ReportDetail from '../ReportDetail';

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

// Mock the components that might cause issues in tests
vi.mock('../../components/Layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../components/Layout/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ReportDetail', () => {
  it('renders report detail page with correct content', () => {
    renderWithRouter(<ReportDetail />);
    
    // Check if the page renders the actual report title that appears in the component
    expect(screen.getByText('Severe Flooding in Downtown Business District')).toBeInTheDocument();
    
    // Check if the location is displayed
    expect(screen.getByText('123 Main St, Downtown Financial District')).toBeInTheDocument();

    // Check if the reported by information is shown
    expect(screen.getByText('John Smith')).toBeInTheDocument();

    // Check if the date is present
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();

    // Check if back to home link is present
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('renders header and footer components', () => {
    renderWithRouter(<ReportDetail />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('displays report status and severity', () => {
    renderWithRouter(<ReportDetail />);
    
    // Check for status and severity indicators
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('shows impact assessment section', () => {
    renderWithRouter(<ReportDetail />);
    
    // Check for impact assessment content
    expect(screen.getByText('Impact Assessment')).toBeInTheDocument();
    expect(screen.getByText('Property Damage')).toBeInTheDocument();
    expect(screen.getByText('Infrastructure Damage')).toBeInTheDocument();
  });

  it('displays assistance needed section', () => {
    renderWithRouter(<ReportDetail />);
    
    // Check for assistance needed content
    expect(screen.getByText('Assistance Needed')).toBeInTheDocument();
    expect(screen.getByText('Emergency Rescue')).toBeInTheDocument();
    expect(screen.getByText('Medical Assistance')).toBeInTheDocument();
  });

  it('shows contact information', () => {
    renderWithRouter(<ReportDetail />);
    
    // Check for contact information
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('john.smith@email.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
  });
});
