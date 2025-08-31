export interface SupportRequestCreateDto {
  ReportId: string; // PascalCase
  Description: string; // PascalCase
  Urgency: number; // byte in backend
  SupportTypeNames: string[]; // array
}
export interface SupportRequestDto {
  id: string;
  reportId: string;
  description: string;
  urgency: number;
  status: string;
  userId: string;
  createdAt: string;
}

export interface SupportRequestResponseDto {
  id: number;
  reportId: string;
  userName: string;
  email: string;
  description: string;
  urgency: number;
  status?: string;
  userId: string;
  supportTypeNames: string[] | string | null | undefined;
  supportTypeIds?: number[];
  createdAt?: string;
  updatedAt?: string;
}
export interface SupportRequestMetrics {
  totalRequests: number;
  pendingRequests: number;
  verifiedRequests: number;

  rejectedRequests: number;
}

export interface SupportRequest {
  id: number;
  reportId: string; // Maps to Guid Id
  fullName: string;
  email: string;
  urgencyLevel: string; // e.g., 'immediate', 'within_24h', 'within_week', 'non_urgent'
  description: string;
  createdAt?: string; // Maps to DateReported (converted to string for frontend)
  status: string; // e.g., 'pending', 'verified', 'in_progress', 'resolved', 'rejected'
  adminRemarks?: string;
  assistanceTypes: string[] | string | null | undefined; // Maps to SupportTypeNames
  userId?: string; // User ID who created the request
  // Optional, as not in SupportRequestsDto
  location?: string; // Optional, as not in SupportRequestsDto
  disasterType?: string; // Optional, as not in SupportRequestsDto
  supportTypeIds?: number[];
}
export interface SupportRequestUpdateDto {
  Description: string;
  Urgency: number;
  SupportTypeName: string;
  UpdateAt?: string;
  SupportTypeIds: number[];
}
