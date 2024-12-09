'use client';

import { useState, useCallback, useEffect } from 'react';
import Map, { Marker, Popup, ViewState } from 'react-map-gl';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { LocationData } from '@/types';
import { fetchLocations } from '@/lib/supabase-server';
import SearchBar from './SearchBar';
import Legend from './Legend';
import FilterPanel from './FilterPanel';
import AddLocationButton from './AddLocationButton';
import LocationPopup from './Map/LocationPopup';
import MapMarker from './Map/MapMarker';
import { useMapControls } from '@/hooks/useMapControls';
import { useLocationFilters } from '@/hooks/useLocationFilters';

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
  const { viewState, setViewState, handleLocationRequest, handleAddressSelect } = useMapControls({
    initialViewState: INITIAL_VIEW_STATE
  });
  const { filters, setFilters, filterLocations } = useLocationFilters();
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

  const handleSearch = useCallback(() => {
    // Search functionality will be implemented here
  }, []);

  const filteredLocations = filterLocations(locations);

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
        onSearch={handleSearch}
        onLocationRequest={handleLocationRequest}
        onAddressSelect={handleAddressSelect}
      />

      <FilterPanel onFilterChange={setFilters} />

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
            anchor="top"
            offset={[0, -20]}
            className="location-popup"
          >
            <LocationPopup location={selectedLocation} />
          </Popup>
        )}
      </Map>

      <AddLocationButton />
    </Box>
  );
}