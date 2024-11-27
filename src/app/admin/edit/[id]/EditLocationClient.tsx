'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Alert } from '@mui/material';
import { LocationData } from '@/types';
import LocationWizard from '@/components/LocationWizard';
import { supabase } from '@/lib/supabase-client';

interface EditLocationClientProps {
  initialData: LocationData;
}

export default function EditLocationClient({ initialData }: EditLocationClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const handleSubmit = async (data: LocationData) => {
    try {
      const { error } = await supabase
        .from('locations')
        .update(data)
        .eq('id', initialData.id);

      if (error) throw error;
      setOpen(false);
      router.push('/admin');
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to update location');
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