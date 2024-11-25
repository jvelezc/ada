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
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocationFormData, LocationData } from '@/types';
import { supabase } from '@/lib/supabase';
import BasicInfoStep from '@/components/WizardSteps/BasicInfoStep';
import AccessibilityStep from '@/components/WizardSteps/AccessibilityStep';
import EntranceStep from '@/components/WizardSteps/EntranceStep';
import InteriorStep from '@/components/WizardSteps/InteriorStep';
import ReviewStep from '@/components/WizardSteps/ReviewStep';

const steps = [
  { label: 'Basic Info', description: 'Location details' },
  { label: 'Accessibility', description: 'Overall accessibility' },
  { label: 'Entrance', description: 'Steps and doors' },
  { label: 'Interior', description: 'Inside features' },
  { label: 'Review', description: 'Review and submit' },
];

export default function EditLocationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<LocationFormData>>({});
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
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
  }, [params.id]);

  const handleNext = (stepData: Partial<LocationFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setActiveStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('locations')
        .update(formData)
        .eq('id', params.id);

      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to update location');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        pt: 2,
      }}
    >
      <Container maxWidth="lg">
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
          <Box>
            <Typography variant="h5" gutterBottom>
              Edit Location
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {steps[activeStep].description}
            </Typography>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                mt: 1,
                color: 'text.secondary',
                '&.Mui-active': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
              },
            }}
          >
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Paper 
          sx={{ 
            p: 4,
            borderRadius: 2,
            maxWidth: 800,
            mx: 'auto',
            mb: 4,
          }}
        >
          {activeStep === 0 && (
            <BasicInfoStep 
              onNext={handleNext}
              initialData={formData}
            />
          )}
          {activeStep === 1 && (
            <AccessibilityStep
              onNext={handleNext}
              onBack={handleBack}
              initialData={formData}
            />
          )}
          {activeStep === 2 && (
            <EntranceStep
              onNext={handleNext}
              onBack={handleBack}
              initialData={formData}
            />
          )}
          {activeStep === 3 && (
            <InteriorStep
              onNext={handleNext}
              onBack={handleBack}
              initialData={formData}
            />
          )}
          {activeStep === 4 && (
            <ReviewStep
              data={formData}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}
        </Paper>
      </Container>

      <Dialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Exit Edit Mode?</DialogTitle>
        <DialogContent>
          Are you sure you want to exit? All your changes will be lost.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => router.push('/admin')} 
            color="error"
          >
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}