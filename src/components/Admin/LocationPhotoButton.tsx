'use client';

import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PhotoPreviewHover from './PhotoPreviewHover';
import { useLocationPhotos } from '@/hooks/useLocationPhotos';

interface LocationPhotoButtonProps {
  locationId: number;
  onClick: () => void;
}

export default function LocationPhotoButton({ locationId, onClick }: LocationPhotoButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { photos, loading } = useLocationPhotos(locationId);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (photos.length > 0) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <Box 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <Tooltip title={`${photos.length} photos`}>
        <span>
          <IconButton
            onClick={onClick}
            size="small"
            color="primary"
            disabled={loading}
          >
            <PhotoLibraryIcon />
            <Box component="span" sx={{ ml: 0.5, fontSize: '0.875rem' }}>
              {photos.length}
            </Box>
          </IconButton>
        </span>
      </Tooltip>

      <PhotoPreviewHover
        photos={photos.map((photo) => photo.url)}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
      />
    </Box>
  );
}