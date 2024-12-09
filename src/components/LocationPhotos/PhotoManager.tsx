'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Alert, CircularProgress, Paper, Button } from '@mui/material';
import { useLocationPhotos } from '@/hooks/useLocationPhotos';
import PhotoUpload from './PhotoUpload';
import PhotoGallery from './PhotoGallery';

interface PhotoManagerProps {
  locationId: number;
  editable?: boolean;
  onClose?: () => void;
  onPhotoChange?: () => void;
}

export default function PhotoManager({ 
  locationId, 
  editable = true,
  onClose,
  onPhotoChange
}: PhotoManagerProps) {
  const {
    photos,
    loading,
    error,
    fetchPhotos,
    addPhoto,
    removePhoto,
  } = useLocationPhotos(locationId);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleFileSelect = async (file: File) => {
    try {
      setUploadError(null);
      await addPhoto(file);
      onPhotoChange?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload photo';
      setUploadError(message);
      console.error('Error handling file:', error);
    }
  };

  const handlePhotoDelete = async (photoId: number) => {
    try {
      await removePhoto(photoId);
      onPhotoChange?.();
    } catch (error) {
      console.error('Error deleting photo:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete photo';
      setUploadError(message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}

      {editable && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Upload New Photo
          </Typography>
          <PhotoUpload onFileSelect={handleFileSelect} />
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {photos.length > 0 ? `Photos (${photos.length})` : 'No Photos Yet'}
        </Typography>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 2,
          }}
        >
          <PhotoGallery
            photos={photos}
            onPhotoDelete={handlePhotoDelete}
            editable={editable}
          />
        </Paper>
      </Box>

      {onClose && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained"
            onClick={onClose}
          >
            Done
          </Button>
        </Box>
      )}
    </Box>
  );
}