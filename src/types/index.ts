// User types
export interface User {
  userId: string;
  name: string;
  email: string;
  photoUrl?: string;
  roles: string[];
}

// Authentication request types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface GoogleLoginRequest {
  idToken: string;
  deviceInfo?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Authentication response types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// Disaster Report types
export interface AssistanceLogEntry {
  id: string;
  providerName: string;
  description: string;
  createdAt: Date;
  endorsed: boolean;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  disasterType: 'flood' | 'fire' | 'earthquake' | 'storm' | 'drought' | 'landslide' | 'tsunami' | 'volcano' | 'hurricane' | 'tornado' | 'wildfire' | 'chemical_spill' | 'nuclear_incident' | 'industrial_accident' | 'structural_failure' | 'transportation_accident' | 'cyber_attack' | 'power_outage' | 'infrastructure_failure' | 'other';
  disasterDetail: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  reporterName: string;
  photos: string[];
  verified: boolean;
  assistanceNeeded: string[];
  assistanceDescription: string;
  assistanceLog: AssistanceLogEntry[];
}

// Statistics types
export interface Statistics {
  reportsSubmitted: number;
  livesHelped: number;
  verifiedReports: number;
  averageResponseTime: string;
}

// Feature types
export interface Feature {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  color: string;
  bgColor: string;
}

// Partner types
export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

// Google types
declare global {
  interface Window {
    google: any;
  }
}