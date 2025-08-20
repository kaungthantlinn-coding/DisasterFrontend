import { apiClient } from "./client";
import { Report } from "../types";

// Report submission interface
export interface ReportSubmissionData {
  disasterType: string;
  disasterDetail: string;
  customDisasterDetail?: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  dateTime: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  impactType: string[];
  customImpactType?: string;
  //affectedPeople: number;
  //estimatedDamage?: string;
  //assistanceNeeded: string[];
  //assistanceDescription: string;
  //urgencyLevel: 'immediate' | 'within_24h' | 'within_week' | 'non_urgent';
  //contactName: string;
  //contactPhone?: string;
  //contactEmail?: string;
  //isEmergency: boolean;
  photos?: File[];
}

// API response interfaces
export interface ReportSubmissionResponse {
  id: string;
  status: "pending" | "verified" | "resolved";
  submittedAt: string;
  estimatedResponseTime: string;
}

export interface ReportsListResponse {
  reports: Report[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ReportFilters {
  disasterType?: string;
  severity?: string;
  status?: string;
  location?: {
    lat: number;
    lng: number;
    radius: number; // in kilometers
  };
  dateFrom?: string;
  dateTo?: string;
  verified?: boolean;
}

// Reports API service
export class ReportsAPI {
  /**
   * Submit a new disaster impact report
   */
  static async submitReport(
    data: ReportSubmissionData
  ): Promise<ReportSubmissionResponse> {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photos") return; // Handle photos separately
        if (
          key === "location" ||
          key === "impactType" ||
          key === "assistanceNeeded"
        ) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // Add photos if any
      if (data.photos && data.photos.length > 0) {
        data.photos.forEach((photo, index) => {
          formData.append(`photos`, photo);
        });
      }

      const response = await apiClient.post("/reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds for file upload
      });

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to submit report. Please try again."
      );
    }
  }

  /**
   * Get list of reports with optional filters
   */
  static async getReports(
    page: number = 1,
    pageSize: number = 20,
    filters?: ReportFilters
  ): Promise<ReportsListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      // Add filters to params
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === "object") {
              params.append(key, JSON.stringify(value));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }

      const response = await apiClient.get(`/reports?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch reports. Please try again."
      );
    }
  }

  /**
   * Get a specific report by ID
   */
  static async getReportById(id: string): Promise<Report> {
    try {
      const response = await apiClient.get(`/reports/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch report details. Please try again."
      );
    }
  }

  /**
   * Update report status (admin only)
   */
  static async updateReportStatus(
    id: string,
    status: "pending" | "verified" | "resolved",
    notes?: string
  ): Promise<Report> {
    try {
      const response = await apiClient.patch(`/reports/${id}/status`, {
        status,
        notes,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to update report status. Please try again."
      );
    }
  }

  /**
   * Add assistance log entry to a report
   */
  static async addAssistanceLog(
    reportId: string,
    description: string,
    providerName: string
  ): Promise<Report> {
    try {
      const response = await apiClient.post(`/reports/${reportId}/assistance`, {
        description,
        providerName,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to add assistance log. Please try again."
      );
    }
  }

  /**
   * Get reports statistics
   */
  static async getReportsStatistics(): Promise<{
    totalReports: number;
    pendingReports: number;
    verifiedReports: number;
    resolvedReports: number;
    recentReports: number;
    averageResponseTime: string;
  }> {
    try {
      const response = await apiClient.get("/reports/statistics");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch statistics. Please try again."
      );
    }
  }

  /**
   * Get nearby reports based on location
   */
  static async getNearbyReports(
    lat: number,
    lng: number,
    radius: number = 10 // kilometers
  ): Promise<Report[]> {
    try {
      const response = await apiClient.get("/reports/nearby", {
        params: { lat, lng, radius },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch nearby reports. Please try again."
      );
    }
  }

  /**
   * Search reports by text query
   */
  static async searchReports(
    query: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ReportsListResponse> {
    try {
      const response = await apiClient.get("/reports/search", {
        params: { q: query, page, pageSize },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to search reports. Please try again."
      );
    }
  }

  /**
   * Delete a report (admin only)
   */
  static async deleteReport(id: string): Promise<void> {
    try {
      await apiClient.delete(`/reports/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete report. Please try again."
      );
    }
  }

  /**
   * Export reports data (admin only)
   */
  static async exportReports(
    format: "csv" | "excel" | "pdf" = "csv",
    filters?: ReportFilters
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams({ format });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === "object") {
              params.append(key, JSON.stringify(value));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }

      const response = await apiClient.get(
        `/reports/export?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to export reports. Please try again."
      );
    }
  }
}

export default ReportsAPI;
