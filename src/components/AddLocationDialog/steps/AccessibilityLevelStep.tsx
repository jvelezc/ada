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
  Paper,
} from '@mui/material';
import AccessibleIcon from '@mui/icons-material/Accessible';
import { LocationFormData } from '@/types';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';

interface AccessibilityLevelStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack: () => void;
  initialData?: Partial<LocationFormData>;
}

const accessibilityExamples = [
  {
    level: 'high',
    title: 'Fully Accessible',
    description: 'Wide entrances, ramps, automatic doors',
    icon: <AccessibleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
  },
  {
    level: 'medium',
    title: 'Partially Accessible',
    description: 'Has ramp but may require assistance',
    icon: <AccessibleIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
  },
  {
    level: 'low',
    title: 'Limited Accessibility',
    description: 'Multiple steps, narrow passages',
    icon: <AccessibleIcon sx={{ fontSize: 40, color: 'error.main' }} />,
  },
];

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

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Select the overall accessibility level
          </Typography>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 3,
          }}>
            {accessibilityExamples.map((example) => (
              <Paper
                key={example.level}
                onClick={() => setAccessibilityLevel(example.level)}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  textAlign: 'center',
                  border: theme => `3px solid ${
                    accessibilityLevel === example.level
                      ? theme.palette.primary.main
                      : 'transparent'
                  }`,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 4,
                  },
                }}
              >
                {example.icon}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  {example.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {example.description}
                </Typography>
              </Paper>
            ))}
          </Box>

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
        </Box>

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