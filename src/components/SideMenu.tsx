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
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { 
    id: 'home',
    text: 'Home', 
    icon: <HomeIcon />, 
    path: '/',
    requiresAuth: false
  },
  { 
    id: 'admin',
    text: 'Admin Panel', 
    icon: <AdminPanelSettingsIcon />, 
    path: '/admin',
    requiresAuth: true
  },
];

export default function SideMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    router.push('/');
  };

  const visibleMenuItems = menuItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && user)
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tooltip title="Menu" placement="right">
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 1200,
              bgcolor: theme => alpha(theme.palette.background.paper, 0.1),
              backdropFilter: 'blur(8px)',
              color: 'common.white',
              p: 1.5,
              '&:hover': {
                bgcolor: theme => alpha(theme.palette.background.paper, 0.15),
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <MenuIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      </motion.div>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <List sx={{ flexGrow: 1 }}>
          <AnimatePresence mode="wait">
            {visibleMenuItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <ListItem
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    py: 2,
                    cursor: 'pointer',
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
              </motion.div>
            ))}
          </AnimatePresence>
        </List>

        {user && (
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
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
          </Box>
        )}
      </Drawer>
    </>
  );
}