'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/navigation';
import { LocationData } from '@/types';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [pendingLocations, setPendingLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      fetchPendingLocations();
    };

    checkAuth();
  }, [router]);

  const fetchPendingLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_locations')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setPendingLocations(data || []);
    } catch (err) {
      setError('Failed to fetch pending locations');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/${id}`);
  };

  const handleApprove = async (location: LocationData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Insert into approved locations
      const { error: insertError } = await supabase
        .from('locations')
        .insert([{
          ...location,
          status: 'approved',
          moderated_at: new Date().toISOString(),
          moderated_by: user?.email,
        }]);

      if (insertError) throw insertError;

      // Delete from pending locations
      const { error: deleteError } = await supabase
        .from('pending_locations')
        .delete()
        .eq('id', location.id);

      if (deleteError) throw deleteError;

      // Refresh the list
      fetchPendingLocations();
    } catch (err) {
      setError('Failed to approve location');
      console.error('Error:', err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('pending_locations')
        .update({
          status: 'rejected',
          moderated_at: new Date().toISOString(),
          moderated_by: user?.email,
        })
        .eq('id', id);

      if (error) throw error;

      // Refresh the list
      fetchPendingLocations();
    } catch (err) {
      setError('Failed to reject location');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Accessibility</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>
                    <Chip
                      label={location.accessibility_level}
                      color={
                        location.accessibility_level === 'high' ? 'success' :
                        location.accessibility_level === 'medium' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{location.submitted_by}</TableCell>
                  <TableCell>
                    {new Date(location.submitted_at!).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleEdit(location.id!)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleApprove(location)}
                      color="success"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleReject(location.id!)}
                      color="error"
                    >
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {pendingLocations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No pending locations
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}