'use client';

import { useState } from 'react';
import { uploadLocationPhoto } from '@/utils/storage';
import { supabase } from '@/lib/supabase-client';

export function usePhotoUpload(locationId: number) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to storage and get URL and storage path
      const { url, storagePath } = await uploadLocationPhoto(locationId, file);
      
      // Add record to location_photos table
      const { error: dbError } = await supabase
        .from('location_photos')
        .insert([{
          location_id: locationId,
          url: url,
          storage_path: storagePath
        }]);

      if (dbError) {
        throw new Error('Failed to save photo information');
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return { url, storagePath };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload photo';
      setUploadError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  return {
    uploading,
    uploadProgress,
    uploadError,
    uploadPhoto,
    setUploadError,
  };
}