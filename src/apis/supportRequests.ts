import { apiClient } from './client';

// Support Request Types
export interface SupportRequestData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  
  // Request Details
  disasterType: string;
  urgencyLevel: 'immediate' | 'within_24h' | 'within_week' | 'non_urgent';
  description: string;
  
  // Location and Date
  location: string;
  dateReported: string;
  
  // Assistance Types
  assistanceTypes: string[];
  
  // Status (set by backend)
  status?: 'pending' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
}

export interface SupportRequest extends SupportRequestData {
  id: string;
  status: 'pending' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  adminRemarks?: string;
  assignedTo?: string;
}

export interface SupportRequestResponse {
  id: string;
  message: string;
  referenceId: string;
}

/**
 * API service for Support Request operations
 */
export class SupportRequestsAPI {
  /**
   * Submit a new support request
   */
  static async submitRequest(requestData: SupportRequestData): Promise<SupportRequestResponse> {
    try {
      const response = await apiClient.post('/support-requests', {
        ...requestData,
        status: 'pending' // Always set initial status to pending
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to submit support request. Please try again.'
      );
    }
  }

  /**
   * Get all support requests (admin only)
   */
  static async getAllRequests(): Promise<SupportRequest[]> {
    try {
      const response = await apiClient.get('/support-requests');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch support requests. Please try again.'
      );
    }
  }

  /**
   * Get support request by ID
   */
  static async getRequestById(id: string): Promise<SupportRequest> {
    try {
      const response = await apiClient.get(`/support-requests/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch support request. Please try again.'
      );
    }
  }

  /**
   * Update support request status (admin only)
   */
  static async updateRequestStatus(
    id: string, 
    status: SupportRequest['status'],
    adminRemarks?: string
  ): Promise<SupportRequest> {
    try {
      const response = await apiClient.put(`/support-requests/${id}/status`, {
        status,
        adminRemarks
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to update support request status. Please try again.'
      );
    }
  }

  /**
   * Assign support request to admin (admin only)
   */
  static async assignRequest(id: string, assignedTo: string): Promise<SupportRequest> {
    try {
      const response = await apiClient.put(`/support-requests/${id}/assign`, {
        assignedTo
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to assign support request. Please try again.'
      );
    }
  }

  /**
   * Get user's own support requests
   */
  static async getUserRequests(): Promise<SupportRequest[]> {
    try {
      const response = await apiClient.get('/support-requests/my-requests');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch your support requests. Please try again.'
      );
    }
  }

  /**
   * Delete support request (user can delete their own pending requests)
   */
  static async deleteRequest(id: string): Promise<void> {
    try {
      await apiClient.delete(`/support-requests/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to delete support request. Please try again.'
      );
    }
  }

  /**
   * Get support request statistics (admin only)
   */
  static async getRequestStatistics(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    verifiedRequests: number;
    inProgressRequests: number;
    resolvedRequests: number;
    rejectedRequests: number;
  }> {
    try {
      const response = await apiClient.get('/support-requests/statistics');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch support request statistics. Please try again.'
      );
    }
  }
}

export default SupportRequestsAPI;