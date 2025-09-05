import axios from "axios";

import { useAuthStore } from "../stores/authStore";
import { CreateDonationDto, DonationDto, DonationStatsDto } from "@/types/Donation";

const API_BASE = "http://localhost:5057/api/Donation";

const getAuthHeaders = () => {
  const authToken = useAuthStore.getState().accessToken;
  if (!authToken) throw new Error("❌ Auth token is required");
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
      // "Content-Type": "multipart/form-data",
    },
  };
};

export const DonateService = {
  async createDonation(dto: CreateDonationDto): Promise<number> {
    const formData = new FormData();

    formData.append("DonorName", dto.donorName);
    if (dto.donorContact) formData.append("DonorContact", dto.donorContact);
    formData.append("DonationType", dto.donationType);
    if (dto.amount) formData.append("Amount", dto.amount.toString());
    formData.append("Description", dto.description);
    if (dto.transactionPhoto)
      formData.append("TransactionPhoto", dto.transactionPhoto);

    const response = await axios.post(API_BASE, formData, getAuthHeaders());

    return response.data.donationId;
  },

  async getByOrganization(organizationId: number): Promise<DonationDto[]> {
    const response = await axios.get<DonationDto[]>(
      `${API_BASE}/organization/${organizationId}`,
      getAuthHeaders()
    );
    return response.data;
  },

  async getVerifiedDonations(): Promise<DonationDto[]> {
    try {
      const response = await axios.get<DonationDto[]>(
        `${API_BASE}/verified`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch verified donations"
      );
    }
  },
  async getVerifiedStats(): Promise<DonationStatsDto> {
    try {
      const response = await axios.get<DonationStatsDto>(
        `${API_BASE}/verified-stats`,
        getAuthHeaders()
      );
      // Map the response to correct the typo in the backend field name
      return {
        verifiedDonations: response.data.verifiedDonations,
        verifiedDonors: response.data.verifiedDonors,
        averageVerifiedDonation: response.data.averageVerifiedDonation,
        verifiedThisMonthDonations: response.data.verifiedThisMonthDonations, // Handle backend typo
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch verified stats"
      );
    }
  },
};
