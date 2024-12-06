'use client';

import { Paper, Typography, Stack, Chip, Box } from '@mui/material';
import { LocationData } from '@/types';

interface LocationPopupProps {
  location: LocationData;
}

export default function LocationPopup({ location }: LocationPopupProps) {
  return (
    <Paper sx={{ p: 3, maxWidth: 400, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">
          {location.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {location.address}
          {location.unit && ` (${location.unit})`}
        </Typography>

        <Box>
          <Chip
            label={location.accessibility_level?.toUpperCase()}
            color={
              location.accessibility_level === 'high' ? 'success' :
              location.accessibility_level === 'medium' ? 'warning' : 'error'
            }
            size="small"
            sx={{ mb: 1 }}
          />
          
          {location.description && (
            <Typography variant="body2">
              {location.description}
            </Typography>
          )}
        </Box>

        <Stack spacing={1}>
          {location.has_steps === false && (
            <Typography variant="body2">✓ No steps at entrance</Typography>
          )}
          {location.has_elevator && (
            <Typography variant="body2">✓ Has elevator</Typography>
          )}
          {location.has_restroom && location.is_restroom_accessible && (
            <Typography variant="body2">✓ Accessible restroom available</Typography>
          )}
          {location.is_dog_friendly && (
            <Typography variant="body2">✓ Service animals welcome</Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}