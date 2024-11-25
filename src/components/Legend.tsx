'use client';

import { useState, useEffect, useRef } from 'react';
import { Paper, Box, Typography, IconButton, Stack, Divider, Fab } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Legend() {
  const [isVisible, setIsVisible] = useState(false); // Changed to false for initial state
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startAutoHideTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!isHovered) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Changed to 3000ms (3 seconds)
    }
  };

  useEffect(() => {
    if (isVisible) {
      startAutoHideTimer();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startAutoHideTimer();
  };

  const levels = [
    { 
      level: 'High', 
      color: '#4CAF50',
      title: 'Fully Accessible',
      description: [
        'Level/ramped entrance',
        'Wide doorways (32"+ width)',
        'Automatic or easy-to-open doors',
        'Accessible restrooms',
        'Clear pathways throughout'
      ]
    },
    { 
      level: 'Medium', 
      color: '#FFC107',
      title: 'Partially Accessible',
      description: [
        'May have one small step',
        'Standard doorways',
        'Manual doors',
        'Some areas may need assistance',
        'Limited accessible features'
      ]
    },
    { 
      level: 'Low', 
      color: '#F44336',
      title: 'Limited Accessibility',
      description: [
        'Multiple steps',
        'Narrow doorways',
        'Heavy doors',
        'No accessible restrooms',
        'Significant barriers'
      ]
    },
  ];

  return (
    <Box sx={{ position: 'fixed', left: 16, bottom: 32, zIndex: 1000 }}>
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Fab
              size="medium"
              color="primary"
              onClick={() => setIsVisible(true)}
              sx={{
                position: 'fixed',
                left: 16,
                bottom: 32,
                boxShadow: 4,
              }}
            >
              <InfoIcon />
            </Fab>
          </motion.div>
        )}

        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Paper
              elevation={8}
              sx={{
                p: 3,
                width: { xs: 280, sm: 320 },
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                boxShadow: theme => `0 8px 32px ${theme.palette.primary.main}20`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ flex: 1, fontSize: '1.1rem' }}>
                  Accessibility Guide
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setIsVisible(false)}
                  sx={{ color: 'text.secondary' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Stack spacing={2}>
                {levels.map(({ level, color, title, description }, index) => (
                  <Box key={level}>
                    {index > 0 && <Divider sx={{ my: 1 }} />}
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: color,
                          border: '2px solid',
                          borderColor: 'background.paper',
                          boxShadow: 2,
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {title}
                        </Typography>
                        <Stack spacing={0.5}>
                          {description.map((item, i) => (
                            <Typography 
                              key={i} 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                '&:before': {
                                  content: '"•"',
                                  mr: 1,
                                  color: color,
                                }
                              }}
                            >
                              {item}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>

              {!isHovered && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <ExpandMoreIcon fontSize="small" />
                  Auto-hiding in a few seconds
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}