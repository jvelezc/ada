'use client';

import { Box, Typography, Fade } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SuccessMessageProps {
  show: boolean;
  message: string;
}

export default function SuccessMessage({ show, message }: SuccessMessageProps) {
  return (
    <Fade in={show}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircleIcon color="success" />
        <Typography variant="body2" color="success.main">
          {message}
        </Typography>
      </Box>
    </Fade>
  );
}