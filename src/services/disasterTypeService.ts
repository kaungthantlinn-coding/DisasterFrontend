import axios from "axios";
import {
  DisasterTypeDto,
  CreateDisasterTypeDto,
  UpdateDisasterTypeDto,
} from "../types/DisasterType";

const API_BASE = "http://localhost:5057/api/DisasterType";

const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem("token");
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
