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
  Switch,
  Divider,
} from '@mui/material';
import ElevatorIcon from '@mui/icons-material/Elevator';
import StraightIcon from '@mui/icons-material/Straight';
import GridOnIcon from '@mui/icons-material/GridOn'; // Changed from FloorIcon to GridOnIcon
import { LocationFormData } from '@/types';

interface InteriorStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function InteriorStep({ onNext, onBack, initialData }: InteriorStepProps) {
  const [hasElevator, setHasElevator] = useState(initialData?.has_elevator || false);
  const [hasWidePathways, setHasWidePathways] = useState(initialData?.has_wide_pathways ?? true);
  const [floorType, setFloorType] = useState<'smooth' | 'carpet' | 'uneven'>(
    initialData?.floor_type || 'smooth'
  );
  const [interiorNotes, setInteriorNotes] = useState(initialData?.interior_notes || '');

  const handleNext = () => {
    onNext({
      has_elevator: hasElevator,
      has_wide_pathways: hasWidePathways,
      floor_type: floorType,
      interior_notes: interiorNotes,
    });
  };

  return (
    <Stack spacing={4}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ElevatorIcon color="primary" />
            Elevator Access
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={hasElevator}
                onChange={(e) => setHasElevator(e.target.checked)}
                color="primary"
              />
            }
            label="Has elevator (for multi-level buildings)"
          />
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StraightIcon color="primary" />
            Pathway Width
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={hasWidePathways}
                onChange={(e) => setHasWidePathways(e.target.checked)}
                color="primary"
              />
            }
            label="Wide pathways throughout"
          />
          <Typography variant="body2" color="text.secondary">
            Wide pathways allow easy navigation for wheelchairs and mobility devices
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GridOnIcon color="primary" />
            Floor Type
          </Typography>

          <FormControl component="fieldset">
            <RadioGroup
              value={floorType}
              onChange={(e) => setFloorType(e.target.value as typeof floorType)}
            >
              <FormControlLabel 
                value="smooth" 
                control={<Radio />} 
                label="Smooth (hardwood, tile, etc.)"
              />
              <FormControlLabel 
                value="carpet" 
                control={<Radio />} 
                label="Low-pile carpet"
              />
              <FormControlLabel 
                value="uneven" 
                control={<Radio />} 
                label="Uneven surface"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Additional interior notes"
            value={interiorNotes}
            onChange={(e) => setInteriorNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="e.g., 'Some narrow spots in back area, good turning space in main area'"
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