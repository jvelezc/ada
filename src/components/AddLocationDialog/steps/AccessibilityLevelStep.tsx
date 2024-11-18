'use client';

import { useState, useEffect } from 'react';
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

interface AccessibilityLevelStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function AccessibilityLevelStep({ onNext, onBack, initialData }: AccessibilityLevelStepProps) {
  const [accessibilityLevel, setAccessibilityLevel] = useState<'high' | 'medium' | 'low' | 'unknown'>(
    initialData?.accessibility_status_unknown ? 'unknown' :
    initialData?.accessibility_level || 'unknown'
  );
  const [description, setDescription] = useState(initialData?.description || '');

  useEffect(() => {
    if (initialData) {
      setAccessibilityLevel(
        initialData.accessibility_status_unknown ? 'unknown' :
        initialData.accessibility_level || 'unknown'
      );
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = () => {
    onNext({
      accessibility_level: accessibilityLevel === 'unknown' ? undefined : accessibilityLevel,
      accessibility_status_unknown: accessibilityLevel === 'unknown',
      description,
    });
  };

  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        Overall Accessibility Level
      </Typography>

      <Stack spacing={3}>
        <FormControl component="fieldset">
          <RadioGroup
            value={accessibilityLevel}
            onChange={(e) => setAccessibilityLevel(e.target.value as typeof accessibilityLevel)}
          >
            <FormControlLabel
              value="high"
              control={<Radio />}
              label="Fully accessible (no barriers)"
            />
            <FormControlLabel
              value="medium"
              control={<Radio />}
              label="Partially accessible (some barriers)"
            />
            <FormControlLabel
              value="low"
              control={<Radio />}
              label="Limited accessibility (significant barriers)"
            />
            <FormControlLabel
              value="unknown"
              control={<Radio />}
              label="I don't know"
            />
          </RadioGroup>
        </FormControl>

        {accessibilityLevel !== 'unknown' && (
          <TextField
            label="Additional accessibility details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            placeholder="e.g., 'Wide doorways, automatic doors, accessible parking nearby'"
          />
        )}
      </Stack>

      <ButtonContainer onNext={handleSubmit} onBack={onBack} />
    </StepContainer>
  );
}