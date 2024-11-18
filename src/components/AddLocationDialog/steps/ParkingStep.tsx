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

interface ParkingStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack?: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function ParkingStep({ onNext, onBack, initialData }: ParkingStepProps) {
  const [parkingType, setParkingType] = useState<'dedicated' | 'street' | 'none' | 'unknown'>(
    initialData?.parking_type || 
    initialData?.parking_status_unknown ? 'unknown' : 'none'
  );
  const [hasLoadingZone, setHasLoadingZone] = useState(initialData?.has_loading_zone || false);
  const [notes, setNotes] = useState(initialData?.parking_notes || '');

  useEffect(() => {
    if (initialData) {
      setParkingType(
        initialData.parking_type || 
        initialData.parking_status_unknown ? 'unknown' : 'none'
      );
      setHasLoadingZone(initialData.has_loading_zone || false);
      setNotes(initialData.parking_notes || '');
    }
  }, [initialData]);

  const handleSubmit = () => {
    onNext({
      has_accessible_parking: parkingType !== 'none' && parkingType !== 'unknown',
      parking_type: parkingType === 'unknown' || parkingType === 'none' ? undefined : parkingType,
      parking_status_unknown: parkingType === 'unknown',
      has_loading_zone: hasLoadingZone,
      parking_notes: notes,
    });
  };

  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        Parking Accessibility 🅿️
      </Typography>

      <Stack spacing={3}>
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom>
            What type of accessible parking is available?
          </Typography>
          <RadioGroup
            value={parkingType}
            onChange={(e) => setParkingType(e.target.value as typeof parkingType)}
          >
            <FormControlLabel 
              value="dedicated" 
              control={<Radio />} 
              label="Dedicated accessible spots"
            />
            <FormControlLabel 
              value="street" 
              control={<Radio />} 
              label="Street parking with curb cuts"
            />
            <FormControlLabel 
              value="none" 
              control={<Radio />} 
              label="No accessible parking"
            />
            <FormControlLabel 
              value="unknown" 
              control={<Radio />} 
              label="I don't know"
            />
          </RadioGroup>
        </FormControl>

        {parkingType !== 'unknown' && parkingType !== 'none' && (
          <FormControl component="fieldset">
            <Typography variant="subtitle2" gutterBottom>
              Loading Zone
            </Typography>
            <RadioGroup
              value={hasLoadingZone.toString()}
              onChange={(e) => setHasLoadingZone(e.target.value === 'true')}
            >
              <FormControlLabel 
                value="true" 
                control={<Radio />} 
                label="Has loading zone"
              />
              <FormControlLabel 
                value="false" 
                control={<Radio />} 
                label="No loading zone"
              />
            </RadioGroup>
          </FormControl>
        )}

        {parkingType !== 'unknown' && (
          <TextField
            label="Additional parking notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            placeholder="e.g., '2 van-accessible spots, close to entrance'"
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