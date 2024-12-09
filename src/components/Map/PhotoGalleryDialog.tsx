'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  useTheme,
  alpha,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoGalleryDialogProps {
  open: boolean;
  onClose: () => void;
  photos: string[];
  locationName: string;
}

export default function PhotoGalleryDialog({
  open,
  onClose,
  photos,
  locationName,
}: PhotoGalleryDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      aria-labelledby="photo-gallery-title"
      PaperProps={{
        sx: {
          width: '90vw',
          maxWidth: 1600,
          height: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        id="photo-gallery-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          p: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {locationName} - Photo {currentIndex + 1} of {photos.length}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
          aria-label="Close gallery"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', height: 'calc(100% - 64px)' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Main Photo Display */}
          <Grid item xs={12} md={9} sx={{ position: 'relative' }}>
            <Box
              sx={{
                height: '100%',
                bgcolor: alpha(theme.palette.common.black, 0.95),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={photos[currentIndex]}
                  src={photos[currentIndex]}
                  alt={`${locationName} photo ${currentIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    padding: '24px',
                  }}
                />
              </AnimatePresence>

              {photos.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevious}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      bgcolor: alpha(theme.palette.common.black, 0.6),
                      color: 'white',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.common.black, 0.8),
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    aria-label="Previous photo"
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>

                  <IconButton
                    onClick={handleNext}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      bgcolor: alpha(theme.palette.common.black, 0.6),
                      color: 'white',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.common.black, 0.8),
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    aria-label="Next photo"
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Grid>

          {/* Thumbnails Sidebar */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              height: '100%',
              borderLeft: '1px solid',
              borderColor: 'divider',
              overflow: 'auto',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Grid container spacing={1}>
                {photos.map((photo, index) => (
                  <Grid item xs={6} key={index}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Box
                        onClick={() => setCurrentIndex(index)}
                        sx={{
                          position: 'relative',
                          paddingTop: '100%',
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: index === currentIndex ? 'primary.main' : 'transparent',
                        }}
                      >
                        <img
                          src={photo}
                          alt={`Thumbnail ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}