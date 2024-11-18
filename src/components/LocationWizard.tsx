'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { LocationData } from '@/types';
import BasicInfoStep from './AddLocationDialog/steps/BasicInfoStep';
import AccessibilityLevelStep from './AddLocationDialog/steps/AccessibilityLevelStep';
import EntranceStep from './AddLocationDialog/steps/EntranceStep';
import DoorwayStep from './AddLocationDialog/steps/DoorwayStep';
import InteriorStep from './AddLocationDialog/steps/InteriorStep';
import ParkingStep from './AddLocationDialog/steps/ParkingStep';
import RestroomStep from './AddLocationDialog/steps/RestroomStep';
import DogFriendlyStep from './AddLocationDialog/steps/DogFriendlyStep';
import PhotosStep from './AddLocationDialog/steps/PhotosStep';
import SummaryStep from './AddLocationDialog/steps/SummaryStep';

const steps = [
  'Basic Info',
  'Accessibility',
  'Entrance',
  'Doorway',
  'Interior',
  'Parking',
  'Restroom',
  'Dog Friendly',
  'Photos',
  'Review',
];

interface LocationWizardProps {
  initialData?: LocationData;
  onSubmit: (data: LocationData) => void;
  onCancel: () => void;
  mode?: 'create' | 'edit';
}

export default function LocationWizard({ 
  initialData, 
  onSubmit, 
  onCancel,
  mode = 'create' 
}: LocationWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<LocationData>>(initialData || {});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleNext = (data: Partial<LocationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setActiveStep((prevStep) => prevStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    try {
      onSubmit(formData as LocationData);
    } catch (err) {
      setError('Failed to submit location');
      console.error('Error:', err);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          {mode === 'create' ? 'Add New Location' : 'Edit Location'}
        </Typography>

        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{ mt: 3 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {activeStep === 0 && (
          <BasicInfoStep 
            onNext={handleNext} 
            onBack={onCancel}
            initialData={formData}
          />
        )}
        {activeStep === 1 && (
          <AccessibilityLevelStep 
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
          <DoorwayStep 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={formData}
          />
        )}
        {activeStep === 4 && (
          <InteriorStep 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={formData}
          />
        )}
        {activeStep === 5 && (
          <ParkingStep 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={formData}
          />
        )}
        {activeStep === 6 && (
          <RestroomStep 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={formData}
          />
        )}
        {activeStep === 7 && (
          <DogFriendlyStep 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={formData}
          />
        )}
        {activeStep === 8 && (
          <PhotosStep 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={formData}
          />
        )}
        {activeStep === 9 && (
          <SummaryStep
            data={formData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            mode={mode}
          />
        )}
      </Paper>
    </Box>
  );
}