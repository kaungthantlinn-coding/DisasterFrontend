import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReportImpact from '../pages/ReportImpact';

// Mock child components and hooks
vi.mock('../components/Layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock('../components/Layout/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
  }),
}));
vi.mock('../components/Map/LocationPicker', () => ({
  default: ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number, address: string) => void }) => (
    <div data-testid="location-picker">
      <button 
        onClick={() => onLocationSelect(40.7128, -74.0060, 'New York, NY, USA')}
        data-testid="select-location"
      >
        Select Location
      </button>
    </div>
  ),
}));

vi.mock('../apis/reports', () => ({
  ReportsAPI: {
    submitReport: vi.fn().mockResolvedValue({ id: 'test-report', status: 'submitted' }),
  },
}));

// Mock useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ReportImpact />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ReportImpact Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow a user to fill out the entire form and submit', async () => {
    renderComponent();
    const user = userEvent.setup();

    // Step 1: Disaster Information
    await user.click(screen.getByText('Natural Disasters'));
    await user.click(screen.getByText('Flood'));
    await user.click(screen.getByText('High'));
    
    const description = screen.getByPlaceholderText(/Provide detailed information/);
    await user.type(description, 'This is a detailed description of the flood disaster that meets the minimum length requirement.');
    
    const dateInput = screen.getByLabelText('When did this occur? *');
    await user.type(dateInput, '2024-01-15T10:30');
    
    await user.click(screen.getByText('Next'));

    // Step 2: Location and Impact
    await waitFor(() => {
      expect(screen.getByText('Location & Impact Assessment')).toBeInTheDocument();
    });
    
    await user.click(screen.getByTestId('select-location'));
    await user.click(screen.getByLabelText('Property Damage'));
    
    const affectedPeopleInput = screen.getByLabelText('Number of People Affected *');
    await user.type(affectedPeopleInput, '50');
    
    await user.click(screen.getByText('Next'));

    // Step 3: Assistance & Contact
    await waitFor(() => {
      expect(screen.getByText('Assistance Needed & Contact Information')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Immediate'));
    await user.click(screen.getByLabelText('Medical Assistance'));
    
    const assistanceDescription = screen.getByPlaceholderText(/Please provide specific details/);
    await user.type(assistanceDescription, 'We need immediate medical assistance for injured people.');
    
    // Fill required contact information
    const contactName = screen.getByPlaceholderText('Your name');
    await user.type(contactName, 'John Doe');
    
    const contactPhone = screen.getByPlaceholderText('Your phone number');
    await user.type(contactPhone, '+1234567890');
    
    await user.click(screen.getByText('Next'));

    // Step 4: Review and Submit
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Review & Submit', level: 2 })).toBeInTheDocument();
    });
    
    // Verify form data is displayed correctly
    expect(screen.getByText('Flood')).toBeInTheDocument();
    expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
    expect(screen.getByText('Medical Assistance')).toBeInTheDocument();
    // Check that contact name appears in the review section
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    
    // Verify submit button is present
    expect(screen.getByText('Submit Report')).toBeInTheDocument();
  });
});