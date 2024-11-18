'use client';

import { useEffect, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface StepperProgressProps {
  steps: Array<{ label: string }>;
  currentStep: number;
}

export default function StepperProgress({ steps, currentStep }: StepperProgressProps) {
  const theme = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize stepRefs array with the correct length
  useEffect(() => {
    stepRefs.current = Array(steps.length).fill(null);
  }, [steps.length]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const currentStepElement = stepRefs.current[currentStep];

    if (scrollContainer && currentStepElement) {
      const containerWidth = scrollContainer.offsetWidth;
      const stepWidth = currentStepElement.offsetWidth;
      const stepLeft = currentStepElement.offsetLeft;
      
      // Calculate scroll position to center the current step
      const scrollTo = stepLeft - (containerWidth / 2) + (stepWidth / 2);
      
      scrollContainer.scrollTo({
        left: Math.max(0, scrollTo),
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

  return (
    <Box 
      role="navigation"
      aria-label="Progress Steps"
      sx={{ 
        width: '100%',
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          px: { xs: 2, sm: 4 },
          py: 2,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: 'divider',
          },
        }}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <Box
              key={step.label}
              ref={(el: HTMLDivElement | null) => stepRefs.current[index] = el}
              role="tab"
              aria-selected={isActive}
              aria-label={`Step ${index + 1} of ${steps.length}: ${step.label}`}
              aria-current={isActive ? 'step' : undefined}
              tabIndex={isActive ? 0 : -1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: { xs: 100, sm: 120 },
                position: 'relative',
                opacity: isCompleted || isActive ? 1 : 0.5,
                transition: theme.transitions.create(['opacity', 'transform'], {
                  duration: theme.transitions.duration.shorter,
                }),
                cursor: 'default',
                userSelect: 'none',
                '&:not(:first-of-type)::before': {
                  content: '""',
                  position: 'absolute',
                  left: '-50%',
                  right: '50%',
                  top: 12,
                  height: 2,
                  bgcolor: isCompleted ? 'primary.main' : 'divider',
                  transition: theme.transitions.create('background-color'),
                },
              }}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  rotate: isCompleted ? 360 : 0,
                }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                {isCompleted ? (
                  <CheckCircleIcon 
                    color="primary" 
                    aria-label="Completed"
                    sx={{ 
                      fontSize: 28,
                      mb: 1,
                      filter: `drop-shadow(0 2px 4px ${theme.palette.primary.main}40)`,
                    }}
                  />
                ) : (
                  <Box
                    role="presentation"
                    aria-hidden="true"
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: 2,
                      borderColor: isActive ? 'primary.main' : 'divider',
                      mb: 1,
                      transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
                      bgcolor: isActive ? 'primary.main' : 'transparent',
                      boxShadow: isActive ? `0 0 0 4px ${theme.palette.primary.main}40` : 'none',
                    }}
                  />
                )}
              </motion.div>

              <Typography
                variant="caption"
                sx={{
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  transition: theme.transitions.create(['color', 'font-size', 'font-weight']),
                  fontSize: isActive ? '0.85rem' : '0.75rem',
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {step.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}