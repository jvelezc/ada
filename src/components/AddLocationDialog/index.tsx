'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocationFormData } from '@/types';
import WelcomeStep from './steps/WelcomeStep';
import BasicInfoStep from './steps/BasicInfoStep';
import AccessibilityStep from './steps/AccessibilityStep';
import RestroomStep from './steps/RestroomStep';
import DogFriendlyStep from './steps/DogFriendlyStep';
import PhotosStep from './steps/PhotosStep';
import SummaryStep from './steps/SummaryStep';

interface AddLocationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => Promise<void>;
}

export default function AddLocationDialog({ open, onClose, onSubmit }: AddLocationDialogProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<LocationFormData>>({});

  const totalSteps = 7;
  const progress = (step / (totalSteps - 1)) * 100;

  const handleNext = (data: Partial<LocationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (formData) {
      await onSubmit(formData as LocationFormData);
      onClose();
    }
  };

  const steps = [
    <WelcomeStep key="welcome" onNext={() => setStep(1)} />,
    <BasicInfoStep key="basic" onNext={handleNext} onBack={handleBack} />,
    <AccessibilityStep key="accessibility" onNext={handleNext} onBack={handleBack} />,
    <RestroomStep key="restroom" onNext={handleNext} onBack={handleBack} />,
    <DogFriendlyStep key="dog" onNext={handleNext} onBack={handleBack} />,
    <PhotosStep key="photos" onNext={handleNext} onBack={handleBack} />,
    <SummaryStep
      key="summary"
      data={formData}
      onBack={handleBack}
      onSubmit={handleSubmit}
    />,
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 2 }}
        />

        <DialogContent>
          {steps[step]}
        </DialogContent>
      </Box>
    </Dialog>
  );
}