'use client';

import { Box } from '@mui/material';
import SideMenu from '@/components/SideMenu';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <Box sx={{ display: 'flex' }}>
      <SideMenu 
        user={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          ml: { xs: 0, sm: 8 },
          pt: { xs: 8, sm: 2 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}