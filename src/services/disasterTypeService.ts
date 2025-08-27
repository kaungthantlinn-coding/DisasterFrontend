import axios from "axios";
import {
  DisasterTypeDto,
  CreateDisasterTypeDto,
  UpdateDisasterTypeDto,
} from "../types/DisasterType";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5057/api";
const API_BASE = `${API_BASE_URL}/DisasterType`;

const getAuthHeaders = (token?: string) => {
  const authToken = token || useAuthStore.getState().accessToken;
  if (!authToken) throw new Error("❌ Auth token is required");
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
};

export const DisasterTypeService = {
  async getAll(token?: string): Promise<DisasterTypeDto[]> {
    const response = await axios.get<DisasterTypeDto[]>(
      API_BASE,
      getAuthHeaders(token)
    );
    return response.data;
  },

  async getById(id: number, token?: string): Promise<DisasterTypeDto> {
    const response = await axios.get<DisasterTypeDto>(
      `${API_BASE}/${id}`,
      getAuthHeaders(token)
    );
    return response.data;
  },

  async create(dto: CreateDisasterTypeDto, token?: string): Promise<void> {
    await axios.post(API_BASE, dto, getAuthHeaders(token));
  },

  async update(
    id: number,
    dto: UpdateDisasterTypeDto,
    token?: string
  ): Promise<void> {
    await axios.put(`${API_BASE}/${id}`, dto, getAuthHeaders(token));
  },

  async remove(id: number, token?: string): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`, getAuthHeaders(token));
  },
};