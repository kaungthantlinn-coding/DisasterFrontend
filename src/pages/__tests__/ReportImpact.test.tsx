import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import ReportImpact from '../ReportImpact';
import { ReportsAPI } from '../../apis/reports';
import '@testing-library/jest-dom';

// AuthContext is no longer needed since we're using the auth store

// Mock the ReportsAPI
vi.mock('../../apis/reports');
const mockReportsAPI = ReportsAPI as any;

// Mock the auth API
vi.mock('../../apis/auth', () => ({
  authApi: {
    getCurrentUser: vi.fn().mockResolvedValue(null),
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn(),
  },
}));

// Mock the auth store
let mockAuthStore = {
  user: { id: '1', name: 'Test User', email: 'test@example.com' },
  isAuthenticated: true,
  logout: vi.fn(),
};

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(() => mockAuthStore),
}));

// Mock Google Maps
const mockMap = {
  setCenter: vi.fn(),
  setZoom: vi.fn(),
};

const mockMarker = {
  setPosition: vi.fn(),
  setMap: vi.fn(),
};

const mockGeocoder = {
  geocode: vi.fn(),
};

const mockAutocomplete = {
  addListener: vi.fn(),
  getPlace: vi.fn(),
};

// Mock global google object
(global as any).google = {
  maps: {
    Map: vi.fn(() => mockMap),
    Marker: vi.fn(() => mockMarker),
    Geocoder: vi.fn(() => mockGeocoder),
    places: {
      Autocomplete: vi.fn(() => mockAutocomplete),
      PlacesServiceStatus: {
        OK: 'OK',
      },
    },
    GeocoderStatus: {
      OK: 'OK',
    },
    LatLng: vi.fn((lat: number, lng: number) => ({ lat: () => lat, lng: () => lng })),
  },
};

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

// Mock file reader
const mockFileReader = {
  readAsDataURL: vi.fn(),
  result: 'data:image/jpeg;base64,mock-image-data',
  onload: null as any,
};

