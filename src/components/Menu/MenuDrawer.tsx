'use client';

import { Drawer, List, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import MenuItem from './MenuItem';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';
import { MenuItemType } from './types';

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  items: MenuItemType[];
  onItemClick: (path: string) => void;
  onLogout?: () => void;
  onLogin?: () => void;
  showLogout?: boolean;
  showLogin?: boolean;
}

export default function MenuDrawer({
  open,
  onClose,
  items,
  onItemClick,
  onLogout,
  onLogin,
  showLogout,
  showLogin,
}: MenuDrawerProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: { xs: 240, sm: 280 },
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <List sx={{ flexGrow: 1, pt: 2 }}>
        <AnimatePresence mode="wait">
          {items.map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              text={item.text}
              onClick={() => onItemClick(item.path)}
            />
          ))}
        </AnimatePresence>
      </List>

      <Box sx={{ 
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}>
        {showLogout && onLogout && (
          <LogoutButton onClick={onLogout} fullWidth />
        )}
        {showLogin && onLogin && (
          <LoginButton onClick={onLogin} fullWidth />
        )}
      </Box>
    </Drawer>
  );
}