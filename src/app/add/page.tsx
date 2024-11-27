'use client';

import { useState } from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocationFormData } from '@/types';
import BasicInfoStep from '@/components/LocationWizard/BasicInfoStep';
import AccessibilityStep from '@/components/LocationWizard/AccessibilityStep';
import EntranceStep from '@/components/LocationWizard/EntranceStep';
import InteriorStep from '@/components/LocationWizard/InteriorStep';
import ReviewStep from '@/components/LocationWizard/ReviewStep';
import SuccessConfirmation from '@/components/SuccessConfirmation';
import { addLocation } from '@/lib/supabase-server';

const steps = [
  { label: 'Basic Info', description: 'Location details' },
  { label: 'Accessibility', description: 'Overall accessibility' },
  { label: 'Entrance', description: 'Steps and doors' },
  { label: 'Interior', description: 'Inside features' },
  { label: 'Review', description: 'Review and submit' },
];

export default function AddLocationPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<LocationFormData>>({});
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      await addLocation(formData as LocationFormData);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting location:', error);
    }
  };

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
              Add New Location
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {steps[activeStep].description}
            </Typography>
          </Box>
        </Paper>

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
        <DialogTitle>Exit Location Wizard?</DialogTitle>
        <DialogContent>
          Are you sure you want to exit? All your progress will be lost.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => router.push('/')} 
            color="error"
          >
            Exit
          </Button>
        </DialogActions>
      </Dialog>

      <SuccessConfirmation
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </Box>
  );
}