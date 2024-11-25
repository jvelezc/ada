'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        pt: { xs: 8, sm: 2 },
      }}
    >
      {children}
    </Box>
  );
}