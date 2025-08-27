import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { CreateNotificationDto, NotificationDTO } from "../types/Notification";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5057/api";
const API_BASE = `${API_BASE_URL}/notification`;
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

export const NotificationAPI = {
  // ✅ Get current user notifications
  async getUserNotifications(token?: string) {
    const response = await axios.get<NotificationDTO[]>(
      `${API_BASE}/user`,
      getAuthHeaders(token)
    );
    return response.data;
  },

  async getAdminNotifications(token?: string) {
    const response = await axios.get<NotificationDTO[]>(
      `${API_BASE}/admin`,
      getAuthHeaders(token)
    );
    return response.data;
  },
  // admin only
  async createNotification(
    dto: CreateNotificationDto,
    token?: string
  ): Promise<NotificationDTO> {
    const response = await axios.post<NotificationDTO>(
      API_BASE,
      dto,
      getAuthHeaders(token)
    );
    return response.data;
  },
  // ✅ Mark notification as read
  async markAsRead(id: string, token?: string): Promise<void> {
    await axios.put(`${API_BASE}/${id}/read`, {}, getAuthHeaders(token));
  },

  // ✅ Mark all notifications as read
  async markAllAsRead(token?: string): Promise<void> {
    await axios.put(`${API_BASE}/read-all`, {}, getAuthHeaders(token));
  },
};
