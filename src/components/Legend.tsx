'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Paper, Box, Typography, IconButton, Collapse } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function Legend() {
  const [isPinned, setIsPinned] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const levels = [
    { level: 'High', color: '#4CAF50', description: 'Fully accessible, no barriers' },
    { level: 'Medium', color: '#FFC107', description: 'Partially accessible, some barriers' },
    { level: 'Low', color: '#F44336', description: 'Limited accessibility, significant barriers' },
  ];

  const startAutoHideTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!isPinned && !isHovered) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  }, [isPinned, isHovered]);

  useEffect(() => {
    setIsVisible(true);
    startAutoHideTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startAutoHideTimer]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startAutoHideTimer();
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsVisible(true);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 80,
        left: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isVisible && (
        <IconButton
          onClick={() => setIsVisible(true)}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 2,
            color: 'primary.main',
            '&:hover': { 
              bgcolor: 'background.paper',
              color: 'primary.light',
            },
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      )}

      <Collapse in={isVisible}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            backdropFilter: 'blur(4px)',
            width: { xs: 280, sm: 320 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                flex: 1, 
                fontSize: '1rem', 
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Accessibility Levels
            </Typography>
            <IconButton
              size="small"
              onClick={togglePin}
              sx={{ 
                mr: 0.5,
                color: isPinned ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setIsVisible(false)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <ExpandLessIcon />
            </IconButton>
          </Box>

          {levels.map(({ level, color, description }) => (
            <Box 
              key={level} 
              sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                mb: 2,
                '&:last-child': { mb: 0 },
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: color,
                  mr: 2,
                  mt: 0.5,
                  flexShrink: 0,
                  border: '2px solid',
                  borderColor: 'background.paper',
                  boxShadow: 1,
                }}
              />
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {level}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                    lineHeight: 1.4,
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Collapse>
    </Box>
  );
}