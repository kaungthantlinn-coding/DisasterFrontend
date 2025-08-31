// services/AdminDonationService.ts
import axios from "axios";
import { DonationDto, PendingDonationDto } from "../types/Donation";
import { useAuthStore } from "../stores/authStore";

const API_BASE = "http://localhost:5057/api/donation"; // 👈 matches controller

const getAuthHeaders = () => {
  const authToken = useAuthStore.getState().accessToken;
  if (!authToken) throw new Error("❌ Auth token is required");
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
};

export const AdminDonationService = {
  async getPending(): Promise<PendingDonationDto[]> {
    const res = await axios.get(`${API_BASE}/pending`, getAuthHeaders());
    return res.data;
  },

  async verifyDonation(id: number) {
    await axios.post(`${API_BASE}/${id}/verify`, {}, getAuthHeaders());
  },

  async getVerified(): Promise<DonationDto[]> {
    const res = await axios.get(`${API_BASE}/verified`, getAuthHeaders());
    return res.data;
  },

  async getDashboardSummary(): Promise<any> {
    const res = await axios.get(`${API_BASE}/dashboard`, getAuthHeaders());
    return res.data;
  },
};
