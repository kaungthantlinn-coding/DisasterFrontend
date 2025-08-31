import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import {
  SupportRequest,
  SupportRequestCreateDto,
  SupportRequestMetrics,
  SupportRequestResponseDto,
  SupportRequestUpdateDto,
} from "../types/supportRequest";

const API_BASE = "http://localhost:5057/api/SupportRequest";

const getAuthHeaders = (token?: string) => {
  const authState = useAuthStore.getState();
  const authToken =
    token || authState.accessToken || localStorage.getItem("token");

  if (!authToken) throw new Error("Token not found. Please log in first.");

  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  };
};

// Helper function to normalize assistanceTypes
const normalizeAssistanceTypes = (
  assistanceTypes: string[] | string | null | undefined
): string[] => {
  console.log(
    "Raw assistanceTypes:",
    assistanceTypes,
    "Type:",
    typeof assistanceTypes
  ); // Debug log
  if (Array.isArray(assistanceTypes)) {
    return assistanceTypes;
  }
  if (typeof assistanceTypes === "string" && assistanceTypes !== "") {
    return assistanceTypes.split(",").map((s) => s.trim());
  }
  return []; // Handle null, undefined, or empty string
};

export const SupportRequestService = {
  async create(
    dto: SupportRequestCreateDto,
    authToken?: string
  ): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      API_BASE,
      dto,
      getAuthHeaders(authToken)
    );
    console.log("Support request created:", response.data, authToken);
    return response.data;
  },

  async getAllSupportType(authToken?: string): Promise<string[]> {
    const response = await axios.get<string[]>(
      `${API_BASE}/support-types`,
      getAuthHeaders(authToken)
    );
    console.log("Support types fetched:", response.data);
    return response.data;
  },

  async getAcceptedByReportId(
    reportId: string,
    authToken?: string
  ): Promise<SupportRequestResponseDto[]> {
    const response = await axios.get<SupportRequestResponseDto[]>(
      `${API_BASE}/accepted/${reportId}`,
      getAuthHeaders(authToken)
    );
    console.log("Raw getAcceptedByReportId response:", response.data);
    return response.data.map((item) => ({
      ...item,
      assistanceTypes: normalizeAssistanceTypes(item.supportTypeNames),
      supportTypeIds: item.supportTypeIds || [],
    }));
  },

  async getAllRequests(authToken?: string): Promise<SupportRequest[]> {
    const response = await axios.get<SupportRequest[]>(
      API_BASE,
      getAuthHeaders(authToken)
    );
    console.log("Raw getAllRequests response:", response.data);
    console.log("First item in response:", response.data[0]);
    console.log("First item id:", response.data[0]?.id);
    console.log("First item id type:", typeof response.data[0]?.id);

    return response.data.map((item, index) => {
      console.log(`Item ${index} - original item:`, item);
      console.log(`Item ${index} - original id:`, item.id, typeof item.id);
      console.log(`Item ${index} - Number(id):`, Number(item.id));

      // Map backend fields to frontend SupportRequest interface
      const mappedItem: SupportRequest = {
        id: Number(item.id) || 0,
        reportId: (item as any).reportId || "",
        fullName: (item as any).userName || (item as any).fullName || "Unknown",
        email: (item as any).email || "",
        urgencyLevel: String(
          (item as any).urgencyLevel || (item as any).urgency || "non_urgent"
        ),
        description: String((item as any).description || ""),
        location: String((item as any).location || ""),
        assistanceTypes: normalizeAssistanceTypes(
          (item as any).assistanceTypes || (item as any).supportTypeNames
        ),
        status: String((item as any).status || "pending"),
        createdAt: (item as any).createdAt || (item as any).dateReported,
        adminRemarks: (item as any).adminRemarks || "",
      };

      console.log(`Item ${index} - mapped item:`, mappedItem);
      return mappedItem;
    });
  },

  async getPendingRequests(authToken?: string): Promise<SupportRequest[]> {
    const response = await axios.get<SupportRequest[]>(
      `${API_BASE}/pending`,
      getAuthHeaders(authToken)
    );
    console.log("Raw getPendingRequests response:", response.data);
    return response.data.map((item) => ({
      ...item,
      id: Number(item.id),
      assistanceTypes: normalizeAssistanceTypes(item.assistanceTypes),
    }));
  },

  async getAcceptedRequests(authToken?: string): Promise<SupportRequest[]> {
    const response = await axios.get<SupportRequest[]>(
      `${API_BASE}/accepted`,
      getAuthHeaders(authToken)
    );
    console.log("Raw getAcceptedRequests response:", response.data);
    return response.data.map((item) => ({
      ...item,
      id: Number(item.id),
      assistanceTypes: normalizeAssistanceTypes(item.assistanceTypes),
    }));
  },

  async getRejectedRequests(authToken?: string): Promise<SupportRequest[]> {
    const response = await axios.get<SupportRequest[]>(
      `${API_BASE}/rejected`,
      getAuthHeaders(authToken)
    );
    console.log("Raw getRejectedRequests response:", response.data);
    return response.data.map((item) => ({
      ...item,
      id: Number(item.id),
      assistanceTypes: normalizeAssistanceTypes(item.assistanceTypes),
    }));
  },

  async getMetrics(authToken?: string): Promise<SupportRequestMetrics> {
    const response = await axios.get<SupportRequestMetrics>(
      `${API_BASE}/metrics`,
      getAuthHeaders(authToken)
    );
    console.log("Raw getMetrics response:", response.data);
    const data = response.data as any;
    return {
      totalRequests: Number(data.totalRequests),
      pendingRequests: Number(data.pendingRequests),
      verifiedRequests: Number(data.verifiedRequests || data.acceptedRequests),
      rejectedRequests: Number(data.rejectedRequests),
    };
  },

  async updateRequestStatus(
    id: number,
    status: "verified" | "rejected",
    adminRemarks?: string,
    authToken?: string
  ): Promise<SupportRequest> {
    const endpoint =
      status === "verified"
        ? `${API_BASE}/${id}/accept`
        : `${API_BASE}/${id}/reject`;

    const headers = getAuthHeaders(authToken);
    console.log("Debug - API endpoint:", endpoint);
    console.log("Debug - Request headers:", headers);
    console.log("Debug - Request body:", adminRemarks ? { adminRemarks } : {});

    const response = await axios.put<SupportRequest>(
      endpoint,
      adminRemarks ? { adminRemarks } : {},
      headers
    );
    console.log("Raw updateRequestStatus response:", response.data);
    return {
      ...response.data,
      id: Number(response.data.id),
      assistanceTypes: normalizeAssistanceTypes(response.data.assistanceTypes),
    };
  },

  async updateRequest(
    id: number,
    dto: SupportRequestUpdateDto,
    authToken?: string
  ): Promise<SupportRequest> {
    if (!id || id <= 0) {
      throw new Error("Invalid support request ID");
    }
    try {
      const response = await axios.put<SupportRequest>(
        `${API_BASE}/${id}`,
        {
          Description: dto.Description,
          Urgency: dto.Urgency,
          SupportTypeName: dto.SupportTypeName,
          UpdateAt: dto.UpdateAt || new Date().toISOString(),
          SupportTypeIds: dto.SupportTypeIds,
        },
        getAuthHeaders(authToken)
      );
      console.log("Raw updateRequest response:", response.data);
      return {
        ...response.data,
        id: Number(response.data.id),
        assistanceTypes: normalizeAssistanceTypes(
          response.data.assistanceTypes
        ),
        supportTypeIds: response.data.supportTypeIds || [],
      };
    } catch (error: any) {
      console.error("Failed to update support request:", {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  async deleteRequest(id: number, authToken?: string): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`, getAuthHeaders(authToken));
  },

  async searchRequests(
    keyword?: string,
    urgency?: number,
    status?: string,
    authToken?: string
  ): Promise<SupportRequest[]> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (urgency !== undefined) params.append("urgency", urgency.toString());
    if (status) params.append("status", status);

    const response = await axios.get<SupportRequest[]>(
      `${API_BASE}/search?${params.toString()}`,
      getAuthHeaders(authToken)
    );
    return response.data;
  },
  async getById(id: number, authToken?: string): Promise<SupportRequest> {
    if (!id || id <= 0) {
      throw new Error("Invalid support request ID");
    }
    try {
      const response = await axios.get<SupportRequest>(
        `${API_BASE}/${id}`,
        getAuthHeaders(authToken)
      );
      console.log("Raw getById response:", response.data);
      return {
        ...response.data,
        id: Number(response.data.id),
        assistanceTypes: normalizeAssistanceTypes(
          response.data.assistanceTypes
        ),
        urgencyLevel: response.data.urgencyLevel || "non_urgent",
        status: response.data.status || "pending",
        supportTypeIds: response.data.supportTypeIds || [],
      };
    } catch (error: any) {
      console.error("Failed to fetch support request by ID:", {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
};

export const getAcceptedByReportId =
  SupportRequestService.getAcceptedByReportId;
