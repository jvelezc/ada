'use client';

import { useState, useCallback, useEffect } from 'react';
import Map, { Marker, Popup, ViewState } from 'react-map-gl';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { LocationData } from '@/types';
import { fetchLocations } from '@/lib/supabase-server';
import MapControls from './MapControls';
import MapMarker from './MapMarker';
import LocationPopup from './LocationPopup';

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

  const handleSearch = useCallback((query: string) => {
    // Search implementation
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

      <MapControls
        onSearch={handleSearch}
        onLocationRequest={handleLocationRequest}
        onAddressSelect={handleAddressSelect}
        onFilterChange={handleFilterChange}
      />

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
          >
            <MapMarker
              location={location}
              onClick={() => {
                setViewState(prev => ({
                  ...prev,
                  latitude: location.latitude,
                  longitude: location.longitude,
                  zoom: 16,
                  transitionDuration: 500,
                }));
                setSelectedLocation(location);
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
            <LocationPopup location={selectedLocation} />
          </Popup>
        )}
      </Map>
    </Box>
  );
}