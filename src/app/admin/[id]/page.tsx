'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Alert } from '@mui/material';
import { LocationData } from '@/types';
import { supabase } from '@/lib/supabase';
import LocationWizard from '@/components/LocationWizard';

export default function EditLocation({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pending_locations')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Location not found');

      setLocation(data);
    } catch (err) {
      setError('Failed to fetch location');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      fetchLocation();
    };

    checkAuth();
  }, [fetchLocation, router]);

  const handleSubmit = async (data: LocationData) => {
    try {
      const { error } = await supabase
        .from('pending_locations')
        .update(data)
        .eq('id', params.id);

      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      setError('Failed to update location');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!location) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Location not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <LocationWizard
        initialData={location}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin')}
        mode="edit"
      />
    </Box>
  );
}