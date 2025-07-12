import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ReportImpact from '../ReportImpact';
import { fillCompleteForm } from '../../test/report-impact-helpers';

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
    
    // The Next button should have disabled styling when form is empty
    const nextButton = screen.getByText('Next');
    expect(nextButton).toHaveClass('bg-gray-300', 'text-gray-600', 'cursor-pointer');
    
    // Fill in some fields but not all required ones
    const user = userEvent.setup();
    await user.click(screen.getByText('Natural Disasters'));
    
    // Button should still have disabled styling as not all required fields are filled
    expect(nextButton).toHaveClass('bg-gray-300', 'text-gray-600', 'cursor-pointer');
    
    // Fill in more fields
    await user.click(screen.getByText('Flood'));
    await user.click(screen.getByText('High'));
    
    // Still has disabled styling without description and date
    expect(nextButton).toHaveClass('bg-gray-300', 'text-gray-600', 'cursor-pointer');
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
      
      await waitFor(() => {
        expect(screen.getByTestId('disasterType-error')).toBeInTheDocument();
      });
      expect(screen.getByTestId('disasterType-error')).toHaveTextContent('Please select a disaster category');
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
      
      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByTestId('disasterType-error')).toBeInTheDocument();
        expect(screen.getByTestId('description-error')).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Verify the exact error messages
      expect(screen.getByTestId('disasterType-error')).toHaveTextContent('Please select a disaster category');
      expect(screen.getByTestId('description-error')).toHaveTextContent('Please provide a description');
      
      // disasterDetail error only appears after selecting a disaster type
      // severity and dateTime errors should also appear
      expect(screen.getByTestId('severity-error')).toBeInTheDocument();
      expect(screen.getByTestId('dateTime-error')).toBeInTheDocument();
    });

    it('validates description length', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Fill all required fields except description to isolate the validation
      await user.click(screen.getByRole('button', { name: /Natural Disasters/i }));
      await user.click(screen.getByRole('button', { name: /Flood/i }));
      await user.click(screen.getByRole('button', { name: /High/i }));
      
      const dateInput = screen.getByLabelText(/When did this occur/);
      await user.type(dateInput, '2024-01-15T10:30');
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.clear(description);
      await user.type(description, 'This is 19 chars!!'); // Exactly 19 characters to trigger validation error
      
      // Verify the description was actually set
      console.log('TEST: Description value after typing:', (description as HTMLInputElement).value);
      console.log('TEST: Description length:', (description as HTMLInputElement).value.length);
      
      // Verify we're still on step 1 before clicking Next
      expect(screen.getByRole('heading', { name: /Disaster Information/i })).toBeInTheDocument();
      
      // Click Next to trigger validation
      console.log('TEST: Looking for Next button...');
      const nextButton = screen.getByText('Next');
      console.log('TEST: Next button disabled?', nextButton.hasAttribute('disabled'));
      
      // Add a longer delay to ensure form state is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await user.click(nextButton);
      console.log('TEST: Next button clicked');
      
      // Wait longer for validation and state updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check what step we're on now
      const currentHeading = screen.queryByRole('heading', { name: /Disaster Information/i });
      const step2Heading = screen.queryByRole('heading', { name: /Location & Impact/i });
      
      console.log('TEST: Disaster Information heading found:', !!currentHeading);
      console.log('TEST: Location & Impact heading found:', !!step2Heading);
      
      // Check if we stayed on step 1 (validation should prevent navigation)
      expect(screen.getByRole('heading', { name: /Disaster Information/i })).toBeInTheDocument();
      
      // Now check for the error message
      const descriptionError = await screen.findByTestId('description-error', {}, { timeout: 5000 });
      expect(descriptionError).toHaveTextContent('Description must be at least 20 characters');
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
      
      // Use helper to fill complete form and navigate to submit button
      await fillCompleteForm(user, screen);
      
      // Now we should be on step 4 with the submit button available
      const submitButton = screen.getByRole('button', { name: 'Submit Report' });
      await user.click(submitButton);
      
      // Check for login prompt modal
      await waitFor(() => {
        expect(screen.getByText('Login Required')).toBeInTheDocument();
      });
      expect(screen.getByText(/You need to be logged in to submit a disaster impact report/)).toBeInTheDocument();
    });
  });

  describe('Photo Upload', () => {
    beforeEach(async () => {
      // Get to step 2 using helper
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Navigate to step 2 properly
      await user.click(screen.getByRole('button', { name: /Natural Disasters/i }));
      await user.click(screen.getByRole('button', { name: /Flood/i }));
      await user.click(screen.getByRole('button', { name: /High/i }));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that is more than 20 characters long.');
      
      const dateInput = screen.getByLabelText(/When did this occur/);
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
      
      // Wait for step 2 to load with increased timeout
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Location & Impact/i })).toBeInTheDocument();
      }, { timeout: 8000 });
    });

    it('handles photo upload', async () => {
      const user = userEvent.setup();
      
      // Mock URL.createObjectURL for photo preview
      global.URL.createObjectURL = vi.fn(() => 'mock-url');
      global.URL.revokeObjectURL = vi.fn();
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/Click to upload photos/);
      
      await user.upload(fileInput, file);
      
      // Wait for file processing to complete with specific timeout
      await waitFor(() => {
        expect((fileInput as HTMLInputElement).files).toHaveLength(1);
      }, { timeout: 5000 });
      
      // Verify the file was uploaded
      expect((fileInput as HTMLInputElement).files?.[0]).toBe(file);
    });

    it('handles large file upload performance', async () => {
      const user = userEvent.setup();
      
      // Mock URL.createObjectURL for photo preview
      global.URL.createObjectURL = vi.fn(() => 'mock-url');
      global.URL.revokeObjectURL = vi.fn();
      
      // Create a large file (5MB mock)
      const largeFileContent = new Array(5 * 1024 * 1024).fill('a').join('');
      const largeFile = new File([largeFileContent], 'large-image.jpg', { type: 'image/jpeg' });
      
      const fileInput = screen.getByLabelText(/Click to upload photos/);
      
      // Measure upload performance
      const startTime = performance.now();
      await user.upload(fileInput, largeFile);
      
      // Wait for file processing with extended timeout for large files
      await waitFor(() => {
        expect((fileInput as HTMLInputElement).files).toHaveLength(1);
      }, { timeout: 10000 });
      
      const endTime = performance.now();
      const uploadTime = endTime - startTime;
      
      // Verify the file was uploaded
      expect((fileInput as HTMLInputElement).files?.[0]).toBe(largeFile);
      
      // Performance assertion - upload should complete within reasonable time
      expect(uploadTime).toBeLessThan(10000); // 10 seconds max
    });

    it('handles multiple file uploads', async () => {
      const user = userEvent.setup();
      
      // Mock URL.createObjectURL for photo preview
      global.URL.createObjectURL = vi.fn(() => 'mock-url');
      global.URL.revokeObjectURL = vi.fn();
      
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
        new File(['test3'], 'test3.jpg', { type: 'image/jpeg' })
      ];
      
      const fileInput = screen.getByLabelText(/Click to upload photos/);
      
      await user.upload(fileInput, files);
      
      // Wait for all files to be processed with specific timeout
      await waitFor(() => {
        expect((fileInput as HTMLInputElement).files).toHaveLength(3);
      }, { timeout: 8000 });
      
      // Verify all files were uploaded
      expect((fileInput as HTMLInputElement).files?.[0]).toBe(files[0]);
      expect((fileInput as HTMLInputElement).files?.[1]).toBe(files[1]);
      expect((fileInput as HTMLInputElement).files?.[2]).toBe(files[2]);
    });
  });

  describe('Emergency Features', () => {
    it('shows emergency alert when emergency toggle is checked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Find the emergency checkbox by its role and nearby text
      const emergencyToggle = screen.getByRole('checkbox', { name: /This is an emergency situation/ });
      await user.click(emergencyToggle);
      
      // Wait for emergency alert to appear with specific timeout
      await waitFor(() => {
        expect(screen.getByText('Emergency Situation Detected')).toBeInTheDocument();
      }, { timeout: 3000 });
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

      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Use helper to fill complete form
      await fillCompleteForm(user, screen);
      
      // Submit with proper async handling
      const submitButton = screen.getByRole('button', { name: 'Submit Report' });
      await user.click(submitButton);
      
      // Wait for submission to complete with specific timeout
      await waitFor(() => {
        expect(reportsModule.ReportsAPI.submitReport).toHaveBeenCalled();
      }, { timeout: 5000 });
    });

    it('handles submission errors', async () => {
      const reportsModule = await import('../../apis/reports');
      vi.mocked(reportsModule.ReportsAPI.submitReport).mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Use helper to fill complete form
      await fillCompleteForm(user, screen);
      
      // Attempt submit with proper async handling
      const submitButton = screen.getByRole('button', { name: 'Submit Report' });
      await user.click(submitButton);
      
      // Wait for error handling to complete with specific timeout
      await waitFor(() => {
        expect(reportsModule.ReportsAPI.submitReport).toHaveBeenCalled();
      }, { timeout: 5000 });
    });
  });
});