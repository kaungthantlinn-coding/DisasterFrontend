import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { DisasterEventDto, DisasterEventCreateDto } from "../types/DisasterEvent";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5057/api";
const API_BASE = `${API_BASE_URL}/DisasterEvent`;

const getAuthHeaders = (token?: string) => {
  const authToken = token || useAuthStore.getState().accessToken;
  if (!authToken) throw new Error("❌ Auth token is required");
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
};

export const DisasterEventService = {
  async getAll(token?: string): Promise<DisasterEventDto[]> {
    try {
      // Try the dedicated endpoint first
      const response = await axios.get<DisasterEventDto[]>(
        API_BASE,
        getAuthHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      // If the endpoint doesn't exist or returns an error, try alternative approaches
      console.warn("Failed to fetch disaster events:", error.message);

      // Return empty array to let the component fall back to input-only mode
      return [];
    }
  },

  async create(disasterEvent: DisasterEventCreateDto, token?: string): Promise<DisasterEventDto> {
    try {
      const response = await axios.post<DisasterEventDto>(
        API_BASE,
        disasterEvent,
        getAuthHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to create disaster event:", error.message);
      throw error;
    }
  },
};
