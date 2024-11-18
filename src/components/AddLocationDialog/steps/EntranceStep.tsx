'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Stack,
} from '@mui/material';
import { LocationFormData } from '@/types';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';

interface EntranceStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function EntranceStep({ onNext, onBack, initialData }: EntranceStepProps) {
  const [hasSteps, setHasSteps] = useState<'yes' | 'no' | 'unknown'>(
    initialData?.has_steps ? 'yes' : 
    initialData?.step_status_unknown ? 'unknown' : 'no'
  );
  const [stepDescription, setStepDescription] = useState(initialData?.step_description || '');

  const handleSubmit = () => {
    onNext({
      has_steps: hasSteps === 'yes',
      step_description: stepDescription,
      step_status_unknown: hasSteps === 'unknown',
    });
  };

  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        Entrance Accessibility
      </Typography>

      <Stack spacing={3}>
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom>
            Are there any steps at the entrance?
          </Typography>
          <RadioGroup
            value={hasSteps}
            onChange={(e) => setHasSteps(e.target.value as typeof hasSteps)}
          >
            <FormControlLabel value="no" control={<Radio />} label="No steps" />
            <FormControlLabel value="yes" control={<Radio />} label="Has steps" />
            <FormControlLabel value="unknown" control={<Radio />} label="I don't know" />
          </RadioGroup>
        </FormControl>

        {hasSteps === 'yes' && (
          <TextField
            label="Describe the steps"
            value={stepDescription}
            onChange={(e) => setStepDescription(e.target.value)}
            multiline
            rows={2}
            placeholder="e.g., 'One small step at entrance, ramp available'"
            helperText="Include details about step height, number of steps, and any alternative access"
          />
        )}
      </Stack>

      <ButtonContainer 
        onNext={handleSubmit} 
        onBack={onBack}
      />
    </StepContainer>
  );
}