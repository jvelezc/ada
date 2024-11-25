'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { initializeDatabase } from '@/lib/supabase';

const MapComponent = dynamic(
  () => import('@/components/Map'),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading map...
      </Box>
    ),
  }
);

export default function Home() {
  useEffect(() => {
    initializeDatabase().catch(console.error);
  }, []);

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <MapComponent />
    </Box>
  );
}