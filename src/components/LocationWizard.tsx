'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  LinearProgress,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BaseLocation, LocationData } from '@/types';
import BasicInfoStep from './WizardSteps/BasicInfoStep';
import AccessibilityStep from './WizardSteps/AccessibilityStep';
import EntranceStep from './WizardSteps/EntranceStep';
import ReviewStep from './WizardSteps/ReviewStep';

interface LocationWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BaseLocation) => Promise<boolean>;
  initialData?: Partial<LocationData>;
  mode?: 'create' | 'edit';
}

const steps = [
  { label: 'Basic Info', description: 'Location details' },
  { label: 'Accessibility', description: 'Accessibility features' },
  { label: 'Entrance', description: 'Entrance information' },
  { label: 'Review', description: 'Review and submit' },
];

export default function LocationWizard({ 
  open, 
  onClose, 
  onSubmit, 
  initialData,
  mode = 'create' 
}: LocationWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<BaseLocation>>(initialData || {});

  const handleNext = (stepData: Partial<BaseLocation>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    setFormData({});
    onClose();
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh',
          borderRadius: 2,
          background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {steps[activeStep].label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {steps[activeStep].description}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 4,
            bgcolor: 'rgba(255,255,255,0.1)',
          }}
        />

        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            bgcolor: 'transparent',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: 'text.secondary',
                '&.Mui-active': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
              },
              '& .MuiStepIcon-root': {
                color: 'action.disabled',
                '&.Mui-active': {
                  color: 'primary.main',
                },
                '&.Mui-completed': {
                  color: 'primary.dark',
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

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
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
              <ReviewStep
                data={formData}
                onBack={handleBack}
                onSubmit={() => onSubmit(formData as BaseLocation)}
                mode={mode}
              />
            )}
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}