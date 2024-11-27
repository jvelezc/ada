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
  Paper,
  Divider,
  Slider,
  Tooltip,
} from '@mui/material';
import StairsIcon from '@mui/icons-material/Stairs';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import { LocationFormData } from '@/types';

interface EntranceStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack: () => void;
  initialData?: Partial<LocationFormData>;
}

const doorWidthMarks = [
  { value: 24, label: '24"' },
  { value: 32, label: '32"' },
  { value: 36, label: '36"' },
  { value: 42, label: '42"' },
];

export default function EntranceStep({ onNext, onBack, initialData }: EntranceStepProps) {
  const [hasSteps, setHasSteps] = useState<'yes' | 'no' | 'unknown'>(
    initialData?.has_steps ? 'yes' : 
    initialData?.step_status_unknown ? 'unknown' : 'no'
  );
  const [stepDescription, setStepDescription] = useState(initialData?.step_description || '');
  const [doorWidth, setDoorWidth] = useState<number>(36);
  const [doorType, setDoorType] = useState<'automatic' | 'manual_easy' | 'manual_heavy'>('automatic');
  const [doorNotes, setDoorNotes] = useState('');

  const getDoorWidthCategory = (width: number) => {
    if (width >= 36) return 'wide';
    if (width >= 32) return 'standard';
    return 'narrow';
  };

  const handleNext = () => {
    onNext({
      has_steps: hasSteps === 'yes',
      step_status_unknown: hasSteps === 'unknown',
      step_description: stepDescription,
      door_width: getDoorWidthCategory(doorWidth),
      door_width_inches: doorWidth,
      door_type: doorType,
      doorway_notes: doorNotes,
    });
  };

  return (
    <Stack spacing={4}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StairsIcon color="primary" />
            Entrance Steps
          </Typography>

          <FormControl component="fieldset">
            <Typography variant="subtitle2" gutterBottom>
              Are there steps at the entrance?
            </Typography>
            <RadioGroup
              value={hasSteps}
              onChange={(e) => setHasSteps(e.target.value as typeof hasSteps)}
            >
              <FormControlLabel value="no" control={<Radio />} label="No steps (level entrance)" />
              <FormControlLabel value="yes" control={<Radio />} label="Yes, has steps" />
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
              fullWidth
              placeholder="e.g., '2 steps at entrance, each about 6 inches high'"
            />
          )}
        </Stack>
      </Paper>

      <Divider />

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DoorFrontIcon color="primary" />
            Doorway Details
          </Typography>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Door Width (in inches)
            </Typography>
            <Slider
              value={doorWidth}
              onChange={(_e, newValue) => setDoorWidth(newValue as number)}
              min={24}
              max={42}
              step={1}
              marks={doorWidthMarks}
              valueLabelDisplay="on"
              valueLabelFormat={(value) => `${value}"`}
            />
            <Typography 
              variant="body2" 
              color={doorWidth >= 32 ? 'success.main' : 'warning.main'}
              sx={{ mt: 1 }}
            >
              {doorWidth >= 36 ? '✨ Excellent accessibility' :
               doorWidth >= 32 ? '✓ Meets accessibility standards' :
               '⚠️ Below accessibility standards'}
            </Typography>
          </Box>

          <FormControl component="fieldset">
            <Typography variant="subtitle2" gutterBottom>
              Door Type
            </Typography>
            <RadioGroup
              value={doorType}
              onChange={(e) => setDoorType(e.target.value as typeof doorType)}
            >
              <FormControlLabel 
                value="automatic" 
                control={<Radio />} 
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <DoorSlidingIcon />
                    <span>Automatic door</span>
                  </Stack>
                }
              />
              <FormControlLabel 
                value="manual_easy" 
                control={<Radio />} 
                label="Manual door (easy to open)"
              />
              <FormControlLabel 
                value="manual_heavy" 
                control={<Radio />} 
                label="Manual door (heavy/requires force)"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Additional doorway notes"
            value={doorNotes}
            onChange={(e) => setDoorNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
            placeholder="e.g., 'Push button available, door stays open for 10 seconds'"
          />
        </Stack>
      </Paper>

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