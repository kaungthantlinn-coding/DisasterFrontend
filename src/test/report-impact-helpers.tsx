import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

export interface FormData {
  disasterCategory: 'natural' | 'humanMade' | 'health';
  disasterType: string;
  customDisasterType?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  dateTime: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  impactTypes: string[];
  customImpactType?: string;
  affectedPeople: number;
  estimatedDamage?: string;
  urgencyLevel: 'immediate' | 'within_24h' | 'within_week' | 'non_urgent';
  assistanceTypes: string[];
  assistanceDescription: string;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  isEmergency?: boolean;
}

export const mockFormData: FormData = {
  disasterCategory: 'natural',
  disasterType: 'Flood',
  severity: 'high',
  description: 'This is a detailed description of the flood disaster that is more than 20 characters long and provides sufficient information.',
  dateTime: '2024-01-15T10:30',
  location: {
    address: 'New York, NY, USA',
    lat: 40.7128,
    lng: -74.0060,
  },
  impactTypes: ['Property Damage', 'Infrastructure Damage'],
  affectedPeople: 50,
  estimatedDamage: 'moderate',
  urgencyLevel: 'immediate',
  assistanceTypes: ['Emergency Rescue', 'Medical Assistance'],
  assistanceDescription: 'We need immediate rescue assistance for trapped people in the flooded area.',
  contactName: 'John Doe',
  contactPhone: '+1234567890',
  contactEmail: 'john@example.com',
  isEmergency: false,
};

export const fillStep1 = async (user: any, data: Partial<FormData> = {}) => {
  const formData = { ...mockFormData, ...data };
  
  // Select disaster category
  if (formData.disasterCategory === 'natural') {
    await user.click(screen.getByText('Natural Disasters'));
  } else if (formData.disasterCategory === 'humanMade') {
    await user.click(screen.getByText('Human-Made Disasters'));
  } else if (formData.disasterCategory === 'health') {
    await user.click(screen.getByText('Health Emergencies'));
  }
  
  // Select specific disaster type
  await user.click(screen.getByText(formData.disasterType));
  
  // Handle custom disaster type if needed
  if (formData.disasterType.includes('Other') && formData.customDisasterType) {
    const customInput = screen.getByPlaceholderText('Specify the type of disaster');
    await user.type(customInput, formData.customDisasterType);
  }
  
  // Select severity
  const severityText = formData.severity.charAt(0).toUpperCase() + formData.severity.slice(1);
  await user.click(screen.getByText(severityText));
  
  // Fill description
  const descriptionField = screen.getByPlaceholderText(/Provide detailed information/);
  await user.clear(descriptionField);
  await user.type(descriptionField, formData.description);
  
  // Set date/time
  const dateInput = screen.getByLabelText('When did this occur? *');
  await user.type(dateInput, formData.dateTime);
  
  // Toggle emergency if needed
  if (formData.isEmergency) {
    const emergencyToggle = screen.getByLabelText('This is an emergency situation');
    await user.click(emergencyToggle);
  }
};

export const fillStep2 = async (user: any, data: Partial<FormData> = {}) => {
  const formData = { ...mockFormData, ...data };
  
  // Select location (using mock location picker)
  await user.click(screen.getByTestId('select-location'));
  
  // Select impact types
  for (const impactType of formData.impactTypes) {
    await user.click(screen.getByLabelText(impactType));
  }
  
  // Handle custom impact type if needed
  if (formData.impactTypes.includes('Other') && formData.customImpactType) {
    const customInput = screen.getByPlaceholderText('Specify the type of impact');
    await user.type(customInput, formData.customImpactType);
  }
  
  // Fill affected people
  const affectedPeopleInput = screen.getByLabelText('Number of People Affected *');
  await user.clear(affectedPeopleInput);
  await user.type(affectedPeopleInput, formData.affectedPeople.toString());
  
  // Select estimated damage if provided
  if (formData.estimatedDamage) {
    const damageSelect = screen.getByDisplayValue('Select range');
    await user.selectOptions(damageSelect, formData.estimatedDamage);
  }
};

