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
  Paper,
  ImageList,
  ImageListItem,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import { LocationFormData } from '@/types';
import InfoIcon from '@mui/icons-material/Info';

interface AccessibilityStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack?: () => void;
}

const accessibilityExamples = [
  {
    level: 'high',
    title: 'Fully Accessible',
    description: 'Wide entrances, ramps, automatic doors',
    image: '/images/accessibility/fully-accessible.jpg',
  },
  {
    level: 'medium',
    title: 'Partially Accessible',
    description: 'Has ramp but may require assistance',
    image: '/images/accessibility/partially-accessible.jpg',
  },
  {
    level: 'low',
    title: 'Limited Accessibility',
    description: 'Multiple steps, narrow passages',
    image: '/images/accessibility/limited-accessible.jpg',
  },
];

const stepExamples = [
  {
    type: 'no_steps',
    title: 'No Steps',
    description: 'Level entrance or proper ramp',
    image: '/images/steps/no-steps.jpg',
  },
  {
    type: 'has_steps',
    title: 'Has Steps',
    description: 'One or more steps present',
    image: '/images/steps/has-steps.jpg',
  },
];

export default function AccessibilityStep({ onNext, onBack }: AccessibilityStepProps) {
  const [accessibilityLevel, setAccessibilityLevel] = useState<'high' | 'medium' | 'low'>('high');
  const [hasSteps, setHasSteps] = useState(false);
  const [stepDescription, setStepDescription] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onNext({
      accessibility_level: accessibilityLevel,
      has_steps: hasSteps,
      step_description: stepDescription,
      description,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tell us about the accessibility ♿
      </Typography>

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Overall accessibility level
            <Tooltip title="Click examples below for more details" arrow>
              <InfoIcon fontSize="small" color="primary" />
            </Tooltip>
          </Typography>

          <ImageList cols={3} gap={16} sx={{ mb: 2 }}>
            {accessibilityExamples.map((example) => (
              <ImageListItem 
                key={example.level}
                onClick={() => setAccessibilityLevel(example.level as 'high' | 'medium' | 'low')}
                sx={{ 
                  cursor: 'pointer',
                  border: theme => `3px solid ${accessibilityLevel === example.level ? 
                    theme.palette.primary.main : 'transparent'}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Paper sx={{ height: '100%', p: 1 }}>
                  <Box sx={{ position: 'relative', height: 120, mb: 1 }}>
                    <Image
                      src={example.image}
                      alt={example.title}
                      fill
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {example.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {example.description}
                  </Typography>
                </Paper>
              </ImageListItem>
            ))}
          </ImageList>

          <FormControl component="fieldset">
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
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Are there any steps?
          </Typography>

          <ImageList cols={2} gap={16} sx={{ mb: 2 }}>
            {stepExamples.map((example) => (
              <ImageListItem 
                key={example.type}
                onClick={() => setHasSteps(example.type === 'has_steps')}
                sx={{ 
                  cursor: 'pointer',
                  border: theme => `3px solid ${
                    (example.type === 'has_steps' && hasSteps) || 
                    (example.type === 'no_steps' && !hasSteps) 
                      ? theme.palette.primary.main 
                      : 'transparent'
                  }`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Paper sx={{ height: '100%', p: 1 }}>
                  <Box sx={{ position: 'relative', height: 120, mb: 1 }}>
                    <Image
                      src={example.image}
                      alt={example.title}
                      fill
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {example.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {example.description}
                  </Typography>
                </Paper>
              </ImageListItem>
            ))}
          </ImageList>

          <FormControl component="fieldset">
            <RadioGroup
              value={hasSteps.toString()}
              onChange={(e) => setHasSteps(e.target.value === 'true')}
            >
              <FormControlLabel value="false" control={<Radio />} label="No steps" />
              <FormControlLabel value="true" control={<Radio />} label="Yes, has steps" />
            </RadioGroup>
          </FormControl>
        </Box>

        {hasSteps && (
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

        <TextField
          label="Additional accessibility details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          placeholder="e.g., 'Wide doorways, automatic doors, accessible parking nearby'"
          helperText="Include any other relevant accessibility information"
        />
      </Stack>
    </Box>
  );
}