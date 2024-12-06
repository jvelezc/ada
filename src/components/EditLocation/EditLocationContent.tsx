'use client';

import { Box } from '@mui/material';
import { LocationData } from '@/types';
import BasicInfoStep from '@/components/LocationWizard/BasicInfoStep';
import AccessibilityStep from '@/components/LocationWizard/AccessibilityStep';
import EntranceStep from '@/components/LocationWizard/EntranceStep';
import InteriorStep from '@/components/LocationWizard/InteriorStep';
import ReviewStep from '@/components/LocationWizard/ReviewStep';

interface EditLocationContentProps {
  activeStep: number;
  formData: Partial<LocationData>;
  onNext: (data: Partial<LocationData>) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  disabled?: boolean;
}

export default function EditLocationContent({
  activeStep,
  formData,
  onNext,
  onBack,
  onSubmit,
  disabled = false,
}: EditLocationContentProps) {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {activeStep === 0 && (
        <BasicInfoStep 
          onNext={onNext}
          initialData={formData}
       
        />
      )}
      {activeStep === 1 && (
        <AccessibilityStep
          onNext={onNext}
          onBack={onBack}
          initialData={formData}
        
        />
      )}
      {activeStep === 2 && (
        <EntranceStep
          onNext={onNext}
          onBack={onBack}
          initialData={formData}
        
        />
      )}
      {activeStep === 3 && (
        <InteriorStep
          onNext={onNext}
          onBack={onBack}
          initialData={formData}
          
        />
      )}
      {activeStep === 4 && (
        <ReviewStep
          data={formData}
          onBack={onBack}
          onSubmit={onSubmit}
          mode="edit"
          disabled={disabled}
        />
      )}
    </Box>
  );
}