export const fillStep3 = async (user: any, data: Partial<FormData> = {}) => {
  const formData = { ...mockFormData, ...data };
  
  // Select urgency level
  const urgencyText = formData.urgencyLevel.replace('_', ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  await user.click(screen.getByText(urgencyText));
  
  // Select assistance types
  for (const assistanceType of formData.assistanceTypes) {
    await user.click(screen.getByLabelText(assistanceType));
  }
  
  // Fill assistance description
  const assistanceDescField = screen.getByPlaceholderText(/Please provide specific details/);
  await user.clear(assistanceDescField);
  await user.type(assistanceDescField, formData.assistanceDescription);
  
  // Fill contact information (if different from pre-filled)
  const nameInput = screen.getByPlaceholderText('Your name');
  if (nameInput.getAttribute('value') !== formData.contactName) {
    await user.clear(nameInput);
    await user.type(nameInput, formData.contactName);
  }
  
  if (formData.contactPhone) {
    const phoneInput = screen.getByPlaceholderText('Your phone number');
    await user.type(phoneInput, formData.contactPhone);
  }
  
  if (formData.contactEmail) {
    const emailInput = screen.getByPlaceholderText('Your email address');
    if (!emailInput.getAttribute('value')) {
      await user.type(emailInput, formData.contactEmail);
    }
  }
};

export const fillCompleteForm = async (user: any, data: Partial<FormData> = {}) => {
  // Step 1: Disaster Information
  await fillStep1(user, data);
  await user.click(screen.getByText('Next'));
  
  // Step 2: Location & Impact
  await fillStep2(user, data);
  await user.click(screen.getByText('Next'));
  
  // Step 3: Assistance & Contact
  await fillStep3(user, data);
  await user.click(screen.getByText('Next'));
  
  // Now on Step 4: Review & Submit
};

export const navigateToStep = async (user: any, stepNumber: number, data: Partial<FormData> = {}) => {
  if (stepNumber < 1 || stepNumber > 4) {
    throw new Error('Step number must be between 1 and 4');
  }
  
  if (stepNumber >= 2) {
    await fillStep1(user, data);
    await user.click(screen.getByText('Next'));
  }
  
  if (stepNumber >= 3) {
    await fillStep2(user, data);
    await user.click(screen.getByText('Next'));
  }
  
  if (stepNumber >= 4) {
    await fillStep3(user, data);
    await user.click(screen.getByText('Next'));
  }
};

export const expectStepToBeActive = (stepNumber: number) => {
  const stepTitles = [
    'Disaster Information',
    'Location & Impact',
    'Assistance & Contact',
    'Review & Submit'
  ];
  
  // Check that the correct step content is visible
  expect(screen.getByText(stepTitles[stepNumber - 1])).toBeInTheDocument();
};

export const mockPhotoFiles = [
  new File(['photo1'], 'photo1.jpg', { type: 'image/jpeg' }),
  new File(['photo2'], 'photo2.png', { type: 'image/png' }),
  new File(['photo3'], 'photo3.gif', { type: 'image/gif' }),
];

export const mockInvalidFiles = [
  new File(['document'], 'document.pdf', { type: 'application/pdf' }),
  new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' }), // 11MB file
];

export const disasterTypesByCategory = {
  natural: ['Earthquake', 'Flood', 'Hurricane/Typhoon', 'Tornado', 'Wildfire', 'Other Natural'],
  humanMade: ['Industrial Accident', 'Chemical Spill', 'Building Collapse', 'Other Human-Made'],
  health: ['Disease Outbreak', 'Pandemic', 'Water Contamination', 'Other Health'],
};

export const impactTypes = [
  'Property Damage',
  'Infrastructure Damage', 
  'Environmental Impact',
  'Human Casualties',
  'Economic Loss',
  'Service Disruption',
  'Agricultural Loss',
  'Cultural Heritage Damage',
  'Other'
];

export const assistanceTypes = [
  'Emergency Rescue',
  'Medical Assistance',
  'Food & Water',
  'Temporary Shelter',
  'Transportation',
  'Communication Support',
  'Financial Aid',
  'Cleanup & Restoration',
  'Psychological Support',
  'Legal Assistance',
  'Technical Expertise',
  'Volunteer Coordination'
];

export const severityLevels = ['Low', 'Medium', 'High', 'Critical'];

export const urgencyLevels = ['Immediate', 'Within 24h', 'Within Week', 'Non-urgent'];

export const mockSubmissionData = {
  disasterType: 'flood',
  disasterDetail: 'Flood',
  customDisasterDetail: '',
  description: mockFormData.description,
  severity: 'high',
  dateTime: mockFormData.dateTime,
  location: mockFormData.location,
  impactType: mockFormData.impactTypes,
  customImpactType: '',
  affectedPeople: mockFormData.affectedPeople,
  estimatedDamage: mockFormData.estimatedDamage,
  assistanceNeeded: mockFormData.assistanceTypes,
  assistanceDescription: mockFormData.assistanceDescription,
  urgencyLevel: mockFormData.urgencyLevel,
  contactName: mockFormData.contactName,
  contactPhone: mockFormData.contactPhone,
  contactEmail: mockFormData.contactEmail,
  isEmergency: false,
  photos: []
};