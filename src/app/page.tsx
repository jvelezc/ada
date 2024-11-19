'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import SideMenu from '@/components/SideMenu';

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(
  () => import('@/components/Map').then(mod => mod.default),
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    // User state will be updated by the auth state change listener
  };

  const handleLogout = () => {
    // User state will be updated by the auth state change listener
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <SideMenu 
        user={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
      <MapComponent />
    </Box>
  );
}