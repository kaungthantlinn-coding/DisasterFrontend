import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ReportImpact from '../ReportImpact';

// Mock dependencies
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../components/Layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../components/Layout/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../../components/Map/LocationPicker', () => ({
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

vi.mock('../../apis/reports', () => ({
  ReportsAPI: {
    submitReport: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn(),
  },
  writable: true,
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ReportImpact Component', () => {
  const mockUser = {
    userId: '1',
    name: 'John Doe',
    email: 'john@example.com',
    roles: ['user'],
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Default to authenticated user
    const useAuthModule = await import('../../hooks/useAuth');
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
    });
  });

  it('should render the first step by default', () => {
    renderWithRouter(<ReportImpact />);
    expect(screen.getByRole('heading', { name: 'Disaster Information', level: 2 })).toBeInTheDocument();
  });

  it('should show disabled next button when form is incomplete', async () => {
    renderWithRouter(<ReportImpact />);
    
    // Wait for component to be fully rendered
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Disaster Information', level: 2 })).toBeInTheDocument();
    });
    
    // The Next button should be disabled when form is empty
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
    
    // Fill in some fields but not all required ones
    const user = userEvent.setup();
    await user.click(screen.getByText('Natural Disasters'));
    
    // Button should still be disabled as not all required fields are filled
    expect(nextButton).toBeDisabled();
    
    // Fill in more fields
    await user.click(screen.getByText('Flood'));
    await user.click(screen.getByText('High'));
    
    // Still disabled without description and date
    expect(nextButton).toBeDisabled();
  });

  it('should allow completing step 1 and moving to step 2', async () => {
    renderWithRouter(<ReportImpact />);
    const user = userEvent.setup();

    await user.click(screen.getByText('Natural Disasters'));
    await user.click(screen.getByText('Flood'));
    await user.click(screen.getByText('High'));
    await user.type(screen.getByPlaceholderText(/Provide detailed information/), 'This is a detailed test description for a flood that meets the minimum length requirement.');
    await user.type(screen.getByLabelText('When did this occur? *'), '2024-01-01T12:00');

    await user.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Location & Impact Assessment', level: 2 })).toBeInTheDocument();
    });
  });

  it('should allow completing the entire form flow', async () => {
    const reportsModule = await import('../../apis/reports');
    vi.mocked(reportsModule.ReportsAPI.submitReport).mockResolvedValue({
      id: 'report-123',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      estimatedResponseTime: "24 hours",
    });

    renderWithRouter(<ReportImpact />);
    const user = userEvent.setup();

    // Step 1
    await user.click(screen.getByText('Natural Disasters'));
    await user.click(screen.getByText('Flood'));
    await user.click(screen.getByText('High'));
    await user.type(screen.getByPlaceholderText(/Provide detailed information/), 'This is a detailed test description for a flood that meets the minimum length requirement.');
    await user.type(screen.getByLabelText('When did this occur? *'), '2024-01-01T12:00');
    await user.click(screen.getByText('Next'));

    // Step 2
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Location & Impact Assessment', level: 2 })).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('select-location'));
    await user.click(screen.getByLabelText('Property Damage'));
    
    const affectedPeopleInput = screen.getByLabelText('Number of People Affected *');
    await user.type(affectedPeopleInput, '25');
    
    await user.click(screen.getByText('Next'));

    // Step 3
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Assistance Needed & Contact Information', level: 2 })).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Immediate'));
    await user.click(screen.getByLabelText('Emergency Rescue'));
    await user.type(screen.getByPlaceholderText(/Please provide specific details/), 'Test assistance description that meets requirements.');
    
    // Fill required contact information
    const contactName = screen.getByPlaceholderText('Your name');
    await user.type(contactName, 'John Doe');
    
    const contactPhone = screen.getByPlaceholderText('Your phone number');
    await user.type(contactPhone, '+1234567890');
    
    await user.click(screen.getByText('Next'));

    // Step 4
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Review & Submit', level: 2 })).toBeInTheDocument();
    });
    await user.click(screen.getByText('Submit Report'));

    await waitFor(() => {
      expect(reportsModule.ReportsAPI.submitReport).toHaveBeenCalled();
      expect(screen.getByText('Report Submitted Successfully!')).toBeInTheDocument();
    });
  });
});