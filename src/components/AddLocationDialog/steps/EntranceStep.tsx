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
  Icon,
} from '@mui/material';
import StairsIcon from '@mui/icons-material/Stairs';
import AccessibleIcon from '@mui/icons-material/Accessible';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { LocationFormData } from '@/types';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';

interface EntranceStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack: () => void;
  initialData?: Partial<LocationFormData>;
}

const stepExamples = [
  {
    type: 'no_steps',
    title: 'Level Entrance',
    description: 'Completely flat entrance or proper ramp',
    icon: <AccessibleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
  },
  {
    type: 'has_steps',
    title: 'Steps Present',
    description: 'One or more steps at entrance',
    icon: <StairsIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
  },
  {
    type: 'unknown',
    title: 'Not Sure',
    description: "I don't know or can't verify",
    icon: <HelpOutlineIcon sx={{ fontSize: 40, color: 'info.main' }} />,
  },
];

export default function EntranceStep({ onNext, onBack, initialData }: EntranceStepProps) {
  const [hasSteps, setHasSteps] = useState<'yes' | 'no' | 'unknown'>(
    initialData?.has_steps ? 'yes' : 
    initialData?.step_status_unknown ? 'unknown' : 'no'
  );
  const [stepDescription, setStepDescription] = useState(initialData?.step_description || '');

  useEffect(() => {
    if (initialData) {
      setHasSteps(
        initialData.has_steps ? 'yes' : 
        initialData.step_status_unknown ? 'unknown' : 'no'
      );
      setStepDescription(initialData.step_description || '');
    }
  }, [initialData]);

  const handleStepTypeClick = (type: string) => {
    switch (type) {
      case 'no_steps':
        setHasSteps('no');
        break;
      case 'has_steps':
        setHasSteps('yes');
        break;
      case 'unknown':
        setHasSteps('unknown');
        break;
    }
  };

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

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Are there any steps at the entrance?
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 3,
          }}>
            {stepExamples.map((example) => (
              <Paper
                key={example.type}
                onClick={() => handleStepTypeClick(example.type)}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  textAlign: 'center',
                  border: theme => `3px solid ${
                    (example.type === 'has_steps' && hasSteps === 'yes') ||
                    (example.type === 'no_steps' && hasSteps === 'no') ||
                    (example.type === 'unknown' && hasSteps === 'unknown')
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
              value={hasSteps}
              onChange={(e) => setHasSteps(e.target.value as typeof hasSteps)}
            >
              <FormControlLabel value="no" control={<Radio />} label="No steps" />
              <FormControlLabel value="yes" control={<Radio />} label="Has steps" />
              <FormControlLabel value="unknown" control={<Radio />} label="I don't know" />
            </RadioGroup>
          </FormControl>
        </Box>

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