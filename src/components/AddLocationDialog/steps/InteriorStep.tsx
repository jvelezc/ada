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
  Checkbox,
  Stack,
} from '@mui/material';
import { LocationFormData } from '@/types';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';

interface InteriorStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function InteriorStep({ onNext, onBack, initialData }: InteriorStepProps) {
  const [hasElevator, setHasElevator] = useState(initialData?.has_elevator || false);
  const [hasWidePathways, setHasWidePathways] = useState(initialData?.has_wide_pathways ?? true);
  const [floorType, setFloorType] = useState<string | null>(initialData?.floor_type || 'smooth');
  const [notes, setNotes] = useState(initialData?.interior_notes || '');

  useEffect(() => {
    if (initialData) {
      setHasElevator(initialData.has_elevator || false);
      setHasWidePathways(initialData.has_wide_pathways ?? true);
      setFloorType(initialData.floor_type || 'smooth');
      setNotes(initialData.interior_notes || '');
    }
  }, [initialData]);

  const handleSubmit = () => {
    onNext({
      has_elevator: hasElevator,
      has_wide_pathways: hasWidePathways,
      floor_type: floorType as 'smooth' | 'carpet' | 'uneven' | undefined,
      interior_notes: notes,
    });
  };

  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        Interior Accessibility 🏗️
      </Typography>

      <Stack spacing={4}>
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom>
            Floor Type
          </Typography>
          <RadioGroup
            value={floorType || ''}
            onChange={(e) => setFloorType(e.target.value)}
          >
            <FormControlLabel 
              value="smooth" 
              control={<Radio />} 
              label="Smooth and level"
            />
            <FormControlLabel 
              value="carpet" 
              control={<Radio />} 
              label="Low-pile carpet"
            />
            <FormControlLabel 
              value="uneven" 
              control={<Radio />} 
              label="Uneven or difficult surface"
            />
          </RadioGroup>
        </FormControl>

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasElevator}
                onChange={(e) => setHasElevator(e.target.checked)}
              />
            }
            label="Has elevator (if multi-level)"
          />
        </Box>

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasWidePathways}
                onChange={(e) => setHasWidePathways(e.target.checked)}
              />
            }
            label="Wide pathways throughout"
          />
        </Box>

        <TextField
          label="Additional interior notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={2}
          placeholder="e.g., 'Some narrow spots in back area, good turning space in main area'"
        />
      </Stack>

      <ButtonContainer 
        onNext={handleSubmit} 
        onBack={onBack}
      />
    </StepContainer>
  );
}