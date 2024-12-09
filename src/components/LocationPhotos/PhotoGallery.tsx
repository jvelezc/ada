'use client';

import { Box, Typography } from '@mui/material';
import { LocationPhoto } from '@/types/photos';
import PhotoGrid from './PhotoGrid';
import PhotoPreview from './PhotoPreview';
import { useState } from 'react';

interface PhotoGalleryProps {
  photos: LocationPhoto[];
  onPhotoDelete?: (photoId: number) => Promise<void>;
  editable?: boolean;
}

export default function PhotoGallery({ 
  photos, 
  onPhotoDelete,
  editable = false 
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (photos.length === 0) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
        No photos available
      </Typography>
    );
  }

  return (
    <Box>
      <PhotoGrid
        photos={photos}
        onPhotoSelect={(url) => setSelectedPhoto(url)}
        onPhotoDelete={onPhotoDelete}
        editable={editable}
      />
      
      <PhotoPreview
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </Box>
  );
}