'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { LocationData } from '@/types';
import { fetchLocationById, updateLocationById } from '@/lib/supabase-server';
import EditLocationForm from '@/components/EditLocation/EditLocationForm';

export default function EditLocationPage({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const data = await fetchLocationById(params.id);
        setLocation(data);
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [params.id]);

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