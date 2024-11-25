'use client';

import { useState, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, ViewState } from 'react-map-gl';
import { Box, Paper, Typography, CircularProgress, Alert, Chip } from '@mui/material';
import { easeCubic } from 'd3-ease';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LocationData } from '@/types';
import { fetchLocations } from '@/lib/supabase';
import SearchBar from './SearchBar';
import Legend from './Legend';
import AddLocationButton from './AddLocationButton';

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
            transitionDuration: 2000,
            transitionEasing: easeCubic
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
      transitionDuration: 2000,
      transitionEasing: easeCubic
    }));
  }, []);

  const getAccessibilityColor = (level?: string) => {
    switch (level) {
      case 'high':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <SearchBar
        onLocationRequest={handleLocationRequest}
        onAddressSelect={handleAddressSelect}
      />

      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            position: 'absolute',
            top: 80,
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

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            latitude={location.latitude}
            longitude={location.longitude}
            onClick={(e) => {
              e.originalEvent?.stopPropagation();
              setSelectedLocation(location);
              setViewState(prev => ({
                ...prev,
                latitude: location.latitude,
                longitude: location.longitude,
                zoom: 15,
                transitionDuration: 1000,
                transitionEasing: easeCubic
              }));
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                bgcolor: getAccessibilityColor(location.accessibility_level),
                borderRadius: '50%',
                border: '3px solid',
                borderColor: 'background.paper',
                boxShadow: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.2) translateY(-2px)',
                  boxShadow: 6,
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
            maxWidth="400px"
          >
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedLocation.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedLocation.address}
                {selectedLocation.unit && ` (${selectedLocation.unit})`}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={selectedLocation.accessibility_level?.toUpperCase() || 'UNKNOWN'}
                  size="small"
                  sx={{
                    bgcolor: getAccessibilityColor(selectedLocation.accessibility_level),
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
              {selectedLocation.description && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {selectedLocation.description}
                </Typography>
              )}
            </Paper>
          </Popup>
        )}
      </Map>

      <Legend />
      <AddLocationButton />
    </Box>
  );
}