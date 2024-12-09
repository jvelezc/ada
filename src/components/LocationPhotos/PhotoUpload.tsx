'use client';

import { Box, Paper, Typography } from '@mui/material';
import UploadZone from './components/UploadZone';

interface PhotoUploadProps {
  onFileSelect: (file: File) => Promise<void>;
}

export default function PhotoUpload({ onFileSelect }: PhotoUploadProps) {
  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    await onFileSelect(file);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <UploadZone onDrop={handleDrop} />
      </Paper>

      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ 
          display: 'block',
          mt: 1,
          textAlign: 'center',
        }}
      >
        Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
      </Typography>
    </Box>
  );
}