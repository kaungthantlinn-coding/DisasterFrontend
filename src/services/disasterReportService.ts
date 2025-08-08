// services/disasterReportService.ts
import axios from "axios";
import {
  DisasterReportCreateDto,
  DisasterReportDto,
  DisasterReportUpdateDto,
} from "../types/DisasterReport";
import { get } from "http";

const API_BASE = "http://localhost:5057/api/DisasterReport";

const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem("token");
  if (!authToken) throw new Error("❌ Auth token is required");
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
};

export const DisasterReportService = {
  async getAll(): Promise<DisasterReportDto[]> {
    const response = await axios.get<DisasterReportDto[]>(API_BASE);
    return response.data;
  },

  async getById(id: string): Promise<DisasterReportDto> {
    const response = await axios.get<DisasterReportDto>(`${API_BASE}/${id}`);
    return response.data;
  },

  async create(
    dto: DisasterReportCreateDto,
    authToken?: string
  ): Promise<DisasterReportDto> {
    const response = await axios.post<DisasterReportDto>(
      API_BASE,
      dto,
      getAuthHeaders(authToken)
    );
    return response.data;
  },

  async update(
    id: string,
    dto: DisasterReportUpdateDto,
    authToken?: string
  ): Promise<DisasterReportDto> {
    const response = await axios.put<DisasterReportDto>(
      `${API_BASE}/${id}`,
      dto,
      getAuthHeaders(authToken)
    );
    return response.data;
  },

  async remove(id: string, authToken?: string): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`, getAuthHeaders(authToken));
  },
};
