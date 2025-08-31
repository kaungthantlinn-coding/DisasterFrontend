import axios from "axios";
import {
  DisasterReportCreateDto,
  DisasterReportDto,
  DisasterReportUpdateDto,
} from "../types/DisasterReport";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5057/api";
const API_BASE = `${API_BASE_URL}/DisasterReport`;

const getAuthHeaders = (token?: string) => {
  const authState = useAuthStore.getState();
  const authToken =
    token || authState.accessToken || localStorage.getItem("token");

  console.log("Debug token info:", {
    parameterToken: token,
    storeToken: authState.accessToken,
    localStorageToken: localStorage.getItem("token"),
    finalToken: authToken,
    isAuthenticated: authState.isAuthenticated,
  });

  if (!authToken) throw new Error("Token not found, please login.");
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
};

export const getAll = async (token?: string): Promise<DisasterReportDto[]> => {
  const response = await axios.get<DisasterReportDto[]>(
    API_BASE,
    getAuthHeaders(token)
  );
  return response.data;
};

export const getById = async (
  id: string,
  token?: string
): Promise<DisasterReportDto> => {
  const response = await axios.get<DisasterReportDto>(
    `${API_BASE}/${id}`,
    getAuthHeaders(token)
  );
  console.log("response of getById:", response);
  return response.data;
};

// create method မှာ dto က FormData ဖြစ်နေလို့ token လည်းလိုအပ်ပါတယ်
export const createDisasterReport = async (
  dto: FormData,
  token?: string
): Promise<DisasterReportCreateDto> => {
  console.log("🔍 === SERVICE LAYER DEBUG ===");
  console.log("📦 FormData received in service:");
  for (let [key, value] of dto.entries()) {
    if (value instanceof File) {
      console.log(
        `${key}:`,
        `File(${value.name}, ${value.size} bytes, ${value.type})`
      );
    } else {
      console.log(`${key}:`, value);
    }
  }
  const config = getAuthHeaders(token);

  console.log("🔑 Auth headers:", config);
  console.log("🎯 API endpoint:", API_BASE);
  // axios က multipart/form-data ကို content-type ကိုသိပြီးထည့်တာကြောင့် ထပ်မသတ်မှတ်ပါနဲ့
  const response = await axios.post<DisasterReportDto>(API_BASE, dto, config);
  return response.data;
};

export const update = async (
  id: string,
  dto: FormData,
  token?: string
): Promise<DisasterReportUpdateDto> => {
  const config = getAuthHeaders(token);
  const response = await axios.put<DisasterReportDto>(
    `${API_BASE}/${id}`,
    dto,
    config
  );
  return response.data;
};

export const remove = async (id: string, token?: string): Promise<void> => {
  const config = getAuthHeaders(token);
  await axios.delete(`${API_BASE}/${id}`, config);
};

export const getPendingReports = async (
  token?: string
): Promise<DisasterReportDto[]> => {
  const response = await axios.get<DisasterReportDto[]>(
    `${API_BASE}/pending`,
    getAuthHeaders(token)
  );
  return response.data;
};
export const getAcceptedDisasterReports = async (
  token?: string
): Promise<DisasterReportDto[]> => {
  let config = {};
  if (token) {
    config = getAuthHeaders(token);
  }

  const response = await axios.get<DisasterReportDto[]>(
    `${API_BASE}/accepted`,
    config
  );
  return response.data; // ❗ ဒီလို return လုပ်မှ sort() သုံးလို့ရမယ်
};

export const acceptDisasterReport = async (
  id: string,
  token?: string
): Promise<void> => {
  const config = getAuthHeaders(token);
  await axios.put(`${API_BASE}/${id}/accept`, {}, config);
};

export const rejectDisasterReport = async (
  id: string,
  token?: string
): Promise<void> => {
  const config = getAuthHeaders(token);
  await axios.put(`${API_BASE}/${id}/reject`, {}, config);
};

export const updateReportStatus = async (
  id: string,
  status: "Accepted" | "Rejected",
  token?: string
) => {
  const config = getAuthHeaders(token);
  const response = await axios.put(
    `${API_BASE}/${id}/status`,
    { status },
    config
  );
  return response.data;
};

export const getMyReports = async (
  userId: string,
  token?: string
): Promise<DisasterReportDto[]> => {
  const response = await axios.get<DisasterReportDto[]>(
    `${API_BASE}/user/${userId}`,
    getAuthHeaders(token)
  );
  return response.data;
};
