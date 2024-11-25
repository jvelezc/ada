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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/navigation';
import { LocationData } from '@/types';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [pendingLocations, setPendingLocations] = useState<LocationData[]>([]);
  const [approvedLocations, setApprovedLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<LocationData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      fetchLocations();
    };

    checkAuth();
  }, [router]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pending locations
      const { data: pendingData, error: pendingError } = await supabase
        .from('pending_locations')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingLocations(pendingData || []);

      // Fetch approved locations
      const { data: approvedData, error: approvedError } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (approvedError) throw approvedError;
      setApprovedLocations(approvedData || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
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

      fetchLocations();
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
      fetchLocations();
    } catch (err) {
      setError('Failed to reject location');
      console.error('Error:', err);
    }
  };

  const handleEdit = (location: LocationData) => {
    router.push(`/admin/edit/${location.id}`);
  };

  const handleDelete = async () => {
    if (!locationToDelete) return;

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationToDelete.id);

      if (error) throw error;
      fetchLocations();
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
    } catch (err) {
      setError('Failed to delete location');
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
    <Box sx={{ p: 3, ml: { sm: 8 } }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Tabs 
        value={activeTab} 
        onChange={(_e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Pending Locations" />
        <Tab label="Approved Locations" />
      </Tabs>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Accessibility</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(activeTab === 0 ? pendingLocations : approvedLocations).map((location) => (
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
                    {activeTab === 0 ? (
                      <>
                        <IconButton 
                          onClick={() => handleApprove(location)}
                          title="Approve"
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleReject(location.id!)}
                          title="Reject"
                          color="error"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton 
                          onClick={() => handleEdit(location)}
                          title="Edit"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => {
                            setLocationToDelete(location);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(activeTab === 0 ? pendingLocations.length === 0 : approvedLocations.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No {activeTab === 0 ? 'pending' : 'approved'} locations
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Location?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {locationToDelete?.name}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}