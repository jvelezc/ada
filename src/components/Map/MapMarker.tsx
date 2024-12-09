'use client';

import { useState, useEffect } from 'react';
import { Box, Badge } from '@mui/material';
import { LocationData } from '@/types';
import { getAccessibilityColor } from '@/utils/accessibility';
import { useLocationPhotoCount } from '@/hooks/useLocationPhotoCount';

interface MapMarkerProps {
  location: LocationData;
  onClick: () => void;
}

export default function MapMarker({ location, onClick }: MapMarkerProps) {
  const { count } = useLocationPhotoCount(location.id!);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setShowBadge(count > 0);
  }, [count]);

  return (
    <Badge
      badgeContent={showBadge ? count : 0}
      color="primary"
      overlap="circular"
      invisible={!showBadge}
      sx={{
        '& .MuiBadge-badge': {
          bgcolor: 'primary.main',
          color: 'white',
          minWidth: 20,
          height: 20,
          fontSize: '0.75rem',
        },
      }}
    >
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        sx={{
          width: 24,
          height: 24,
          bgcolor: getAccessibilityColor(location.accessibility_level),
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: 2,
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.2)',
          },
        }}
      />
    </Badge>
  );
}