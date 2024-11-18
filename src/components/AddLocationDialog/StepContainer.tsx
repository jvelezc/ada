'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface StepContainerProps {
  children: ReactNode;
}

export default function StepContainer({ children }: StepContainerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minHeight: '400px',
        height: '100%',
        '& > *:last-child': {
          mt: 'auto',
        },
      }}
    >
      {children}
    </Box>
  );
}