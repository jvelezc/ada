'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Alert } from '@mui/material';
import { LocationData } from '@/types';
import { fetchLocationById, updateLocationById } from '@/lib/supabase-server';
import EditLocationForm from '@/components/EditLocation/EditLocationForm';

export default function EditLocationPage({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLocationById(params.id);
        
        if (!data) {
          setError('Location not found');
          setTimeout(() => {
            router.push('/admin');
          }, 3000);
          return;
        }
        
        setLocation(data);
      } catch (error) {
        console.error('Error fetching location:', error);
        setError('Failed to load location. Redirecting to admin panel...');
        setTimeout(() => {
          router.push('/admin');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [params.id, router]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            maxWidth: 400,
            width: '100%',
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (loading || !location) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <EditLocationForm
      initialData={location}
      onSubmit={async (data) => {
        await updateLocationById(params.id, data);
      }}
    />
  );
}