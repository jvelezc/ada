'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { LocationPhoto } from '@/types/photos';
import { uploadLocationPhoto } from '@/utils/storage';

export function useLocationPhotos(locationId: number) {
  const [photos, setPhotos] = useState<LocationPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('location_photos')
        .select('*')
        .eq('location_id', locationId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPhotos(data || []);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  const addPhoto = useCallback(async (file: File) => {
    try {
      const { url, storagePath } = await uploadLocationPhoto(locationId, file);

      const { data: photo, error: dbError } = await supabase
        .from('location_photos')
        .insert([{
          location_id: locationId,
          url,
          storage_path: storagePath
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      setPhotos(prev => [photo!, ...prev]);
      return photo!;
    } catch (error) {
      console.error('Error adding photo:', error);
      throw error;
    }
  }, [locationId]);

  const removePhoto = useCallback(async (photoId: number) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) throw new Error('Photo not found');

      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('locations')
        .remove([photo.storage_path]);

      if (storageError) throw storageError;

      // Then delete from database
      const { error: dbError } = await supabase
        .from('location_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;

      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (error) {
      console.error('Error removing photo:', error);
      throw error;
    }
  }, [photos]);

  return {
    photos,
    loading,
    error,
    fetchPhotos,
    addPhoto,
    removePhoto,
  };
}