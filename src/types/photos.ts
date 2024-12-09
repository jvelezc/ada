export interface LocationPhoto {
  id: number;
  location_id: number;
  url: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoUploadResponse {
  url: string;
  storagePath: string;
}

export interface PhotoUploadError {
  message: string;
  code?: string;
}