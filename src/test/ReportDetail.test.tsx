import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ReportDetail from '../pages/ReportDetail';

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

// Mock the components that might cause issues in tests
vi.mock('../components/Layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../components/Layout/Footer', () => ({
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
    
    // Check if the page renders the report title
    expect(screen.getByText('Flooding in Downtown Area')).toBeInTheDocument();
    
    // Check if the report description is present
    expect(screen.getByText(/Severe flooding reported on Main Street/)).toBeInTheDocument();
    
    // Check if the location is displayed
    expect(screen.getByText('Downtown Main Street')).toBeInTheDocument();

    // Check if the reported by information is shown
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Check if the disaster type is present
    expect(screen.getByText('flood')).toBeInTheDocument();

    // Check if assistance needed section is present
    expect(screen.getByText('Assistance Needed')).toBeInTheDocument();
  });

  it('renders assistance needed section', () => {
    renderWithRouter(<ReportDetail />);

    // Check if assistance needed section is present
    expect(screen.getByText('Assistance Needed')).toBeInTheDocument();
    expect(screen.getByText('Emergency evacuation assistance')).toBeInTheDocument();
  });

  it('renders actions section', () => {
    renderWithRouter(<ReportDetail />);

    // Check if actions are present
    expect(screen.getByText('Take Action')).toBeInTheDocument();
    expect(screen.getByText('Offer Assistance')).toBeInTheDocument();
    expect(screen.getByText('Contact Reporter')).toBeInTheDocument();
  });
});
