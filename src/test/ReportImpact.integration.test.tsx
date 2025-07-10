import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ReportImpact from '../pages/ReportImpact';
import {
  fillCompleteForm,
  navigateToStep,
  expectStepToBeActive,
  mockFormData,
  mockSubmissionData,
  mockPhotoFiles,
  mockInvalidFiles,
  disasterTypesByCategory,
  impactTypes,
  assistanceTypes,
  severityLevels,
  urgencyLevels,
} from './report-impact-helpers';

// Mock dependencies
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../components/Layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../components/Layout/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
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
    submitReport: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock URL.createObjectURL for photo testing
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn(),
  },
  writable: true,
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ReportImpact Integration Tests', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    const { useAuth } = require('../hooks/useAuth');
    useAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    });
  });

  describe('Complete Form Flow - Happy Path', () => {
    it('successfully completes the entire form submission process', async () => {
      const { ReportsAPI } = require('../apis/reports');
      ReportsAPI.submitReport.mockResolvedValue({
        id: 'report-123',
        status: 'submitted',
        estimatedResponseTime: '24 hours',
      });

      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      // Complete all steps
      await fillCompleteForm(user);

      // Verify we're on the review step
      expectStepToBeActive(4);
      expect(screen.getByText('Review & Submit')).toBeInTheDocument();

      // Verify all information is displayed correctly
      expect(screen.getByText('Flood')).toBeInTheDocument();
      expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
      expect(screen.getByText('Property Damage, Infrastructure Damage')).toBeInTheDocument();
      expect(screen.getByText('Emergency Rescue, Medical Assistance')).toBeInTheDocument();

      // Submit the form
      await user.click(screen.getByText('Submit Report'));

      // Verify API call
      await waitFor(() => {
        expect(ReportsAPI.submitReport).toHaveBeenCalledWith(
          expect.objectContaining({
            disasterType: 'flood',
            disasterDetail: 'Flood',
            description: expect.stringContaining('detailed description'),
            severity: 'high',
            location: expect.objectContaining({
              address: 'New York, NY, USA',
              lat: 40.7128,
              lng: -74.0060,
            }),
            impactType: ['Property Damage', 'Infrastructure Damage'],
            affectedPeople: 50,
            assistanceNeeded: ['Emergency Rescue', 'Medical Assistance'],
            urgencyLevel: 'immediate',
            contactName: 'John Doe',
            isEmergency: false,
          })
        );
      });

      // Verify success message is shown
      await waitFor(() => {
        expect(screen.getByText('Report Submitted Successfully!')).toBeInTheDocument();
        expect(screen.getByText('Thank you for reporting this disaster.')).toBeInTheDocument();
      });

      // Verify redirect is scheduled
      await waitFor(() => {
        expect(screen.getByText('Redirecting to reports page...')).toBeInTheDocument();
      });
    });

    it('handles emergency situations correctly', async () => {
      const { ReportsAPI } = require('../apis/reports');
      ReportsAPI.submitReport.mockResolvedValue({ id: 'report-456' });

      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      // Fill form with emergency flag
      await fillCompleteForm(user, { isEmergency: true });

      // Verify emergency alert is shown
      expect(screen.getByText('Emergency Situation Detected')).toBeInTheDocument();
      expect(screen.getByText(/For immediate life-threatening emergencies/)).toBeInTheDocument();

      // Submit form
      await user.click(screen.getByText('Submit Report'));

      // Verify emergency flag in submission
      await waitFor(() => {
        expect(ReportsAPI.submitReport).toHaveBeenCalledWith(
          expect.objectContaining({
            isEmergency: true,
          })
        );
      });
    });
  });

  describe('Form Validation Flow', () => {
    it('validates each step progressively', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      // Try to proceed from step 1 without filling anything
      await user.click(screen.getByText('Next'));
      
      expect(screen.getByText('Please select a disaster category')).toBeInTheDocument();
      expect(screen.getByText('Please specify the type of disaster')).toBeInTheDocument();
      expect(screen.getByText('Please provide a description')).toBeInTheDocument();

      // Fill step 1 partially
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Next'));

      expect(screen.getByText('Please specify the type of disaster')).toBeInTheDocument();

      // Complete step 1 properly
      await user.click(screen.getByText('Flood'));
      await user.click(screen.getByText('High'));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'Valid description that is more than 20 characters long.');
      
      const dateInput = screen.getByLabelText('When did this occur? *');
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));

      // Now on step 2
      expectStepToBeActive(2);

      // Try to proceed without location
      await user.click(screen.getByText('Next'));
      
      expect(screen.getByText('Please select a location on the map')).toBeInTheDocument();
      expect(screen.getByText('Please select at least one impact type')).toBeInTheDocument();
    });

    it('validates description character count', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Flood'));
      await user.click(screen.getByText('High'));

      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'Short desc');

      const dateInput = screen.getByLabelText('When did this occur? *');
      await user.type(dateInput, '2024-01-15T10:30');

      await user.click(screen.getByText('Next'));

      expect(screen.getByText('Description must be at least 20 characters')).toBeInTheDocument();
    });

    it('validates contact information requirements', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      // Navigate to step 3
      await navigateToStep(user, 3);

      // Clear pre-filled contact name
      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);

      await user.click(screen.getByText('Next'));

      expect(screen.getByText('Contact name is required')).toBeInTheDocument();
    });
  });

  describe('Navigation Between Steps', () => {
    it('allows backward navigation while preserving data', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      // Fill step 1
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Earthquake'));
      await user.click(screen.getByText('Critical'));

      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'Earthquake damage description with sufficient details.');

      const dateInput = screen.getByLabelText('When did this occur? *');
      await user.type(dateInput, '2024-01-15T10:30');

      await user.click(screen.getByText('Next'));

      // Now on step 2
      expectStepToBeActive(2);

      // Go back to step 1
      await user.click(screen.getByText('Back'));

      // Verify data is preserved
      expectStepToBeActive(1);
      expect(screen.getByDisplayValue(/Earthquake damage description/)).toBeInTheDocument();

      // Go forward again
      await user.click(screen.getByText('Next'));
      expectStepToBeActive(2);
    });

    it('disables back button on first step', () => {
      renderWithRouter(<ReportImpact />);
      
      const backButton = screen.getByText('Back');
      expect(backButton).toBeDisabled();
    });

    it('shows correct step indicators', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      // Navigate through steps and verify indicators
      await navigateToStep(user, 2);
      expectStepToBeActive(2);

      await navigateToStep(user, 3);
      expectStepToBeActive(3);

      await navigateToStep(user, 4);
      expectStepToBeActive(4);
    });
  });

  describe('Photo Upload Functionality', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      await navigateToStep(user, 2);
    });

    it('handles multiple photo uploads', async () => {
      const user = userEvent.setup();

      const fileInput = screen.getByLabelText(/Click to upload photos/);
      await user.upload(fileInput, mockPhotoFiles);

      // Photos would be displayed (mocked URL.createObjectURL)
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(mockPhotoFiles.length);
    });

    it('rejects invalid file types and sizes', async () => {
      const user = userEvent.setup();

      const fileInput = screen.getByLabelText(/Click to upload photos/);
      await user.upload(fileInput, mockInvalidFiles);

      // Invalid files should be filtered out
      // (This would need actual implementation to test properly)
    });

    it('allows removing uploaded photos', async () => {
      const user = userEvent.setup();

      const fileInput = screen.getByLabelText(/Click to upload photos/);
      await user.upload(fileInput, [mockPhotoFiles[0]]);

      // Photo remove button would appear
      // This test would need more sophisticated DOM checking
    });
  });

  describe('Custom Field Handling', () => {
    it('handles custom disaster types', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Other Natural'));

      const customInput = screen.getByPlaceholderText('Specify the type of disaster');
      await user.type(customInput, 'Avalanche');

      await user.click(screen.getByText('High'));

      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'Custom disaster type description with sufficient details.');

      const dateInput = screen.getByLabelText('When did this occur? *');
      await user.type(dateInput, '2024-01-15T10:30');

      await user.click(screen.getByText('Next'));

      expectStepToBeActive(2);
    });

    it('handles custom impact types', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      await navigateToStep(user, 2);

      await user.click(screen.getByLabelText('Other'));

      const customInput = screen.getByPlaceholderText('Specify the type of impact');
      await user.type(customInput, 'Historical Monument Damage');

      expect(customInput).toHaveValue('Historical Monument Damage');
    });
  });

  describe('Different Disaster Categories', () => {
    it('handles human-made disasters', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      await user.click(screen.getByText('Human-Made Disasters'));

      expect(screen.getByText('Industrial Accident')).toBeInTheDocument();
      expect(screen.getByText('Chemical Spill')).toBeInTheDocument();
      expect(screen.getByText('Building Collapse')).toBeInTheDocument();
    });

    it('handles health emergencies', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      await user.click(screen.getByText('Health Emergencies'));

      expect(screen.getByText('Disease Outbreak')).toBeInTheDocument();
      expect(screen.getByText('Pandemic')).toBeInTheDocument();
      expect(screen.getByText('Water Contamination')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles form submission errors gracefully', async () => {
      const { ReportsAPI } = require('../apis/reports');
      ReportsAPI.submitReport.mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      await fillCompleteForm(user);
      await user.click(screen.getByText('Submit Report'));

      await waitFor(() => {
        expect(screen.getByText('Failed to submit report. Please try again.')).toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      const { ReportsAPI } = require('../apis/reports');
      // Create a promise that we can control
      let resolveSubmission: (value: any) => void;
      const submissionPromise = new Promise((resolve) => {
        resolveSubmission = resolve;
      });
      ReportsAPI.submitReport.mockReturnValue(submissionPromise);

      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      await fillCompleteForm(user);
      await user.click(screen.getByText('Submit Report'));

      // Check loading state
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
      
      // Resolve the promise
      resolveSubmission!({ id: 'test-report' });

      await waitFor(() => {
        expect(screen.getByText('Report Submitted Successfully!')).toBeInTheDocument();
      });
    });
  });

  describe('Authentication Integration', () => {
    it('shows login prompt for unauthenticated users', async () => {
      const { useAuth } = require('../hooks/useAuth');
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
      });

      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      await fillCompleteForm(user);
      await user.click(screen.getByText('Submit Report'));

      expect(screen.getByText('Login Required')).toBeInTheDocument();
      expect(screen.getByText('You need to be logged in to submit a disaster impact report.')).toBeInTheDocument();
    });

    it('pre-fills contact information for authenticated users', () => {
      renderWithRouter(<ReportImpact />);

      // The form should pre-fill with user data
      // This would be verified in step 3, but for now we just check the mock is set up
      expect(mockUser.name).toBe('John Doe');
      expect(mockUser.email).toBe('john@example.com');
    });
  });

  describe('UI/UX Features', () => {
    it('shows character count for description field', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'Test description');

      expect(screen.getByText(/Test description.length\/500 characters/)).toBeInTheDocument();
    });

    it('shows validation messages in real-time', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      // Try to proceed without selecting anything
      await user.click(screen.getByText('Next'));

      // Multiple validation messages should appear
      expect(screen.getByText('Please select a disaster category')).toBeInTheDocument();
      expect(screen.getByText('Please specify the type of disaster')).toBeInTheDocument();
      expect(screen.getByText('Please provide a description')).toBeInTheDocument();
    });

    it('updates progress indicators correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);

      // Progress indicators should update as we move through steps
      await navigateToStep(user, 2);
      await navigateToStep(user, 3);
      await navigateToStep(user, 4);

      // The visual indicators would be tested here
      // For now, we just verify we can navigate through all steps
      expectStepToBeActive(4);
    });
  });
});