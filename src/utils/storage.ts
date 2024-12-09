import { supabase } from '@/lib/supabase-client';
import { v4 as uuidv4 } from 'uuid';
import { PhotoUploadResponse } from '@/types/photos';

const STORAGE_BUCKET = 'locations';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadLocationPhoto(
  locationId: number,
  file: File
): Promise<PhotoUploadResponse> {
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
    const { error: uploadError, data } = await supabase.storage
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
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      url: publicUrl,
      storagePath: storagePath
    };
  } catch (error) {
    console.error('Error in uploadLocationPhoto:', error);
    throw error;
  }
}

export async function deleteLocationPhoto(url: string, storagePath: string): Promise<void> {
  try {
    // Delete from storage first
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      throw new Error('Failed to delete file from storage');
    }

    // Then delete from database
    const { error: dbError } = await supabase
      .from('location_photos')
      .delete()
      .eq('url', url);

    if (dbError) {
      console.error('Database delete error:', dbError);
      throw new Error('Failed to delete photo record');
    }
  } catch (error) {
    console.error('Error in deleteLocationPhoto:', error);
    throw error;
  }
}