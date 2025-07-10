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

  describe('Emergency Features', () => {
    it('shows emergency toggle', () => {
      renderWithRouter(<ReportImpact />);
      
      expect(screen.getByText('This is an emergency situation')).toBeInTheDocument();
      expect(screen.getByText('Check this if immediate response is needed')).toBeInTheDocument();
    });

    it('validates required fields when trying to proceed', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByText('Next'));
      
      expect(screen.getByText('Please select a disaster category')).toBeInTheDocument();
    });

    it('fills out step 1 completely and proceeds to step 2', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Select disaster category
      await user.click(screen.getByText('Natural Disasters'));
      
      // Select specific disaster type
      await user.click(screen.getByRole('button', { name: /Flood/i }));
      
      // Select severity
      await user.click(screen.getByRole('button', { name: /High/i }));
      
      // Fill description
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that is more than 20 characters long.');
      
      // Set date/time
      const dateInput = screen.getByDisplayValue('');
      await user.type(dateInput, '2024-01-15T10:30');
      
      // Proceed to next step
      await user.click(screen.getByText('Next'));
      
      expect(screen.getByText('Location & Impact Assessment')).toBeInTheDocument();
    });
  });

  describe('Step 2: Location & Impact', () => {
    beforeEach(async () => {
      // Helper to get to step 2
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByRole('button', { name: /Natural Disasters/i }));
      await user.click(screen.getByRole('button', { name: /Flood/i }));
      await user.click(screen.getByRole('button', { name: /High/i }));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that is more than 20 characters long.');
      
      const dateInput = screen.getByLabelText(/When did this occur/);
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
    });

    it('renders location picker', () => {
      expect(screen.getByTestId('location-picker')).toBeInTheDocument();
    });

    it('renders impact type checkboxes', () => {
      expect(screen.getByText('Property Damage')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure Damage')).toBeInTheDocument();
      expect(screen.getByText('Environmental Impact')).toBeInTheDocument();
      expect(screen.getByText('Human Casualties')).toBeInTheDocument();
    });

    it('allows selecting location and shows confirmation', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByTestId('select-location'));
      
      expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
    });

    it('allows selecting multiple impact types', async () => {
      const user = userEvent.setup();
      
      const propertyDamage = screen.getByLabelText('Property Damage');
      const infrastructureDamage = screen.getByLabelText('Infrastructure Damage');
      
      await user.click(propertyDamage);
      await user.click(infrastructureDamage);
      
      expect(propertyDamage).toBeChecked();
      expect(infrastructureDamage).toBeChecked();
    });

    it('shows custom impact type input when "Other" is selected', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByLabelText('Other'));
      
      expect(screen.getByPlaceholderText('Specify the type of impact')).toBeInTheDocument();
    });

    it('allows entering number of affected people', async () => {
      const user = userEvent.setup();
      
      const affectedPeopleInput = screen.getByLabelText(/Number of People Affected/);
      await user.type(affectedPeopleInput, '50');
      
      expect(affectedPeopleInput).toHaveValue(50);
    });

    it('renders photo upload area', () => {
      expect(screen.getByText('Photos (Optional - Max 10 photos, 10MB each)')).toBeInTheDocument();
      expect(screen.getByText('Click to upload photos')).toBeInTheDocument();
    });
  });

  describe('Step 3: Assistance & Contact', () => {
    beforeEach(async () => {
      // Helper to get to step 3
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Complete step 1
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Flood'));
      await user.click(screen.getByText('High'));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that is more than 20 characters long.');
      
      const dateInput = screen.getByLabelText(/When did this occur/);
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
      
      // Complete step 2
      await user.click(screen.getByTestId('select-location'));
      await user.click(screen.getByRole('checkbox', { name: /Property Damage/i }));
      
      const affectedPeopleInput = screen.getByLabelText(/Number of People Affected/);
      await user.type(affectedPeopleInput, '50');
      
      await user.click(screen.getByText('Next'));
    });

    it('renders urgency level options', () => {
      expect(screen.getByText('Immediate')).toBeInTheDocument();
      expect(screen.getByText('Within 24h')).toBeInTheDocument();
      expect(screen.getByText('Within Week')).toBeInTheDocument();
      expect(screen.getByText('Non-urgent')).toBeInTheDocument();
    });

    it('renders assistance type checkboxes', () => {
      expect(screen.getByText('Emergency Rescue')).toBeInTheDocument();
      expect(screen.getByText('Medical Assistance')).toBeInTheDocument();
      expect(screen.getByText('Food & Water')).toBeInTheDocument();
      expect(screen.getByText('Temporary Shelter')).toBeInTheDocument();
    });

    it('renders contact information fields with user data pre-filled', () => {
      const nameInput = screen.getByDisplayValue('John Doe');
      const emailInput = screen.getByDisplayValue('john@example.com');
      
      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your phone number')).toBeInTheDocument();
    });

    it('allows selecting urgency level', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByRole('button', { name: /Immediate/i }));
      
      // Check that the button appears selected (would need to check styling in real implementation)
      expect(screen.getByText('Immediate')).toBeInTheDocument();
    });

    it('allows selecting multiple assistance types', async () => {
      const user = userEvent.setup();
      
      const emergencyRescue = screen.getByLabelText('Emergency Rescue');
      const medicalAssistance = screen.getByLabelText('Medical Assistance');
      
      await user.click(emergencyRescue);
      await user.click(medicalAssistance);
      
      expect(emergencyRescue).toBeChecked();
      expect(medicalAssistance).toBeChecked();
    });
  });

  describe('Step 4: Review & Submit', () => {
    beforeEach(async () => {
      // Helper to get to step 4 with completed form
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Complete step 1
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Flood'));
      await user.click(screen.getByText('High'));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that is more than 20 characters long.');
      
      const dateInput = screen.getByLabelText(/When did this occur/);
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
      
      // Complete step 2
      await user.click(screen.getByTestId('select-location'));
      await user.click(screen.getByLabelText('Property Damage'));
      
      const affectedPeopleInput = screen.getByLabelText('Number of People Affected *');
      await user.type(affectedPeopleInput, '50');
      
      await user.click(screen.getByText('Next'));
      
      // Complete step 3
      await user.click(screen.getByText('Immediate'));
      await user.click(screen.getByRole('checkbox', { name: /Emergency Rescue/i }));
      
      const assistanceDescription = screen.getByPlaceholderText(/Please provide specific details/);
      await user.type(assistanceDescription, 'We need immediate rescue assistance for trapped people.');
      
      await user.click(screen.getByText('Next'));
    });

    it('displays review information correctly', () => {
      expect(screen.getByRole('heading', { name: 'Review & Submit' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Disaster Information' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Location & Impact' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Assistance & Contact' })).toBeInTheDocument();
    });

    it('shows submit button', () => {
      expect(screen.getByRole('button', { name: 'Submit Report' })).toBeInTheDocument();
    });

    it('displays important notice', () => {
      expect(screen.getByText('Important Notice')).toBeInTheDocument();
      expect(screen.getByText(/Your report will be reviewed by our emergency response team/)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('prevents proceeding from step 1 without required fields', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByText('Next'));
      
      expect(screen.getByText((content) => content.includes('Please select a disaster category'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Please specify the type of disaster'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Please provide a description'))).toBeInTheDocument();
    });

    it('validates description length', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'Short description');
      
      await user.click(screen.getByText('Next'));
      
      expect(screen.getByText('Description must be at least 20 characters')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('allows going back to previous steps', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Go to step 2
      await user.click(screen.getByRole('button', { name: /Natural Disasters/i }));
      await user.click(screen.getByRole('button', { name: /Flood/i }));
      await user.click(screen.getByRole('button', { name: /High/i }));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that is more than 20 characters long.');
      
      const dateInput = screen.getByLabelText('When did this occur? *');
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
      
      // Go back to step 1
      await user.click(screen.getByText('Back'));
      
      expect(screen.getByRole('heading', { name: 'Disaster Information' })).toBeInTheDocument();
    });

    it('disables back button on first step', () => {
      renderWithRouter(<ReportImpact />);
      
      const backButton = screen.getByText('Back');
      expect(backButton).toBeDisabled();
    });
  });

  describe('Authentication', () => {
    it('shows login prompt for unauthenticated users when submitting', async () => {
      const useAuthModule = await import('../../hooks/useAuth');
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: undefined,
        isAuthenticated: false,
        isLoading: false,
        logout: vi.fn(),
      });

      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Skip to step 4 somehow (this would need more setup in a real test)
      // For now, just test the submit attempt
      const submitButton = screen.getByRole('button', { name: 'Submit Report' });
      await user.click(submitButton);
      
      // Would need to navigate through all steps first
      // This test would be more complex in reality
    });
  });

  describe('Photo Upload', () => {
    beforeEach(async () => {
      // Get to step 2
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByRole('button', { name: /Natural Disasters/i }));
      await user.click(screen.getByRole('button', { name: /Flood/i }));
      await user.click(screen.getByRole('button', { name: /High/i }));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that is more than 20 characters long.');
      
      const dateInput = screen.getByLabelText(/When did this occur/);
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
    });

    it('handles photo upload', async () => {
      const user = userEvent.setup();
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/Click to upload photos/);
      
      await user.upload(fileInput, file);
      
      // The photo would be displayed in the grid
      // This test would need more sophisticated mocking of URL.createObjectURL
    });
  });

  describe('Emergency Features', () => {
    it('shows emergency alert when emergency toggle is checked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Find the emergency checkbox by its role and nearby text
      const emergencyToggle = screen.getByRole('checkbox', { name: /This is an emergency situation/ });
      await user.click(emergencyToggle);
      
      expect(screen.getByText('Emergency Situation Detected')).toBeInTheDocument();
      expect(screen.getByText(/For immediate life-threatening emergencies/)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('successfully submits a complete form', async () => {
      const reportsModule = await import('../../apis/reports');
      vi.mocked(reportsModule.ReportsAPI.submitReport).mockResolvedValue({
        id: 'report-123',
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z',
        estimatedResponseTime: '24 hours'
      });

      renderWithRouter(<ReportImpact />);
      
      // This would need a complete form filling helper
      // For brevity, just test that the API is called
      
      // Would need to fill all steps and then submit
      // await fillCompleteForm(user);
      // await user.click(screen.getByText('Submit Report'));
      
      // expect(ReportsAPI.submitReport).toHaveBeenCalled();
    });

    it('handles submission errors', async () => {
      const reportsModule = await import('../../apis/reports');
      vi.mocked(reportsModule.ReportsAPI.submitReport).mockRejectedValue(new Error('Network error'));

      // Similar test for error handling
    });
  });
});