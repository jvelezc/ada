'use client';

import { useEffect, useState } from 'react';
import { Paper, Box, Typography, IconButton, Collapse, Fade } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const LEGEND_PIN_KEY = 'accessibility-legend-pinned';
const LEGEND_VISIBLE_KEY = 'accessibility-legend-visible';
const AUTO_HIDE_DELAY = 7000; // 7 seconds in milliseconds

export default function Legend() {
  const [isPinned, setIsPinned] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LEGEND_PIN_KEY) === 'true';
    }
    return false;
  });
  
  const [isVisible, setIsVisible] = useState(true); // Always start visible
  const [isHovered, setIsHovered] = useState(false);

  const levels = [
    { level: 'High', color: '#4CAF50', description: 'Fully accessible, no barriers' },
    { level: 'Medium', color: '#FFC107', description: 'Partially accessible, some barriers' },
    { level: 'Low', color: '#F44336', description: 'Limited accessibility, significant barriers' },
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!isPinned && !isHovered && isVisible) {
      timeout = setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem(LEGEND_VISIBLE_KEY, 'false');
      }, AUTO_HIDE_DELAY);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPinned, isHovered, isVisible]);

  useEffect(() => {
    localStorage.setItem(LEGEND_PIN_KEY, isPinned.toString());
  }, [isPinned]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isPinned) {
      setIsVisible(true);
      localStorage.setItem(LEGEND_VISIBLE_KEY, 'true');
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const togglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    setIsVisible(true);
    localStorage.setItem(LEGEND_PIN_KEY, newPinned.toString());
    localStorage.setItem(LEGEND_VISIBLE_KEY, 'true');
  };

  const toggleVisibility = () => {
    const newVisible = !isVisible;
    setIsVisible(newVisible);
    localStorage.setItem(LEGEND_VISIBLE_KEY, newVisible.toString());
  };

  return (
    <Box
      sx={{
        position: 'absolute',
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
      <Fade in={!isVisible}>
        <IconButton
          onClick={toggleVisibility}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: 2,
            mb: 1,
            '&:hover': { 
              bgcolor: 'primary.dark',
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s',
            width: 40,
            height: 40,
            '& .MuiSvgIcon-root': {
              fontSize: 28,
            },
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Fade>

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
            <Typography variant="h6" sx={{ flex: 1, fontSize: '1rem', fontWeight: 600 }}>
              Accessibility Levels
            </Typography>
            <IconButton
              size="small"
              onClick={togglePin}
              sx={{ 
                mr: 0.5,
                color: isPinned ? 'primary.main' : 'inherit',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
            </IconButton>
            <IconButton
              size="small"
              onClick={toggleVisibility}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark',
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
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {level}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
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