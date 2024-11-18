'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Slider,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { LocationFormData } from '@/types';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';

interface DoorwayStepProps {
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

const doorTypes = [
  { 
    value: 'automatic', 
    label: 'Automatic', 
    icon: <DoorSlidingIcon />,
    description: 'Door opens automatically with button or sensor'
  },
  { 
    value: 'manual_easy', 
    label: 'Manual (Light)', 
    icon: <AccessTimeIcon />,
    description: 'Manual door that opens easily with little force'
  },
  { 
    value: 'manual_heavy', 
    label: 'Manual (Heavy)', 
    icon: <FitnessCenterIcon />,
    description: 'Manual door that requires significant force'
  },
] as const;

type DoorType = typeof doorTypes[number]['value'];

export default function DoorwayStep({ onNext, onBack, initialData }: DoorwayStepProps) {
  const [doorWidth, setDoorWidth] = useState<number>(initialData?.door_width_inches || 36);
  const [doorType, setDoorType] = useState<DoorType | null>(
    (initialData?.door_type as DoorType) || 'manual_easy'
  );
  const [notes, setNotes] = useState(initialData?.doorway_notes || '');

  useEffect(() => {
    if (initialData) {
      setDoorWidth(initialData.door_width_inches || 36);
      setDoorType((initialData.door_type as DoorType) || 'manual_easy');
      setNotes(initialData.doorway_notes || '');
    }
  }, [initialData]);

  const handleDoorTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: DoorType | null,
  ) => {
    setDoorType(newType);
  };

  const getDoorWidthCategory = (width: number) => {
    if (width >= 36) return 'wide';
    if (width >= 32) return 'standard';
    return 'narrow';
  };

  const handleSubmit = () => {
    onNext({
      door_width: getDoorWidthCategory(doorWidth),
      door_width_inches: doorWidth,
      door_type: doorType || 'manual_easy',
      doorway_notes: notes,
    });
  };

  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        Doorway Details 🚪
      </Typography>

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Door Width
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Standard accessible width is 32" or wider
          </Typography>
          <Box sx={{ px: 2, pt: 2 }}>
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
          </Box>
          <Typography 
            variant="body2" 
            color={doorWidth >= 32 ? 'success.main' : 'warning.main'}
            sx={{ mt: 1, textAlign: 'center' }}
          >
            {doorWidth >= 36 ? '✨ Excellent accessibility' :
             doorWidth >= 32 ? '✓ Meets accessibility standards' :
             '⚠️ Below accessibility standards'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Door Type
          </Typography>
          <ToggleButtonGroup
            value={doorType}
            exclusive
            onChange={handleDoorTypeChange}
            aria-label="door type"
            fullWidth
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiToggleButton-root': {
                flex: 1,
                minWidth: 120,
                py: 2,
                borderRadius: 2,
                flexDirection: 'column',
                gap: 1,
              },
            }}
          >
            {doorTypes.map((type) => (
              <Tooltip 
                key={type.value} 
                title={type.description}
                arrow
                placement="top"
              >
                <ToggleButton 
                  value={type.value}
                  aria-label={type.label}
                >
                  {type.icon}
                  <Typography variant="body2">
                    {type.label}
                  </Typography>
                </ToggleButton>
              </Tooltip>
            ))}
          </ToggleButtonGroup>
        </Box>

        <TextField
          label="Additional doorway notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={2}
          placeholder="e.g., 'Push button available, door stays open for 10 seconds'"
        />
      </Stack>

      <ButtonContainer 
        onNext={handleSubmit} 
        onBack={onBack}
      />
    </StepContainer>
  );
}