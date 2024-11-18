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
} from '@mui/material';
import { LocationFormData } from '@/types';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';

interface DogFriendlyStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack?: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function DogFriendlyStep({ onNext, onBack, initialData }: DogFriendlyStepProps) {
  const [isDogFriendly, setIsDogFriendly] = useState<'yes' | 'no' | 'unknown'>(
    initialData?.is_dog_friendly ? 'yes' :
    initialData?.dog_friendly_unknown ? 'unknown' : 'no'
  );
  const [dogFeatures, setDogFeatures] = useState(initialData?.dog_features || '');

  const handleSubmit = () => {
    onNext({
      is_dog_friendly: isDogFriendly === 'yes',
      dog_friendly_unknown: isDogFriendly === 'unknown',
      dog_features: isDogFriendly === 'yes' ? dogFeatures : undefined,
    });
  };

  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        Is it dog-friendly? 🐾
      </Typography>

      <Stack spacing={3}>
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom>
            Are service animals/dogs welcome?
          </Typography>
          <RadioGroup
            value={isDogFriendly}
            onChange={(e) => setIsDogFriendly(e.target.value as typeof isDogFriendly)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel value="unknown" control={<Radio />} label="I don't know" />
          </RadioGroup>
        </FormControl>

        {isDogFriendly === 'yes' && (
          <TextField
            label="Dog-friendly features"
            value={dogFeatures}
            onChange={(e) => setDogFeatures(e.target.value)}
            multiline
            rows={2}
            placeholder="e.g., 'Water bowls available, dog park nearby'"
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