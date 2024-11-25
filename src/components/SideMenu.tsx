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
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SideMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      // Redirect from admin page if not logged in
      if (!session?.user && pathname?.startsWith('/admin')) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    ...(user ? [
      { text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin' }
    ] : []),
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setLoginDialogOpen(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1200,
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <List sx={{ pt: 8, flex: 1 }}>
          {menuItems.map((item, index) => (
            <Box key={item.text}>
              {index > 0 && <Divider />}
              <ListItem
                button
                onClick={() => {
                  router.push(item.path);
                  setOpen(false);
                }}
                selected={pathname === item.path}
                sx={{
                  py: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'primary.dark',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: pathname === item.path ? 'primary.contrastText' : 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { fontWeight: 500 }
                  }}
                />
              </ListItem>
            </Box>
          ))}
        </List>

        <Divider />
        <Box sx={{ p: 2 }}>
          {user ? (
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ py: 1 }}
            >
              Logout
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<LoginIcon />}
              onClick={() => setLoginDialogOpen(true)}
              sx={{ py: 1 }}
            >
              Login
            </Button>
          )}
        </Box>
      </Drawer>

      <Dialog 
        open={loginDialogOpen} 
        onClose={() => setLoginDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <form onSubmit={handleLogin}>
            <Stack spacing={3} sx={{ pt: 1, minWidth: 300 }}>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}