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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// OTP (One-Time Passcode) request types
export interface SendOTPRequest {
  email: string;
  purpose?: 'login' | 'signup' | 'verification'; // Purpose of the OTP
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  purpose?: 'login' | 'signup' | 'verification';
}

// OTP response types
export interface SendOTPResponse {
  message: string;
  expiresAt: string; // When the OTP expires
  retryAfter?: number; // Seconds until user can request another OTP
}

export interface VerifyOTPResponse extends AuthResponse {
  // Inherits from AuthResponse (includes accessToken, refreshToken, user, etc.)
  isNewUser?: boolean; // True if this is a first-time login (signup via OTP)
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

// Real-world disaster data interfaces
export interface RealWorldDisaster {
  id: string;
  title: string;
  description: string;
  location: {
    coordinates: { lat: number; lng: number };
    place: string;
  };
  disasterType: 'earthquake' | 'flood' | 'hurricane' | 'wildfire' | 'storm' | 'tsunami' | 'volcano' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  magnitude?: number;
  time: Date;
  updatedAt: Date;
  source: string;
  url?: string;
  alertLevel?: 'green' | 'yellow' | 'orange' | 'red';
  depth?: number;
  felt?: number;
  tsunami?: boolean;
  significance?: number;
}

export interface USGSEarthquake {
  type: 'Feature';
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    tz?: number;
    url: string;
    detail: string;
    felt?: number;
    cdi?: number;
    mmi?: number;
    alert?: 'green' | 'yellow' | 'orange' | 'red';
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst?: number;
    dmin?: number;
    rms?: number;
    gap?: number;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
  id: string;
}

export interface USGSEarthquakeResponse {
  type: 'FeatureCollection';
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: USGSEarthquake[];
  bbox: [number, number, number, number, number, number];
}

// Google types
declare global {
  interface Window {
    google: any;
  }
}