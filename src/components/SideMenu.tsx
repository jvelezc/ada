'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import MapIcon from '@mui/icons-material/Map';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '@/lib/supabase';

interface SideMenuProps {
  user: any;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export default function SideMenu({ user, onLoginSuccess, onLogout }: SideMenuProps) {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleMapView = () => {
    router.push('/');
    setOpen(false);
  };

  const handleAdminPanel = () => {
    router.push('/admin');
    setOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    setOpen(false);
    router.push('/');
  };

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
        }}
      >
        <Tooltip title={open ? 'Close menu' : 'Open menu'}>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'primary.dark',
                '& .MuiSvgIcon-root': {
                  color: 'primary.contrastText',
                },
              },
              transition: 'all 0.2s',
            }}
          >
            <MenuIcon sx={{ color: 'primary.main' }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            borderRight: '1px solid',
            borderColor: 'divider',
            boxShadow: 8,
            '& .MuiListItem-root': {
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'primary.dark',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
                '& .MuiTypography-root': {
                  color: 'primary.contrastText',
                },
              },
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
                '& .MuiTypography-root': {
                  color: 'primary.contrastText',
                },
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
            '& .MuiListItemIcon-root': {
              minWidth: 40,
              color: 'text.primary',
              transition: 'color 0.2s',
            },
            '& .MuiDivider-root': {
              borderColor: 'divider',
              mx: 2,
              my: 1,
            },
            '& .MuiTypography-root': {
              transition: 'color 0.2s',
            },
          },
        }}
      >
        <List sx={{ pt: 2 }}>
          {user ? (
            <>
              <ListItem>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                    }}>
                      {user.email}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Logged in
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem 
                button 
                onClick={handleMapView}
                selected={pathname === '/'}
              >
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary="Map View" />
              </ListItem>

              <ListItem 
                button 
                onClick={handleAdminPanel}
                selected={pathname === '/admin'}
              >
                <ListItemIcon>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Admin Panel" />
              </ListItem>

              <Divider />
              
              <ListItem 
                button 
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    bgcolor: 'error.dark',
                    '& .MuiListItemIcon-root': {
                      color: 'error.contrastText',
                    },
                    '& .MuiTypography-root': {
                      color: 'error.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography color="error">
                      Logout
                    </Typography>
                  }
                />
              </ListItem>
            </>
          ) : (
            <ListItem 
              button 
              onClick={() => setLoginOpen(true)}
              sx={{
                '&:hover': {
                  bgcolor: 'primary.dark',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                  '& .MuiTypography-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon>
                <LoginIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography color="primary">
                    Login
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}