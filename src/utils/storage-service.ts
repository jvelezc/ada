import { supabaseServer } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';
import { PhotoUploadResponse } from '@/types/photos';

const STORAGE_BUCKET = 'locations';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadPhoto(locationId: number, file: File): Promise<PhotoUploadResponse> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 5MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt) {
      throw new Error('Invalid file extension');
    }

    const fileName = `${uuidv4()}.${fileExt}`;
    const storagePath = `location-${locationId}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError, data } = await supabaseServer.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload file');
    }

    if (!data?.path) {
      throw new Error('No file path returned from upload');
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseServer.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      url: publicUrl,
      storagePath: storagePath
    };
  } catch (error) {
    console.error('Error in uploadPhoto:', error);
    throw error;
  }
}

export async function deletePhoto(storagePath: string): Promise<void> {
  try {
    const { error } = await supabaseServer.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error('Storage delete error:', error);
      throw new Error('Failed to delete file from storage');
    }
  } catch (error) {
    console.error('Error in deletePhoto:', error);
    throw error;
  }
}