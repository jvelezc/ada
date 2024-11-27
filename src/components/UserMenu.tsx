'use client';

import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

interface UserMenuProps {
  email: string;
  onLogout: () => void;
  isAdmin?: boolean;
}

export default function UserMenu({ email, onLogout, isAdmin }: UserMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleClose();
    onLogout();
  };

  const handleAdminPanel = () => {
    handleClose();
    router.push('/admin');
  };

  return (
    <>
      <Tooltip title={email}>
        <IconButton
          onClick={handleClick}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {email[0].toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {isAdmin && (
          <MenuItem onClick={handleAdminPanel}>Admin Panel</MenuItem>
        )}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}