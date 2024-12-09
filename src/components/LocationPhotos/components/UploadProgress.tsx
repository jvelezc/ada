'use client';

import { Box, LinearProgress, Typography } from '@mui/material';

interface UploadProgressProps {
  progress: number;
}

export default function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
        {`${progress}% complete`}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
}