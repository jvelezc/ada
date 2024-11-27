'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

// Update User type to match Supabase type
interface User {
  email?: string;  // Allow email to be undefined
  id: string;
}

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
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,  // Now compatible with optional email
          id: session.user.id,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
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
      <List>
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
          component="li" // Specify the underlying component type, like 'li' or 'div'
          onClick={() => handleNavigate(item.path)}
          sx={{
            py: 2,
            cursor: 'pointer', // Indicate that the item is clickable
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

      </Drawer>
    </>
  );
}
