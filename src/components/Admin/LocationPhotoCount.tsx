'use client';

import React from 'react';
import { Box, CircularProgress, Tooltip } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useLocationPhotoCount } from '@/hooks/useLocationPhotoCount';

interface LocationPhotoCountProps {
  locationId: number;
  onClick?: () => void;
}

export default function LocationPhotoCount({ locationId, onClick }: LocationPhotoCountProps) {
  const { count, loading } = useLocationPhotoCount(locationId);

  return (
    <Tooltip title={`${count} photos`}>
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: onClick ? 'pointer' : 'default',
          color: 'primary.main',
          '&:hover': onClick ? {
            color: 'primary.dark',
          } : undefined,
        }}
      >
        <PhotoLibraryIcon fontSize="small" />
        {loading ? (
          <CircularProgress size={16} />
        ) : (
          <Box component="span" sx={{ fontSize: '0.875rem' }}>
            {count}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}