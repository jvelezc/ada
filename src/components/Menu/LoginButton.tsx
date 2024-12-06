'use client';

import { Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

interface LoginButtonProps {
  onClick: () => void;
  fullWidth?: boolean;
}

export default function LoginButton({ onClick, fullWidth = false }: LoginButtonProps) {
  return (
    <Button
      onClick={onClick}
      startIcon={<LoginIcon />}
      variant="contained"
      color="primary"
      fullWidth={fullWidth}
      sx={{
        py: 1,
        borderRadius: 2,
      }}
    >
      Login
    </Button>
  );
}