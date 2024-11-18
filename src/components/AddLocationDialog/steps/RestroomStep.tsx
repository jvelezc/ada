'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import { LocationFormData } from '@/types';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';

interface RestroomStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack?: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function RestroomStep({ onNext, onBack, initialData }: RestroomStepProps) {
  const [hasRestroom, setHasRestroom] = useState<'yes' | 'no' | 'unknown'>(
    initialData?.has_restroom ? 'yes' :
    initialData?.restroom_unknown ? 'unknown' : 'no'
  );
  const [isRestroomAccessible, setIsRestroomAccessible] = useState<'yes' | 'no' | 'unknown'>(
    initialData?.is_restroom_accessible ? 'yes' :
    initialData?.restroom_status_unknown ? 'unknown' : 'no'
  );

  const handleSubmit = () => {
    onNext({
      has_restroom: hasRestroom === 'yes',
      is_restroom_accessible: isRestroomAccessible === 'yes',
      restroom_unknown: hasRestroom === 'unknown',
      restroom_status_unknown: isRestroomAccessible === 'unknown',
    });
  };

  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        Let's talk about restrooms 🚻
      </Typography>

      <Stack spacing={3}>
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom>
            Does this location have restrooms?
          </Typography>
          <RadioGroup
            value={hasRestroom}
            onChange={(e) => setHasRestroom(e.target.value as typeof hasRestroom)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel value="unknown" control={<Radio />} label="I don't know" />
          </RadioGroup>
        </FormControl>

        {hasRestroom === 'yes' && (
          <FormControl component="fieldset">
            <Typography variant="subtitle2" gutterBottom>
              Is the restroom ADA-compliant?
            </Typography>
            <RadioGroup
              value={isRestroomAccessible}
              onChange={(e) => setIsRestroomAccessible(e.target.value as typeof isRestroomAccessible)}
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="Yes (grab bars, wide doorway, etc.)"
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="No"
              />
              <FormControlLabel
                value="unknown"
                control={<Radio />}
                label="I don't know"
              />
            </RadioGroup>
          </FormControl>
        )}
      </Stack>

      <ButtonContainer 
        onNext={handleSubmit} 
        onBack={onBack}
      />
    </StepContainer>
  );
}