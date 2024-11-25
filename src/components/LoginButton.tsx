'use client';

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { supabase } from '@/lib/supabase';

export default function LoginButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setUser(data.user);
      setOpen(false);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAnchorEl(null);
  };

  return (
    <>
      {user ? (
        <>
          <Avatar
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              cursor: 'pointer',
              bgcolor: 'primary.main',
              zIndex: 1200,
            }}
          >
            {user.email[0].toUpperCase()}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<LoginIcon />}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1200,
          }}
        >
          Login
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
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