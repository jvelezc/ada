'use client';

import { Box, Paper, Button } from '@mui/material';

interface ButtonContainerProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  isLoading?: boolean;
}

export default function ButtonContainer({
  onBack,
  onNext,
  nextLabel = 'Next',
  backLabel = 'Back',
  isLoading = false,
}: ButtonContainerProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        mt: 'auto',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        justifyContent: 'center',
      }}>
        {onBack && (
          <Button
            variant="contained"
            onClick={onBack}
            disabled={isLoading}
            sx={{
              flex: 1,
              maxWidth: 200,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            {backLabel}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onNext}
          disabled={isLoading}
          sx={{
            flex: 1,
            maxWidth: 200,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          {nextLabel}
        </Button>
      </Box>
    </Paper>
  );
}