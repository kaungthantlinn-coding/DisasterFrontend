import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ReportImpact from '../pages/ReportImpact';

// Mock all external dependencies
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: '1', name: 'John Doe', email: 'john@example.com' },
    isAuthenticated: true,
    isLoading: false,
    logout: vi.fn(),
  })),
}));

vi.mock('../components/Layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../components/Layout/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../components/Map/LocationPicker', () => ({
  default: ({ onLocationSelect }: any) => (
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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ReportImpact - Core Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders the main title and subtitle', () => {
      renderWithRouter(<ReportImpact />);
      
      expect(screen.getByText('Report Disaster Impact')).toBeInTheDocument();
      expect(screen.getByText('Help us coordinate emergency response and assistance')).toBeInTheDocument();
    });

    it('shows the first step (Disaster Information)', () => {
      renderWithRouter(<ReportImpact />);
      
      expect(screen.getByRole('heading', { name: 'Disaster Information', level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Natural Disasters')).toBeInTheDocument();
      expect(screen.getByText('Human-Made Disasters')).toBeInTheDocument();
      expect(screen.getByText('Health Emergencies')).toBeInTheDocument();
    });

    it('renders header and footer', () => {
      renderWithRouter(<ReportImpact />);
      
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Step 1: Disaster Category Selection', () => {
    it('allows selecting natural disasters category', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByText('Natural Disasters'));
      
      // Should show natural disaster types
      expect(screen.getByText('Earthquake')).toBeInTheDocument();
      expect(screen.getByText('Flood')).toBeInTheDocument();
      expect(screen.getByText('Hurricane/Typhoon')).toBeInTheDocument();
    });

    it('allows selecting human-made disasters category', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByText('Human-Made Disasters'));
      
      // Should show human-made disaster types
      expect(screen.getByText('Industrial Accident')).toBeInTheDocument();
      expect(screen.getByText('Chemical Spill')).toBeInTheDocument();
      expect(screen.getByText('Building Collapse')).toBeInTheDocument();
    });

    it('allows selecting health emergencies category', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByText('Health Emergencies'));
      
      // Should show health emergency types
      expect(screen.getByText('Disease Outbreak')).toBeInTheDocument();
      expect(screen.getByText('Pandemic')).toBeInTheDocument();
      expect(screen.getByText('Water Contamination')).toBeInTheDocument();
    });
  });

  describe('Step 1: Form Validation', () => {
    it('prevents proceeding without selecting disaster category', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // The Next button should have disabled styling when no disaster category is selected
      const nextButton = screen.getByText('Next');
      expect(nextButton).toHaveClass('bg-gray-300', 'text-gray-600', 'cursor-pointer');
    });

    it('validates description field is required', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Flood'));
      await user.click(screen.getByText('High'));
      
      // The Next button should have disabled styling when description is missing
      const nextButton = screen.getByText('Next');
      expect(nextButton).toHaveClass('bg-gray-300', 'text-gray-600', 'cursor-pointer');
    });

    it('validates description minimum length', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Flood'));
      await user.click(screen.getByText('High'));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'Short desc');
      
      // The Next button should have disabled styling when description is too short
      const nextButton = screen.getByText('Next');
      expect(nextButton).toHaveClass('bg-gray-300', 'text-gray-600', 'cursor-pointer');
    });
  });

  describe('Emergency Features', () => {
    it('shows emergency toggle and alert', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      const emergencyToggle = screen.getByRole('checkbox');
      expect(emergencyToggle).toBeInTheDocument();
      expect(screen.getByText('This is an emergency situation')).toBeInTheDocument();
      
      await user.click(emergencyToggle);
      
      expect(screen.getByText('Emergency Situation Detected')).toBeInTheDocument();
      expect(screen.getByText(/For immediate life-threatening emergencies/)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('disables back button on first step', () => {
      renderWithRouter(<ReportImpact />);
      
      const backButton = screen.getByText('Back');
      expect(backButton).toBeDisabled();
    });

    it('allows proceeding to step 2 with valid data', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Fill required fields
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Flood'));
      await user.click(screen.getByText('High'));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that meets the minimum length requirement.');
      
      const dateInput = screen.getByLabelText('When did this occur? *');
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
      
      // Should now be on step 2
      expect(screen.getByText('Location & Impact Assessment')).toBeInTheDocument();
    });
  });

  describe('Step 2: Location and Impact', () => {
    beforeEach(async () => {
      // Helper to get to step 2
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Flood'));
      await user.click(screen.getByText('High'));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that meets the minimum length requirement.');
      
      const dateInput = screen.getByLabelText('When did this occur? *');
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
    });

    it('renders location picker component', () => {
      expect(screen.getByTestId('location-picker')).toBeInTheDocument();
    });

    it('allows selecting location', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByTestId('select-location'));
      
      expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
    });

    it('shows impact type checkboxes', () => {
      expect(screen.getByText('Property Damage')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure Damage')).toBeInTheDocument();
      expect(screen.getByText('Environmental Impact')).toBeInTheDocument();
      expect(screen.getByText('Human Casualties')).toBeInTheDocument();
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

    it('has photo upload area', () => {
      expect(screen.getByText('Photos (Optional - Max 10 photos, 10MB each)')).toBeInTheDocument();
    });
  });

  describe('Complete Form Flow', () => {
    it('can navigate through all steps', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ReportImpact />);
      
      // Step 1: Disaster Information
      await user.click(screen.getByText('Natural Disasters'));
      await user.click(screen.getByText('Flood'));
      await user.click(screen.getByText('High'));
      
      const description = screen.getByPlaceholderText(/Provide detailed information/);
      await user.type(description, 'This is a detailed description of the flood disaster that meets the minimum length requirement.');
      
      const dateInput = screen.getByLabelText('When did this occur? *');
      await user.type(dateInput, '2024-01-15T10:30');
      
      await user.click(screen.getByText('Next'));
      
      // Step 2: Location & Impact
      expect(screen.getByText('Location & Impact Assessment')).toBeInTheDocument();
      
      await user.click(screen.getByTestId('select-location'));
      await user.click(screen.getByLabelText('Property Damage'));
      
      const affectedPeopleInput = screen.getByLabelText('Number of People Affected *');
      await user.type(affectedPeopleInput, '50');
      
      await user.click(screen.getByText('Next'));
      
      // Step 3: Assistance & Contact
      expect(screen.getByText('Assistance Needed & Contact Information')).toBeInTheDocument();
      
      await user.click(screen.getByText('Immediate'));
      await user.click(screen.getByLabelText('Emergency Rescue'));
      
      const assistanceDescription = screen.getByPlaceholderText(/Please provide specific details/);
      await user.type(assistanceDescription, 'We need immediate rescue assistance for trapped people.');
      
      // Fill required contact information
      const contactName = screen.getByPlaceholderText('Your name');
      await user.type(contactName, 'John Doe');
      
      const contactPhone = screen.getByPlaceholderText('Your phone number');
      await user.type(contactPhone, '+1234567890');
      
      await user.click(screen.getByText('Next'));
      
      // Step 4: Review & Submit
      expect(screen.getByRole('heading', { name: 'Review & Submit', level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Submit Report')).toBeInTheDocument();
    });
  });
});