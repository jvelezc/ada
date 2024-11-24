'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { initializeDatabase } from '@/lib/supabase';

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(
  () => import('@/components/Map'),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ height: '100vh', width: '100vw', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading map...
      </Box>
    ),
  }
);

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Initialize database when the app loads
    initializeDatabase().catch(console.error);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <MapComponent />
    </Box>
  );
}