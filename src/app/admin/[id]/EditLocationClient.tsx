// EditLocationClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Alert } from '@mui/material';
import { LocationData } from '@/types';
import { supabase } from '@/lib/supabase';
import LocationWizard from '@/components/LocationWizard';

interface EditLocationClientProps {
  initialData: LocationData;
}

export default function EditLocationClient({ initialData }: EditLocationClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: LocationData) => {
    // Your submit logic
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <LocationWizard
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin')}
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
