'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LocationData } from '@/types';
import { supabase } from '@/lib/supabase-client';
import LocationTable from './LocationTable';
import LocationSearch from './LocationSearch';
import LocationTabs from './LocationTabs';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function AdminPanel() {
  const [pendingLocations, setPendingLocations] = useState<LocationData[]>([]);
  const [approvedLocations, setApprovedLocations] = useState<LocationData[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationToDelete, setLocationToDelete] = useState<LocationData | null>(null);
  const router = useRouter();

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [pendingResult, approvedResult] = await Promise.all([
        supabase
          .from('pending_locations')
          .select('*')
          .order('submitted_at', { ascending: false }),
        supabase
          .from('locations')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
      ]);

      if (pendingResult.error) throw pendingResult.error;
      if (approvedResult.error) throw approvedResult.error;

      setPendingLocations(pendingResult.data || []);
      setApprovedLocations(approvedResult.data || []);
      setFilteredLocations(activeTab === 0 ? pendingResult.data || [] : approvedResult.data || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const currentLocations = activeTab === 0 ? pendingLocations : approvedLocations;
    
    if (!query.trim()) {
      setFilteredLocations(currentLocations);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = currentLocations.filter(location => 
      location.name.toLowerCase().includes(searchTerm) ||
      location.address.toLowerCase().includes(searchTerm) ||
      location.accessibility_level?.toLowerCase().includes(searchTerm)
    );
    setFilteredLocations(filtered);
  }, [activeTab, pendingLocations, approvedLocations]);

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
    setSearchQuery('');
    setFilteredLocations(newValue === 0 ? pendingLocations : approvedLocations);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Location Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <LocationTabs
          activeTab={activeTab}
          pendingCount={pendingLocations.length}
          approvedCount={approvedLocations.length}
          onChange={handleTabChange}
        />
        
        <Box sx={{ p: 2 }}>
          <LocationSearch
            value={searchQuery}
            onChange={handleSearch}
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <LocationTable
          locations={filteredLocations}
          onEdit={(id) => router.push(`/admin/edit/${id}`)}
          onApprove={async (location) => {
            // Implement approve logic
          }}
          onReject={async (id) => {
            // Implement reject logic
          }}
          onDelete={(location) => setLocationToDelete(location)}
          showApproveReject={activeTab === 0}
        />
      </Paper>

      <DeleteConfirmDialog
        open={!!locationToDelete}
        locationName={locationToDelete?.name || ''}
        onClose={() => setLocationToDelete(null)}
        onConfirm={async () => {
          // Implement delete logic
        }}
      />
    </Box>
  );
}