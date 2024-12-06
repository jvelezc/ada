'use client';

import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

interface LogoutButtonProps {
  onClick: () => void;
  fullWidth?: boolean;
}

export default function LogoutButton({ onClick, fullWidth = false }: LogoutButtonProps) {
  return (
    <Button
      onClick={onClick}
      startIcon={<LogoutIcon />}
      variant="outlined"
      color="primary"
      fullWidth={fullWidth}
      sx={{
        py: 1,
        borderRadius: 2,
        '&:hover': {
          bgcolor: 'primary.dark',
          color: 'primary.contrastText',
        },
      }}
    >
      Logout
    </Button>
  );
}