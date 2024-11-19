'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LocationFormData } from '@/types';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';
import { supabase } from '@/lib/supabase';

interface PhotosStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack?: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function PhotosStep({ onNext, onBack, initialData }: PhotosStepProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.image_urls || []);

  useEffect(() => {
    if (initialData?.image_urls) {
      setImageUrls(initialData.image_urls);
    }
  }, [initialData]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setUploading(true);

    try {
      const newUrls: string[] = [];
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `location-photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('locations')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('locations')
          .getPublicUrl(filePath);
        
        newUrls.push(publicUrl);
      }

      setImageUrls(prev => [...prev, ...newUrls]);
      onNext({ image_urls: [...imageUrls, ...newUrls] });
    } catch (err) {
      console.error('Error uploading photos:', err);
      setError('Failed to upload photos. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [imageUrls, onNext]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 5,
    disabled: uploading,
  });

  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        Add Photos 📸
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Photos help others understand the accessibility features better.
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          bgcolor: 'background.default',
          cursor: uploading ? 'wait' : 'pointer',
          opacity: uploading ? 0.7 : 1,
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        <input {...getInputProps()} />
        <Stack spacing={2} alignItems="center">
          {uploading ? (
            <CircularProgress />
          ) : (
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          )}
          <Typography align="center">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop photos here, or click to select'}
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center">
            Maximum 5 photos (JPEG, PNG, WebP)
          </Typography>
        </Stack>
      </Paper>

      {imageUrls.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Photos:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {imageUrls.map((url, index) => (
              <Box
                key={url}
                component="img"
                src={url}
                alt={`Photo ${index + 1}`}
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <ButtonContainer 
        onNext={() => onNext({ image_urls: imageUrls })}
        onBack={onBack}
        nextLabel={imageUrls.length > 0 ? 'Continue' : 'Skip Photos'}
      />
    </StepContainer>
  );
}