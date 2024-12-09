'use client';

import { useState } from 'react';
import { Paper, Typography, Stack, Chip, Box, Button } from '@mui/material';
import { LocationData, isApprovedLocation } from '@/types';
import { getAccessibilityColor, getAccessibilityFeatures } from '@/utils/accessibility';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PhotoGalleryDialog from './PhotoGalleryDialog';

interface LocationPopupProps {
  location: LocationData;
}

export default function LocationPopup({ location }: LocationPopupProps) {
  const [showGallery, setShowGallery] = useState(false);
  const features = getAccessibilityFeatures(location);
  const isApproved = isApprovedLocation(location);
  const hasPhotos = isApproved && Array.isArray(location.photos) && location.photos.length > 0;

  return (
    <Paper 
      sx={{ 
        width: 400,
        maxWidth: '90vw',
        borderRadius: 2,
        overflow: 'visible',
        boxShadow: theme => `0 8px 32px ${theme.palette.common.black}20`,
        transform: 'translateY(30%)',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {location.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {location.address}
            {location.unit && ` (${location.unit})`}
          </Typography>

          <Box>
            <Chip
              label={location.accessibility_level?.toUpperCase() || 'UNKNOWN'}
              sx={{
                bgcolor: getAccessibilityColor(location.accessibility_level),
                color: 'white',
                mb: 1,
              }}
              size="small"
            />
            
            {location.description && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {location.description}
              </Typography>
            )}
          </Box>

          {features.length > 0 && (
            <Stack spacing={1}>
              {features.map((feature, index) => (
                <Typography 
                  key={index} 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      mr: 1,
                      flexShrink: 0,
                    }}
                  />
                  {feature}
                </Typography>
              ))}
            </Stack>
          )}

          {isApproved && (
            <Box sx={{ mt: 1 }}>
              {hasPhotos ? (
                <Button
                  startIcon={<PhotoLibraryIcon />}
                  onClick={() => setShowGallery(true)}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      color: 'white',
                    },
                  }}
                >
                  View Photos ({location.photos.length})
                </Button>
              ) : (
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <AddPhotoAlternateIcon 
                    sx={{ 
                      fontSize: 40,
                      color: 'text.secondary',
                      mb: 1,
                    }} 
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                  >
                    No photos available yet
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Stack>
      </Box>

      {hasPhotos && (
        <PhotoGalleryDialog
          open={showGallery}
          onClose={() => setShowGallery(false)}
          photos={location.photos}
          locationName={location.name}
        />
      )}
    </Paper>
  );
}