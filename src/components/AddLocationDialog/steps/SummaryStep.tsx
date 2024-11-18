'use client';

import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import { LocationFormData } from '@/types';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';

interface SummaryStepProps {
  data: Partial<LocationFormData>;
  onBack: () => void;
  onSubmit: () => void;
  mode?: 'create' | 'edit';
}

export default function SummaryStep({ data, onBack, onSubmit, mode = 'create' }: SummaryStepProps) {
  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        {mode === 'create' ? 'Review Your Submission' : 'Review Your Changes'}
      </Typography>

      {/* Rest of the component remains the same... */}

      <ButtonContainer 
        onNext={onSubmit} 
        onBack={onBack}
        nextLabel={mode === 'create' ? 'Submit Location' : 'Save Changes'}
      />
    </StepContainer>
  );
}