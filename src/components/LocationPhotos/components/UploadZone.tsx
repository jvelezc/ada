'use client';

import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import { useDropzone } from 'react-dropzone';

interface UploadZoneProps {
  onDrop: (files: File[]) => void;
  uploading?: boolean;
  disabled?: boolean;
}

export default function UploadZone({ 
  onDrop, 
  uploading = false, 
  disabled = false 
}: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: disabled || uploading,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 3,
        cursor: disabled || uploading ? 'not-allowed' : 'pointer',
      }}
    >
      <input {...getInputProps()} />
      
      {uploading ? (
        <CloudUploadIcon 
          sx={{ 
            fontSize: 48,
            color: 'primary.main',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.6 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.6 },
            },
          }} 
        />
      ) : (
        <ImageIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      )}
      
      <Typography variant="h6" align="center" color="text.primary">
        {uploading ? 'Uploading...' : (
          isDragActive ? 'Drop the photo here' : 'Drag & drop a photo here'
        )}
      </Typography>
      
      <Typography variant="body2" align="center" color="text.secondary">
        or click to select a photo (max 5MB)
      </Typography>
    </Box>
  );
}