(global as any).FileReader = vi.fn(() => mockFileReader);

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode; isAuthenticated?: boolean }> = ({ 
  children, 
  isAuthenticated = true 
}) => {
  // Update the mock auth store based on the isAuthenticated prop
  mockAuthStore.isAuthenticated = isAuthenticated;
  mockAuthStore.user = isAuthenticated ? { id: '1', name: 'Test User', email: 'test@example.com' } : null as any;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ReportImpact Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReportsAPI.submitReport = vi.fn().mockResolvedValue({
      id: 'test-report-id',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      estimatedResponseTime: '24 hours',
    });
  });

  describe('Authentication', () => {
    it('shows form for unauthenticated users', () => {
      render(
        <TestWrapper isAuthenticated={false}>
          <ReportImpact />
        </TestWrapper>
      );

      // The component shows the form even for unauthenticated users
       expect(screen.getByText('Report Disaster Impact')).toBeInTheDocument();
       expect(screen.getByText('Disaster Information')).toBeInTheDocument();
    });

    it('shows the form when user is authenticated', () => {
      render(
        <TestWrapper isAuthenticated={true}>
          <ReportImpact />
        </TestWrapper>
      );

      expect(screen.getByText('Report Disaster Impact')).toBeInTheDocument();
      expect(screen.getByText('Step 1: Disaster Information')).toBeInTheDocument();
    });
  });

  describe('Step 1: Disaster Information', () => {
    beforeEach(() => {
      render(
        <TestWrapper>
          <ReportImpact />
        </TestWrapper>
      );
    });

    it('renders disaster type selection', () => {
      expect(screen.getByText('Disaster Type *')).toBeInTheDocument();
      expect(screen.getByText('Natural Disasters')).toBeInTheDocument();
      expect(screen.getByText('Human-Made Disasters')).toBeInTheDocument();
      expect(screen.getByText('Health Emergencies')).toBeInTheDocument();
    });

    it('shows specific disaster options when Natural is selected', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByText('Natural Disasters'));
      
      expect(screen.getByText('Earthquake')).toBeInTheDocument();
      expect(screen.getByText('Flood')).toBeInTheDocument();
      expect(screen.getByText('Hurricane')).toBeInTheDocument();
      expect(screen.getByText('Wildfire')).toBeInTheDocument();
    });

    it('validates required fields before proceeding to next step', async () => {
      const user = userEvent.setup();
      
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      expect(screen.getByText('Please select a disaster type')).toBeInTheDocument();
    });

    it('proceeds to next step when form is valid', async () => {
      const user = userEvent.setup();
      
      // Fill required fields
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Earthquake'));
      
      const descriptionTextarea = screen.getByPlaceholderText('Provide detailed information about what happened, current situation, and any immediate concerns...');
      await user.type(descriptionTextarea, 'Test earthquake description');
      
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      expect(screen.getByText('Location & Impact Assessment')).toBeInTheDocument();
    });
  });

  describe('Step 2: Location & Impact', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ReportImpact />
        </TestWrapper>
      );
      
      // Navigate to step 2
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Earthquake'));
      
      const descriptionTextarea = screen.getByPlaceholderText('Provide detailed information about what happened, current situation, and any immediate concerns...');
      await user.type(descriptionTextarea, 'Test earthquake description that is long enough to meet the 20 character requirement');
      
      // Select severity
      await user.click(screen.getByText('High'));
      
      // Set date and time
      const dateTimeInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
      await user.type(dateTimeInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
    });

    it('renders location input and map', () => {
      expect(screen.getByText('Location *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter address or location')).toBeInTheDocument();
      expect(screen.getByText('Get current location')).toBeInTheDocument();
    });

    it('handles geolocation success', async () => {
      const user = userEvent.setup();
      
      mockGeolocation.getCurrentPosition.mockImplementationOnce((success: any) => {
        success({
          coords: {
            latitude: 40.7128,
            longitude: -74.0060,
            accuracy: 10,
          },
        });
      });
      
      mockGeocoder.geocode.mockImplementationOnce((_request: any, callback: any) => {
        callback([
          {
            formatted_address: 'New York, NY, USA',
            geometry: {
              location: {
                lat: () => 40.7128,
                lng: () => -74.0060,
              },
            },
          },
        ], 'OK');
      });
      
      await user.click(screen.getByText('Get current location'));
      
      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText('Enter address or location') as HTMLInputElement;
        expect(locationInput.value).toBe('New York, NY, USA');
      });
    });

    it('renders impact type selection', () => {
      expect(screen.getByText('Type of Impact *')).toBeInTheDocument();
      expect(screen.getByText('Property Damage')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure Damage')).toBeInTheDocument();
      expect(screen.getByText('Environmental Impact')).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByText('Next'));
      
      expect(screen.getByText('Please enter a location')).toBeInTheDocument();
      expect(screen.getByText('Please select at least one impact type')).toBeInTheDocument();
    });
  });

  describe('Step 3: Assistance & Contact', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ReportImpact />
        </TestWrapper>
      );
      
      // Navigate to step 3
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Earthquake'));
      
      const descriptionTextarea = screen.getByPlaceholderText('Provide detailed information about what happened, current situation, and any immediate concerns...');
      await user.type(descriptionTextarea, 'Test earthquake description that is long enough to meet the 20 character requirement');
      
      // Select severity
      await user.click(screen.getByText('High'));
      
      // Set date and time
      const dateTimeInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
      await user.type(dateTimeInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
      
      // Fill step 2
      const locationInput = screen.getByPlaceholderText('Enter address or location');
      await user.type(locationInput, 'Test Location');
      await user.click(screen.getByText('Property Damage'));
      await user.click(screen.getByText('Next'));
    });

    it('renders assistance needs selection', () => {
      expect(screen.getByText('Step 3: Assistance & Contact')).toBeInTheDocument();
      expect(screen.getByText('Type of Assistance Needed')).toBeInTheDocument();
      expect(screen.getByText('Emergency Services')).toBeInTheDocument();
      expect(screen.getByText('Medical Aid')).toBeInTheDocument();
      expect(screen.getByText('Food & Water')).toBeInTheDocument();
    });

    it('renders contact information fields', () => {
      expect(screen.getByText('Contact Information *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your phone number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your email address')).toBeInTheDocument();
    });

    it('validates required contact name', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByText('Next'));
      
      expect(screen.getByText('Please enter your name')).toBeInTheDocument();
    });
  });

  describe('Step 4: Review & Submit', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ReportImpact />
        </TestWrapper>
      );
      
      // Navigate through all steps
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Earthquake'));
      
      const descriptionTextarea = screen.getByPlaceholderText('Provide detailed information about what happened, current situation, and any immediate concerns...');
      await user.type(descriptionTextarea, 'Test earthquake description that is long enough to meet the 20 character requirement');
      
      // Select severity
      await user.click(screen.getByText('High'));
      
      // Set date and time
      const dateTimeInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
      await user.type(dateTimeInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
      
      const locationInput = screen.getByPlaceholderText('Enter address or location');
      await user.type(locationInput, 'Test Location');
      await user.click(screen.getByText('Property Damage'));
      await user.click(screen.getByText('Next'));
      
      const nameInput = screen.getByPlaceholderText('Your full name');
      await user.type(nameInput, 'Test User');
      await user.click(screen.getByText('Next'));
    });

    it('displays review information', () => {
      expect(screen.getByText('Step 4: Review & Submit')).toBeInTheDocument();
      expect(screen.getByText('Review Your Report')).toBeInTheDocument();
      expect(screen.getByText('Disaster Type:')).toBeInTheDocument();
      expect(screen.getByText('Natural - Earthquake')).toBeInTheDocument();
    });

    it('submits the report successfully', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByText('Submit Report'));
      
      await waitFor(() => {
        expect(mockReportsAPI.submitReport).toHaveBeenCalledWith(
          expect.objectContaining({
            disasterType: 'Natural',
            disasterDetail: 'Earthquake',
            description: 'Test earthquake description',
            contactName: 'Test User',
          })
        );
      });
    });

    it('handles submission errors', async () => {
      const user = userEvent.setup();
      
      mockReportsAPI.submitReport = vi.fn().mockRejectedValueOnce(new Error('Submission failed'));
      
      await user.click(screen.getByText('Submit Report'));
      
      await waitFor(() => {
        expect(screen.getByText('Submission failed')).toBeInTheDocument();
      });
    });
  });

  describe('Photo Upload', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ReportImpact />
        </TestWrapper>
      );
      
      // Navigate to step 2 where photo upload is available
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Earthquake'));
      
      const descriptionTextarea = screen.getByPlaceholderText('Provide detailed information about what happened, current situation, and any immediate concerns...');
      await user.type(descriptionTextarea, 'Test earthquake description that is long enough to meet the 20 character requirement');
      
      // Select severity
      await user.click(screen.getByText('High'));
      
      // Set date and time
      const dateTimeInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
      await user.type(dateTimeInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
    });

    it('handles photo upload', async () => {
      const user = userEvent.setup();
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText('Upload Photos') as HTMLInputElement;
      
      await act(async () => {
        await user.upload(fileInput, file);
        
        // Simulate FileReader onload
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader } as any);
        }
      });
      
      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument();
      });
    });

    it('validates file size limit', async () => {
      const user = userEvent.setup();
      
      // Create a file larger than 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText('Upload Photos') as HTMLInputElement;
      
      await user.upload(fileInput, largeFile);
      
      await waitFor(() => {
        expect(screen.getByText('File size must be less than 5MB')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('allows navigation between steps', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ReportImpact />
        </TestWrapper>
      );
      
      // Go to step 2
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Earthquake'));
      
      const descriptionTextarea = screen.getByPlaceholderText('Provide detailed information about what happened, current situation, and any immediate concerns...');
      await user.type(descriptionTextarea, 'Test earthquake description that is long enough to meet the 20 character requirement');
      
      // Select severity
      await user.click(screen.getByText('High'));
      
      // Set date and time
      const dateTimeInput = screen.getByLabelText('When did this occur? *');
      await user.type(dateTimeInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
      
      expect(screen.getByText('Location & Impact Assessment')).toBeInTheDocument();
      
      // Go back to step 1
      await user.click(screen.getByText('Previous'));
      
      expect(screen.getByText('Step 1: Disaster Information')).toBeInTheDocument();
    });
  });

  describe('Emergency Toggle', () => {
    it('shows emergency indicator when toggled', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ReportImpact />
        </TestWrapper>
      );
      
      const emergencyToggle = screen.getByRole('checkbox', { name: /this is an emergency/i });
      await user.click(emergencyToggle);
      
      expect(screen.getByText('Emergency Situation Detected')).toBeInTheDocument();
    });
  });
});