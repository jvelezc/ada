'use client';

import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Box, Paper, Typography } from '@mui/material';
import { easeCubic } from 'd3-ease';
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBar from './SearchBar';
import Legend from './Legend';
import FilterPanel from './FilterPanel';
import AddLocationButton from './AddLocationButton';
import { LocationData } from '@/types';
import { supabase } from '@/lib/supabase';

interface MapComponentProps {}

export default function MapComponent({}: MapComponentProps) {
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 12
  });
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('status', 'approved');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationRequest = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newViewState = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14
          };
          setViewState(newViewState);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSearch = (query: string) => {
    // Implement search functionality
  };

  const handleFilterChange = (newFilters: string[]) => {
    setFilters(newFilters);
  };

  const filteredLocations = locations.filter(location => {
    if (filters.length === 0) return true;
    
    return filters.every(filter => {
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

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch}
        onLocationRequest={handleLocationRequest}
      />

      {/* Filter Panel */}
      <FilterPanel onFilterChange={handleFilterChange} />

      {/* Legend */}
      <Legend />

      {/* Map */}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            latitude={location.latitude}
            longitude={location.longitude}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedLocation(location);
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: 
                  location.accessibility_level === 'high' ? '#4CAF50' :
                  location.accessibility_level === 'medium' ? '#FFC107' : 
                  '#F44336',
                borderRadius: '50%',
                border: '2px solid white',
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
          >
            <Paper sx={{ p: 2, maxWidth: 300 }}>
              <Typography variant="h6" gutterBottom>
                {selectedLocation.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedLocation.address}
              </Typography>
              {selectedLocation.description && (
                <Typography variant="body2" paragraph>
                  {selectedLocation.description}
                </Typography>
              )}
              <Box sx={{ mt: 1 }}>
                {selectedLocation.has_restroom && (
                  <Typography variant="body2">
                    🚽 {selectedLocation.is_restroom_accessible ? 'Accessible' : 'Non-accessible'} restroom
                  </Typography>
                )}
                {selectedLocation.is_dog_friendly && (
                  <Typography variant="body2">
                    🐕 Service animals welcome
                  </Typography>
                )}
                {!selectedLocation.has_steps && (
                  <Typography variant="body2">
                    ♿ Step-free access
                  </Typography>
                )}
              </Box>
            </Paper>
          </Popup>
        )}
      </Map>

      {/* Add Location Button */}
      <AddLocationButton />
    </Box>
  );
}