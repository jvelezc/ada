'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { LocationFormData } from '@/types';

interface BasicInfoStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack?: () => void;
  initialData?: Partial<LocationFormData>;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  id: string;
}

export default function BasicInfoStep({ onNext, onBack, initialData }: BasicInfoStepProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState(initialData?.address || '');
  const [unit, setUnit] = useState(initialData?.unit || '');
  const [latitude, setLatitude] = useState<number | null>(initialData?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(initialData?.longitude || null);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchAddress = async () => {
      if (!searchQuery || searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!mapboxToken) {
        setError('Mapbox token is missing');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
          `access_token=${mapboxToken}&` +
          'types=address,poi&' +
          'country=us,pr,as,gu,mp,vi&' +
          'limit=5'
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error searching locations:', err);
        setError('Search failed. Please try again.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchAddress, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleAddressSelect = (suggestion: MapboxFeature) => {
    setAddress(suggestion.place_name);
    setLatitude(suggestion.center[1]);
    setLongitude(suggestion.center[0]);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter a location name');
      return;
    }
    if (!address.trim()) {
      setError('Please select an address');
      return;
    }
    if (!latitude || !longitude) {
      setError('Please select a valid address from the suggestions');
      return;
    }

    onNext({
      name,
      address,
      unit,
      latitude,
      longitude,
    });
  };

  return (
    <Stack spacing={4}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TextField
        label="Location Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        placeholder="e.g., Central Park Visitor Center"
      />

      <Box sx={{ position: 'relative' }}>
        <TextField
          label="Search Address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          placeholder="Start typing to search..."
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />

        {showSuggestions && suggestions.length > 0 && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: 300,
              overflow: 'auto',
              zIndex: 1000,
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            <List>
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.id}
                  onClick={() => handleAddressSelect(suggestion)}
                  sx={{
                    py: 2,
                    cursor: 'pointer', // Indicate that this item is clickable
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText primary={suggestion.place_name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {address && (
        <Paper sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Selected Address
          </Typography>
          <Typography variant="body1" gutterBottom>
            {address}
          </Typography>
          <TextField
            label="Unit/Suite (Optional)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            placeholder="e.g., Apt 4B, Suite 200"
          />
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        {onBack && (
          <Button onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!name || !address || !latitude || !longitude}
        >
          Next
        </Button>
      </Box>
    </Stack>
  );
}
