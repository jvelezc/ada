'use client';

import { useState } from 'react';
import { Box, Paper, Alert, CircularProgress, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { LocationData } from '@/types';
import EditLocationHeader from './EditLocationHeader';
import EditLocationStepper from './EditLocationStepper';
import EditLocationContent from './EditLocationContent';
import ExitDialog from './ExitDialog';
import SuccessDialog from './SuccessDialog';
import PhotoManager from '../LocationPhotos/PhotoManager';
import { useRouter } from 'next/navigation';

interface EditLocationFormProps {
  initialData: LocationData;
  onSubmit: (data: LocationData) => Promise<boolean>;
}

export default function EditLocationForm({ initialData, onSubmit }: EditLocationFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<LocationData>>(initialData);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleNext = (stepData: Partial<LocationData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setActiveStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExit = () => {
    setExitDialogOpen(true);
  };

  const handleExitConfirm = () => {
    router.push('/admin');
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const success = await onSubmit(formData as LocationData);
      if (success) {
        setSuccessDialogOpen(true);
      }
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to update location. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <EditLocationHeader
          activeStep={activeStep}
          onExit={handleExit}
          onManagePhotos={() => setPhotoDialogOpen(true)}
        />
        <EditLocationStepper activeStep={activeStep} />
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 2, position: 'relative' }}>
        {submitting && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              borderRadius: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <EditLocationContent
          activeStep={activeStep}
          formData={formData}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
          disabled={submitting}
        />
      </Paper>

      <ExitDialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
        onConfirm={handleExitConfirm}
      />

      <SuccessDialog
        open={successDialogOpen}
        onClose={() => {
          setSuccessDialogOpen(false);
          router.push('/admin');
        }}
      />

      <Dialog
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Manage Location Photos</DialogTitle>
        <DialogContent>
          {initialData.id && (
            <PhotoManager
              locationId={initialData.id}
              editable={true}
              onClose={() => setPhotoDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}