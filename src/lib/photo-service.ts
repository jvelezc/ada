import { supabaseServer } from './supabase-server';
import { LocationPhoto, PhotoUploadResponse } from '@/types/photos';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_BUCKET = 'locations';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadLocationPhoto(locationId: number, file: File): Promise<PhotoUploadResponse> {
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

    // Upload to storage
    const { error: uploadError, data } = await supabaseServer.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) throw uploadError;
    if (!data?.path) throw new Error('No file path returned from upload');

    // Get public URL
    const { data: { publicUrl } } = supabaseServer.storage
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

export async function getLocationPhotos(locationId: number): Promise<LocationPhoto[]> {
  try {
    const { data, error } = await supabaseServer
      .from('location_photos')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in getLocationPhotos:', error);
    throw error;
  }
}

export async function deleteLocationPhoto(photoId: number): Promise<void> {
  try {
    // Get photo record first
    const { data: photo, error: fetchError } = await supabaseServer
      .from('location_photos')
      .select('storage_path')
      .eq('id', photoId)
      .single();

    if (fetchError) throw fetchError;
    if (!photo) throw new Error('Photo not found');

    // Delete from storage first
    const { error: storageError } = await supabaseServer.storage
      .from(STORAGE_BUCKET)
      .remove([photo.storage_path]);

    if (storageError) throw storageError;

    // Then delete from database
    const { error: dbError } = await supabaseServer
      .from('location_photos')
      .delete()
      .eq('id', photoId);

    if (dbError) throw dbError;
  } catch (error) {
    console.error('Error in deleteLocationPhoto:', error);
    throw error;
  }
}