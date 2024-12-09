'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Alert } from '@mui/material';
import { LocationData, isApprovedLocation, isPendingLocation } from '@/types';
import { fetchLocationById } from '@/lib/supabase-server';
import ApprovedLocationEditor from '@/components/EditLocation/ApprovedLocationEditor';
import PendingLocationEditor from '@/components/EditLocation/PendingLocationEditor';

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
        setLocation(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load location';
        console.error('Error loading location:', error);
        setError(errorMessage);
        
        if (errorMessage === 'Location not found') {
          setTimeout(() => router.push('/admin'), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [params.id, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!location) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {isApprovedLocation(location) ? (
        <ApprovedLocationEditor location={location} />
      ) : isPendingLocation(location) ? (
        <PendingLocationEditor location={location} />
      ) : null}
    </Box>
  );
}