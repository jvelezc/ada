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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { LocationData } from '@/types';
import { supabase } from '@/lib/supabase-client';


export default function AdminPage() {
  const [pendingLocations, setPendingLocations] = useState<LocationData[]>([]);
  const [approvedLocations, setApprovedLocations] = useState<LocationData[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [locationToDelete, setLocationToDelete] = useState<LocationData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pending locations
      const { data: pendingData, error: pendingError } = await supabase
        .from('pending_locations')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(10);

      if (pendingError) throw pendingError;

      // Fetch approved locations
      const { data: approvedData, error: approvedError } = await supabase
        .from('locations')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);

      if (approvedError) throw approvedError;

      setPendingLocations(pendingData || []);
      setApprovedLocations(approvedData || []);
      setFilteredLocations(activeTab === 0 ? pendingData || [] : approvedData || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const currentLocations = activeTab === 0 ? pendingLocations : approvedLocations;
    if (searchQuery.trim() === '') {
      setFilteredLocations(currentLocations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = currentLocations.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query) ||
      location.accessibility_level?.toLowerCase().includes(query) ||
      location.description?.toLowerCase().includes(query)
    );
    setFilteredLocations(filtered);
  }, [searchQuery, activeTab, pendingLocations, approvedLocations]);

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchQuery('');
    setFilteredLocations(newValue === 0 ? pendingLocations : approvedLocations);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/edit/${id}`);
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
      fetchLocations();
    } catch (err) {
      console.error('Error approving location:', err);
      setError('Failed to approve location');
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
      fetchLocations();
    } catch (err) {
      console.error('Error rejecting location:', err);
      setError('Failed to reject location');
    }
  };

  const handleDelete = async () => {
    if (!locationToDelete) return;

    try {
      const table = activeTab === 0 ? 'pending_locations' : 'locations';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', locationToDelete.id);

      if (error) throw error;

      setDeleteDialogOpen(false);
      setLocationToDelete(null);
      fetchLocations();
    } catch (err) {
      console.error('Error deleting location:', err);
      setError('Failed to delete location');
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
        Location Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
          >
            <Tab label={`Pending (${pendingLocations.length})`} />
            <Tab label={`Approved (${approvedLocations.length})`} />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name, address, or accessibility level..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
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
            {filteredLocations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>
                  <Chip
                    label={location.accessibility_level?.toUpperCase() || 'UNKNOWN'}
                    color={
                      location.accessibility_level === 'high' ? 'success' :
                      location.accessibility_level === 'medium' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{location.submitted_by || 'Anonymous'}</TableCell>
                <TableCell>
                  {new Date(location.submitted_at!).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleEdit(location.id!)}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <Tooltip title="Edit">
                      <EditIcon fontSize="small" />
                    </Tooltip>
                  </IconButton>
                  {activeTab === 0 && (
                    <>
                      <IconButton 
                        onClick={() => handleApprove(location)}
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <Tooltip title="Approve">
                          <CheckCircleIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                      <IconButton 
                        onClick={() => handleReject(location.id!)}
                        color="error"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <Tooltip title="Reject">
                          <CancelIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    onClick={() => {
                      setLocationToDelete(location);
                      setDeleteDialogOpen(true);
                    }}
                    color="error"
                    size="small"
                  >
                    <Tooltip title="Delete">
                      <DeleteIcon fontSize="small" />
                    </Tooltip>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredLocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {searchQuery ? 'No matching locations found' : `No ${activeTab === 0 ? 'pending' : 'approved'} locations`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {locationToDelete?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}