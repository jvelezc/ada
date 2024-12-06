'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('@/components/Map').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ 
        height: '100vh', 
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}>
        Loading map...
      </Box>
    ),
  }
);

export default function HomePage() {
  return (
    <Box sx={{ 
      height: '100vh',
      width: '100%',
      position: 'relative',
      bgcolor: 'background.default',
      overflow: 'hidden',
    }}>
      <MapComponent />
    </Box>
  );
}