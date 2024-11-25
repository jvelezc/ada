'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onLocationRequest: () => void;
  onAddressSelect: (address: string, lat: number, lng: number) => void;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  id: string;
}

export default function SearchBar({ onLocationRequest, onAddressSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [loading, setLoading] = useState(false);

  const searchMapbox = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox token is missing');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${mapboxToken}&` +
        'types=address,poi&' +
        'country=us&' +
        'limit=5'
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.error('Error searching locations:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMapbox(query);
  };

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    onAddressSelect(
      suggestion.place_name,
      suggestion.center[1], // latitude
      suggestion.center[0]  // longitude
    );
    setQuery(suggestion.place_name);
    setSuggestions([]);
  };

  return (
    <Box sx={{ 
      position: 'absolute',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      width: { xs: '90%', sm: '600px' },
      zIndex: 1000,
    }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          component="form"
          onSubmit={handleSearch}
          elevation={3}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              boxShadow: 4,
            },
          }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search for a location..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              searchMapbox(e.target.value);
            }}
            autoComplete="off"
          />
          {loading ? (
            <CircularProgress size={24} sx={{ mx: 1 }} />
          ) : (
            <IconButton type="submit" sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
          )}
          <Box sx={{ height: 24, mx: 0.5, borderLeft: 1, borderColor: 'divider' }} />
          <Tooltip title="Use current location">
            <IconButton 
              onClick={onLocationRequest}
              sx={{ 
                p: '10px',
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            >
              <MyLocationIcon />
            </IconButton>
          </Tooltip>
        </Paper>

        <Fade in={suggestions.length > 0}>
          <Paper
            elevation={3}
            sx={{
              mt: 1,
              maxHeight: 300,
              overflow: 'auto',
              borderRadius: 2,
              bgcolor: 'background.paper',
              backdropFilter: 'blur(8px)',
            }}
          >
            <List>
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.id}
                  button
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'scale(1.01)',
                    },
                  }}
                >
                  <ListItemText 
                    primary={suggestion.place_name}
                    primaryTypographyProps={{
                      sx: { 
                        color: 'text.primary',
                        fontWeight: 500,
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      </motion.div>
    </Box>
  );
}