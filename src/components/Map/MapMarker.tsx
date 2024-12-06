'use client';

import { Box } from '@mui/material';
import { LocationData } from '@/types';

interface MapMarkerProps {
  location: LocationData;
  onClick: () => void;
}

export default function MapMarker({ location, onClick }: MapMarkerProps) {
  return (
    <Box
      onClick={(e) => {
        e.stopPropagation(); // Prevent the click event from propagating to the parent.stopPropagation();
        onClick();
      }}
      sx={{
        width: 24,
        height: 24,
        bgcolor: location.accessibility_level === 'high' ? '#4CAF50' :
                location.accessibility_level === 'medium' ? '#FFC107' : '#F44336',
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
  );
}