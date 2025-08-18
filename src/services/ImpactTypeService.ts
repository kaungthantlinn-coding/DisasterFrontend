import axios from "axios";
import { ImpactTypeDto } from "../types/ImpactType";
import { useAuthStore } from "../stores/authStore";

const API_BASE = "http://localhost:5057/api/ImpactType";

const getAuthHeaders = (token?: string) => {
  const authToken = token || useAuthStore.getState().accessToken;
  if (!authToken) throw new Error("❌ Auth token is required");
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
};

export const ImpactTypeService = {
  async getAll(token?: string): Promise<ImpactTypeDto[]> {
    const response = await axios.get<ImpactTypeDto[]>(
      API_BASE,
      getAuthHeaders(token)
    );
    return response.data;
  },
};
