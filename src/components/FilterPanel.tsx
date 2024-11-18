'use client';

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  IconButton,
  Box,
  ListItemIcon,
  Paper,
  Badge,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessibleIcon from '@mui/icons-material/Accessible';
import WcIcon from '@mui/icons-material/Wc';
import PetsIcon from '@mui/icons-material/Pets';
import StairsIcon from '@mui/icons-material/Stairs';
import { useState } from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: string[]) => void;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    { id: 'high', label: 'Fully Accessible', icon: <AccessibleIcon color="success" /> },
    { id: 'medium', label: 'Partially Accessible', icon: <AccessibleIcon color="warning" /> },
    { id: 'low', label: 'Limited Accessibility', icon: <AccessibleIcon color="error" /> },
    { id: 'no-steps', label: 'No Steps', icon: <StairsIcon /> },
    { id: 'restroom', label: 'Accessible Restroom', icon: <WcIcon /> },
    { id: 'service-animal', label: 'Service Animal Friendly', icon: <PetsIcon /> },
  ];

  const handleToggle = (value: string) => {
    const currentIndex = selectedFilters.indexOf(value);
    const newFilters = [...selectedFilters];

    if (currentIndex === -1) {
      newFilters.push(value);
    } else {
      newFilters.splice(currentIndex, 1);
    }

    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
          borderRadius: '50px',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
        }}
      >
        <Badge
          badgeContent={selectedFilters.length}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              right: 5,
              top: 5,
            },
          }}
        >
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              p: 2,
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            <FilterListIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Badge>
      </Paper>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 320 },
            borderTopLeftRadius: { xs: 16, sm: 0 },
            borderBottomLeftRadius: { xs: 16, sm: 0 },
          },
        }}
      >
        <Box sx={{ width: '100%', pt: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ px: 3, pb: 2 }}>
            Filter Locations
          </Typography>
          <List>
            {filters.map((filter) => (
              <ListItem
                key={filter.id}
                sx={{
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Checkbox
                  edge="start"
                  checked={selectedFilters.indexOf(filter.id) !== -1}
                  onChange={() => handleToggle(filter.id)}
                  sx={{ 
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {filter.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={filter.label}
                  primaryTypographyProps={{
                    sx: { fontWeight: selectedFilters.includes(filter.id) ? 600 : 400 }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}