'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { LocationFormData } from '@/types';

interface AccessibilityStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function AccessibilityStep({ onNext, onBack, initialData }: AccessibilityStepProps) {
  const [accessibilityLevel, setAccessibilityLevel] = useState<'high' | 'medium' | 'low'>(
    initialData?.accessibility_level || 'high'
  );
  const [description, setDescription] = useState(initialData?.description || '');

  const handleNext = () => {
    onNext({
      accessibility_level: accessibilityLevel,
      description,
    });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="body1" color="text.secondary">
        Tell us about the accessibility features of this location.
      </Typography>

      <FormControl component="fieldset">
        <Typography variant="subtitle2" gutterBottom>
          Overall Accessibility Level
        </Typography>
        <RadioGroup
          value={accessibilityLevel}
          onChange={(e) => setAccessibilityLevel(e.target.value as 'high' | 'medium' | 'low')}
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
        </RadioGroup>
      </FormControl>

      <TextField
        label="Accessibility Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        fullWidth
        placeholder="Describe the accessibility features (e.g., ramps, automatic doors, etc.)"
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Stack>
  );
}