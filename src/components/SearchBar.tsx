'use client';

import { useState, useEffect } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationRequest: () => void;
  onAddressSelect?: (address: string, lat: number, lng: number) => void;
  fullWidth?: boolean;
}

export default function SearchBar({ 
  onSearch, 
  onLocationRequest, 
  onAddressSelect,
  fullWidth = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 600);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2 && onAddressSelect) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?` + 
          `access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&` +
          'types=address&limit=5'
        );
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (onAddressSelect) {
      onAddressSelect(
        suggestion.place_name,
        suggestion.center[1],
        suggestion.center[0]
      );
    }
    setQuery(suggestion.place_name);
    setSuggestions([]);
  };

  return (
    <ClickAwayListener onClickAway={() => setSuggestions([])}>
      <Box sx={{ 
        position: 'relative', 
        width: fullWidth ? '100%' : { xs: '90%', sm: '600px' },
        margin: '0 auto',
      }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            border: '2px solid',
            borderColor: 'primary.main',
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
            }}
            placeholder={isMobile ? "Search locations..." : "Enter address or place name..."}
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <IconButton type="submit" sx={{ p: '10px' }}>
            <SearchIcon />
          </IconButton>
          <Box sx={{ height: 24, mx: 0.5, borderLeft: 1, borderColor: 'divider' }} />
          <Tooltip title="Use current location">
            <IconButton 
              onClick={onLocationRequest} 
              sx={{ p: '10px' }}
              disabled={loading}
            >
              <MyLocationIcon />
            </IconButton>
          </Tooltip>
        </Paper>

        {suggestions.length > 0 && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              mt: 1,
              zIndex: 2,
              maxHeight: 300,
              overflow: 'auto',
            }}
          >
            <List>
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.id}
                  button
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <ListItemText primary={suggestion.place_name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}