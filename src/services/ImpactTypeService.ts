import axios from "axios";
import { ImpactTypeDto } from "../types/ImpactType";

const API_BASE = "http://localhost:5057/api/ImpactType";

const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem("token");
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
