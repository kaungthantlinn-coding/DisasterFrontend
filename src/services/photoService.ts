import axios from "axios";
import { CreatePhotoDto, PhotoDto, UpdatePhotoDto } from "../types/photo";

const API_BASE = "http://localhost:5057/api/photo";

const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem("token");
  if (!authToken) throw new Error("❌ Auth token is required");
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
};

export const PhotoService = {
  async upload(dto: CreatePhotoDto, token?: string): Promise<PhotoDto> {
    const formData = new FormData();
    formData.append("reportId", dto.reportId);
    formData.append("file", dto.file);
    if (dto.caption) formData.append("caption", dto.caption);

    const response = await axios.post(
      `${API_BASE}/upload`,
      formData,
      getAuthHeaders(token)
    );

    return response.data;
  },

  async update(dto: UpdatePhotoDto, token?: string): Promise<any> {
    const formData = new FormData();
    formData.append("id", dto.id.toString());
    formData.append("reportId", dto.reportId);
    if (dto.file) formData.append("file", dto.file);
    if (dto.caption) formData.append("caption", dto.caption);

    const response = await axios.put(
      `${API_BASE}/update`,
      formData,
      getAuthHeaders(token)
    );
    return response.data;
  },

  async delete(photoId: number, token?: string): Promise<void> {
    await axios.delete(`${API_BASE}/${photoId}`, getAuthHeaders(token));
  },
};
