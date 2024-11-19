'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useRouter } from 'next/navigation';

interface SideMenuProps {
  user: any;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export default function SideMenu({ user }: SideMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { 
      text: 'Home', 
      icon: <HomeIcon />, 
      onClick: () => router.push('/'),
      show: true 
    },
    { 
      text: 'Admin Panel', 
      icon: <AdminPanelSettingsIcon />, 
      onClick: () => router.push('/admin'),
      show: !!user 
    },
  ];

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1200,
          borderRadius: '50%',
          background: (theme) => alpha(theme.palette.background.paper, 0.1),
          backdropFilter: 'blur(8px)',
          boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: (theme) => alpha(theme.palette.background.paper, 0.15),
            transform: 'scale(1.05)',
          },
        }}
      >
        <Tooltip title={open ? 'Close menu' : 'Open menu'}>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              color: 'common.white',
              p: 1.5,
              '&:hover': {
                bgcolor: 'transparent',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1)',
                },
              },
              '& .MuiSvgIcon-root': {
                fontSize: 28,
                transition: 'transform 0.2s ease-in-out',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 240,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <List sx={{ pt: 8 }}>
          {menuItems
            .filter(item => item.show)
            .map((item) => (
              <ListItem
                key={item.text}
                button
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                sx={{
                  py: 2,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { color: 'text.primary' }
                  }}
                />
              </ListItem>
            ))}
        </List>
      </Drawer>
    </>
  );
}