// services/organizationService.ts
import axios from "axios";
import type { OrganizationDto, CreateOrganizationDto, UpdateOrganizationDto } from "../types/Organization";

const API_BASE = "http://localhost:5057/api/Organization";

const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem("token");
  if (!authToken) throw new Error("Authentication token is required");
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
};

export const OrganizationService = {
  // Public endpoint
  async getAll(): Promise<OrganizationDto[]> {
    const response = await axios.get<OrganizationDto[]>(API_BASE);
    return response.data;
  },

  async getById(id: number, token?: string): Promise<OrganizationDto> {
    const response = await axios.get<OrganizationDto>(`${API_BASE}/${id}`, getAuthHeaders(token));
    return response.data;
  },

  // Admin-only endpoints
  async create(dto: CreateOrganizationDto, token?: string): Promise<{ organizationId: number }> {
    const response = await axios.post<{ organizationId: number }>(API_BASE, dto, getAuthHeaders(token));
    return response.data;
  },

  async update(id: number, dto: UpdateOrganizationDto, token?: string): Promise<void> {
    await axios.put(`${API_BASE}/${id}`, dto, getAuthHeaders(token));
  },

  async remove(id: number, token?: string): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`, getAuthHeaders(token));
  },
};
