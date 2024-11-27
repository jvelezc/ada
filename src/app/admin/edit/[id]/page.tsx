'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocationFormData } from '@/types';
import LocationWizard from '@/components/LocationWizard';
import { fetchLocationById, updateLocationById } from '@/lib/supabase-server';

type Params = Promise<{ id: string }>;

export default async function EditLocationPage({ params }: { params: Params }) {
  const { id } = await params;

  const router = useRouter();
  const [formData, setFormData] = useState<Partial<LocationFormData>>({});
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await fetchLocationById(id);
        if (data) {
          setFormData(data);
        }
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('Failed to load location data');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleSubmit = async (data: LocationFormData) => {
    try {
      await updateLocationById(id, data);
      router.push('/admin');
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to update location');
    }
  };

  const handleClose = () => {
    setExitDialogOpen(true);
  };

  if (loading) {
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconButton
            onClick={() => setExitDialogOpen(true)}
            sx={{ color: 'text.secondary' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">Edit Location</Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <LocationWizard
          open={true}
          onClose={handleClose}
          onSubmit={handleSubmit}
          initialData={formData}
          mode="edit"
        />
      </Container>

      <Dialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Exit Edit Mode?</DialogTitle>
        <DialogContent>
          Are you sure you want to exit? All your changes will be lost.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => router.push('/admin')} color="error">
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
