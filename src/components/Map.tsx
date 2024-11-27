'use client';

import { useState, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, ViewState } from 'react-map-gl';
import { Box, Paper, Typography, CircularProgress, Alert, Stack, Chip } from '@mui/material';
import SearchBar from './SearchBar';
import Legend from './Legend';
import FilterPanel from './FilterPanel';
import AddLocationButton from './AddLocationButton';
import { LocationData } from '@/types';
import { fetchLocations } from '@/lib/supabase-server';

// Import mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

const INITIAL_VIEW_STATE = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 12,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 }
};

export default function MapComponent() {
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLocations();
      setLocations(data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to load locations. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const handleLocationRequest = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14,
            transitionDuration: 1000,
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Failed to get your location. Please try again.');
        }
      );
    }
  }, []);

  const handleAddressSelect = useCallback((address: string, lat: number, lng: number) => {
    setViewState(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      zoom: 16,
      transitionDuration: 1000,
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters: string[]) => {
    setFilters(newFilters);
  }, []);

  const filteredLocations = locations.filter((location) => {
    if (filters.length === 0) return true;
    return filters.every((filter) => {
      switch (filter) {
        case 'high':
          return location.accessibility_level === 'high';
        case 'medium':
          return location.accessibility_level === 'medium';
        case 'low':
          return location.accessibility_level === 'low';
        case 'no-steps':
          return !location.has_steps;
        case 'restroom':
          return location.has_restroom && location.is_restroom_accessible;
        case 'service-animal':
          return location.is_dog_friendly;
        default:
          return true;
      }
    });
  });

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
        <Typography>Loading map...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            maxWidth: '90%',
            width: 'auto',
          }}
        >
          {error}
        </Alert>
      )}

      <SearchBar 
        onSearch={() => {}}
        onLocationRequest={handleLocationRequest}
        onAddressSelect={handleAddressSelect}
      />

      <FilterPanel onFilterChange={handleFilterChange} />

      <Legend />

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            latitude={location.latitude}
            longitude={location.longitude}
            onClick={(e) => {
              e.originalEvent?.stopPropagation();
              setViewState(prev => ({
                ...prev,
                latitude: location.latitude,
                longitude: location.longitude,
                zoom: 16,
                transitionDuration: 500,
              }));
              setSelectedLocation(location);
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                bgcolor: location.accessibility_level === 'high' ? '#4CAF50' :
                        location.accessibility_level === 'medium' ? '#FFC107' : '#F44336',
                borderRadius: '50%',
                border: '3px solid white',
                boxShadow: 2,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
            />
          </Marker>
        ))}

        {selectedLocation && (
          <Popup
            latitude={selectedLocation.latitude}
            longitude={selectedLocation.longitude}
            onClose={() => setSelectedLocation(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
            className="location-popup"
          >
            <Paper sx={{ p: 3, maxWidth: 400, borderRadius: 2 }}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  {selectedLocation.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {selectedLocation.address}
                  {selectedLocation.unit && ` (${selectedLocation.unit})`}
                </Typography>

                <Box>
                  <Chip
                    label={selectedLocation.accessibility_level?.toUpperCase()}
                    color={
                      selectedLocation.accessibility_level === 'high' ? 'success' :
                      selectedLocation.accessibility_level === 'medium' ? 'warning' : 'error'
                    }
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  
                  {selectedLocation.description && (
                    <Typography variant="body2">
                      {selectedLocation.description}
                    </Typography>
                  )}
                </Box>

                <Stack spacing={1}>
                  {selectedLocation.has_steps === false && (
                    <Typography variant="body2">✓ No steps at entrance</Typography>
                  )}
                  {selectedLocation.has_elevator && (
                    <Typography variant="body2">✓ Has elevator</Typography>
                  )}
                  {selectedLocation.has_restroom && selectedLocation.is_restroom_accessible && (
                    <Typography variant="body2">✓ Accessible restroom available</Typography>
                  )}
                  {selectedLocation.is_dog_friendly && (
                    <Typography variant="body2">✓ Service animals welcome</Typography>
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Popup>
        )}
      </Map>

      <AddLocationButton />
    </Box>
  );
}