'use client';

import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface EditLocationHeaderProps {
  activeStep: number;
  onExit: () => void;
}

export default function EditLocationHeader({ activeStep, onExit }: EditLocationHeaderProps) {
  const steps = [
    { label: 'Basic Info', description: 'Location details' },
    { label: 'Accessibility', description: 'Overall accessibility' },
    { label: 'Entrance', description: 'Steps and doors' },
    { label: 'Interior', description: 'Inside features' },
    { label: 'Review', description: 'Review and submit' },
  ];

  return (
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      alignItems: 'center',
      gap: 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}>
      <IconButton 
        onClick={onExit}
        sx={{ color: 'text.secondary' }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box>
        <Typography variant="h5" gutterBottom>
          Edit Location
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {steps[activeStep].description}
        </Typography>
      </Box>
    </Box>
  );
}