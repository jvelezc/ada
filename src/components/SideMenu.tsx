'use client';

import { useState, memo } from 'react';
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
import { AnimatePresence, motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useRouter } from 'next/navigation';

interface SideMenuProps {
  user: any;
  onLoginSuccess: () => void;
  onLogout: () => void;
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

const MenuButton = memo(({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Tooltip title="Menu">
      <IconButton
        onClick={onClick}
        sx={{
          position: 'absolute',
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
));

MenuButton.displayName = 'MenuButton';

const MenuItem = memo(({ 
  text, 
  icon, 
  onClick 
}: { 
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <ListItem
    button
    onClick={onClick}
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
      {icon}
    </ListItemIcon>
    <ListItemText 
      primary={text}
      primaryTypographyProps={{
        sx: { color: 'text.primary' }
      }}
    />
  </ListItem>
));

MenuItem.displayName = 'MenuItem';

function SideMenu({ user }: SideMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const visibleMenuItems = menuItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && user)
  );

  return (
    <>
      <MenuButton onClick={() => setOpen(true)} />

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
        keepMounted
      >
        <List sx={{ pt: 8 }}>
          <AnimatePresence mode="wait">
            {visibleMenuItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <MenuItem
                  text={item.text}
                  icon={item.icon}
                  onClick={() => handleNavigate(item.path)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      </Drawer>
    </>
  );
}

export default memo(SideMenu);