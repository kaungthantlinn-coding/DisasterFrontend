import axios from "axios";
import { ImpactTypeDto } from "../types/ImpactType";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5057/api";
const API_BASE = `${API_BASE_URL}/ImpactType`;

const authState = useAuthStore.getState();
const getAuthHeaders = (token?: string) => {
  const authToken =
    token || authState.accessToken || localStorage.getItem("token");
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
  async create(dto: { name: string }, token?: string): Promise<void> {
    await axios.post(API_BASE, dto, getAuthHeaders(token));
  },
};