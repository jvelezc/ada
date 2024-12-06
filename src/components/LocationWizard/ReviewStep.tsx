'use client';

import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { LocationFormData } from '@/types';

interface ReviewStepProps {
  data: Partial<LocationFormData>;
  onBack: () => void;
  onSubmit: () => void;
  mode?: 'create' | 'edit';
  disabled?: boolean;
}

export default function ReviewStep({ 
  data, 
  onBack, 
  onSubmit, 
  mode = 'create',
  disabled = false,
}: ReviewStepProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="body1" color="text.secondary">
        Please review the information before submitting.
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Location Name
            </Typography>
            <Typography variant="body1">{data.name}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Address
            </Typography>
            <Typography variant="body1">
              {data.address}
              {data.unit && ` (${data.unit})`}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Accessibility Level
            </Typography>
            <Chip 
              label={data.accessibility_level || 'Not specified'}
              color={
                data.accessibility_level === 'high' ? 'success' :
                data.accessibility_level === 'medium' ? 'warning' : 'error'
              }
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>

          {data.description && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">{data.description}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Entrance Details
            </Typography>
            <Stack spacing={1}>
            <Typography variant="body1">
              {`• Steps: ${data.step_status_unknown ? "Unknown" : 
                          data.has_steps ? "Yes" : "No"}`}
              {data.step_description && ` - ${data.step_description}`}
            </Typography>
              <Typography variant="body1">
               • Door Width: {`${data.door_width_inches}" (${data.door_width})`}
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                • Door Type: {data.door_type?.replace('_', ' ')}
              </Typography>
              {data.doorway_notes && (
                <Typography variant="body1">
                  • Notes: {data.doorway_notes}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button 
          onClick={onBack}
          disabled={disabled}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          color="primary"
          disabled={disabled}
        >
          {mode === 'create' ? 'Submit Location' : 'Save Changes'}
        </Button>
      </Box>
    </Stack>
  );
}