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
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { supabase } from '@/lib/supabase';

interface LoginButtonProps {
  onLoginSuccess: () => void;
}

export default function LoginButton({ onLoginSuccess }: LoginButtonProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      setOpen(false);
      onLoginSuccess();
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<LoginIcon />}
        sx={{
          position: 'absolute',
          top: 16,
          right: 80,
          zIndex: 1000,
        }}
      >
        Login
      </Button>

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