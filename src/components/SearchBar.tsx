'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Tooltip,
  ClickAwayListener,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationRequest: () => void;
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  fullWidth?: boolean;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  id: string;
}

export default function SearchBar({ 
  onSearch, 
  onLocationRequest, 
  onAddressSelect,
  fullWidth = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 600);

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
    } catch (err) {
      console.error('Error searching locations:', err);
      setError('Search failed. Please try again.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchMapbox(query);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, searchMapbox]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    if (onAddressSelect) {
      onAddressSelect(
        suggestion.place_name,
        suggestion.center[1], // latitude
        suggestion.center[0]  // longitude
      );
    }
    setQuery(suggestion.place_name);
    setSuggestions([]);
  };

  return (
    <ClickAwayListener onClickAway={() => setSuggestions([])}>
      <Box sx={{ 
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: fullWidth ? '100%' : { xs: '90%', sm: '600px' },
        px: 2,
        zIndex: 1000,
      }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={3}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            bgcolor: 'background.paper',
            '&:hover': {
              borderColor: 'primary.dark',
            },
          }}
        >
          <InputBase
            sx={{ 
              ml: 1, 
              flex: 1,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              '& input': {
                padding: { xs: '8px 0', sm: '8px 0' },
              },
              color: 'text.primary',
            }}
            placeholder={isMobile ? "Search locations..." : "Search for a location in the United States..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
              sx={{ p: '10px' }}
            >
              <MyLocationIcon />
            </IconButton>
          </Tooltip>
        </Paper>

        {suggestions.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              mt: 1,
              maxHeight: 400,
              overflow: 'auto',
              width: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <List>
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    py: 2,
                    px: 3,
                    cursor: 'pointer',  // Make the item look clickable
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateX(4px)',
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
        )}

        {error && (
          <Typography 
            color="error" 
            variant="body2" 
            sx={{ mt: 1, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </ClickAwayListener>
  );
}
