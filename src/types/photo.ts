export interface PhotoDto {
  id: number;
  reportId: string; // UUID string
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface CreatePhotoDto {
  reportId: string; // GUID
  file: File;
  caption?: string;
}

export interface UpdatePhotoDto {
  id: number;
  reportId: string;
  file?: File;
  caption?: string;
}
