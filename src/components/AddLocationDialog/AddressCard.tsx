'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { motion } from 'framer-motion';

interface AddressCardProps {
  address: string;
  unit?: string;
  onEdit: () => void;
  onUnitChange?: (unit: string) => void;
}

export default function AddressCard({ 
  address, 
  unit, 
  onEdit, 
  onUnitChange 
}: AddressCardProps) {
  const [tempUnit, setTempUnit] = useState(unit || '');
  const unitInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (unitInputRef.current) {
      unitInputRef.current.focus();
    }
  }, [address]);

  const handleUnitSave = () => {
    if (onUnitChange) {
      onUnitChange(tempUnit);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: 'primary.main',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <LocationOnIcon 
            color="primary" 
            sx={{ fontSize: 32, mt: 0.5 }} 
          />
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="subtitle2" 
              color="text.secondary"
              gutterBottom
            >
              Selected Location
            </Typography>
            <Typography variant="h6">{address}</Typography>
          </Box>

          <Tooltip 
            title="Change address" 
            placement="top"
            arrow
          >
            <IconButton 
              onClick={onEdit}
              size="small"
              sx={{
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <EditLocationIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: 'background.default',
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ApartmentIcon color="primary" />
              <Typography variant="subtitle1" color="primary">
                Add Unit/Suite Information
              </Typography>
            </Box>

            <TextField
              inputRef={unitInputRef}
              label="Unit/Suite/Apartment Number"
              value={tempUnit}
              onChange={(e) => setTempUnit(e.target.value)}
              onBlur={handleUnitSave}
              fullWidth
              placeholder="e.g., Apt 4B, Suite 200, Unit 12"
              helperText="Optional: Add unit, suite, or apartment number if applicable"
              variant="outlined"
              InputProps={{
                sx: { 
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                },
              }}
            />
          </Stack>
        </Paper>
      </Paper>
    </motion.div>
  );
}