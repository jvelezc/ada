'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Alert } from '@mui/material';
import { LocationData, BaseLocation } from '@/types';
import { updateLocationById } from '@/lib/supabase-server';
import LocationWizard from '@/components/LocationWizard';

interface EditLocationClientProps {
  initialData: LocationData;
}

export default function EditLocationClient({ initialData }: EditLocationClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const handleSubmit = async (data: BaseLocation) => {
    try {
      await updateLocationById(initialData.id!.toString(), data);
      setOpen(false);
      router.push('/admin');
      return true;
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to update location');
      return false;
    }
  };

  const handleClose = () => {
    setOpen(false);
    router.push('/admin');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <LocationWizard
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={initialData}
        mode="edit"
      />
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </Box>
  );
}