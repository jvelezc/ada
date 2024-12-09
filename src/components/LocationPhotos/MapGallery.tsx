'use client';

import { useState } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';

interface MapGalleryProps {
  photos: string[];
}

export default function MapGallery({ photos }: MapGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos.length) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        width: '100%',
        height: 240,
        overflow: 'hidden',
        borderRadius: 2,
        mb: 2,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={photos[currentIndex]}
          src={photos[currentIndex]}
          alt="Location"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AnimatePresence>

      {photos.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
            }}
          >
            {photos.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}