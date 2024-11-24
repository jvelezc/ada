'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Stack,
  Alert,
  Box,
  Paper,
} from '@mui/material';
import { LocationFormData } from '@/types';
import SearchBar from '@/components/SearchBar';
import StepContainer from '../StepContainer';
import ButtonContainer from '../ButtonContainer';
import AddressCard from '../AddressCard';

interface BasicInfoStepProps {
  onNext: (data: Partial<LocationFormData>) => void;
  onBack?: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function BasicInfoStep({ onNext, onBack, initialData }: BasicInfoStepProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [unit, setUnit] = useState(initialData?.unit || '');
  const [latitude, setLatitude] = useState<number | null>(initialData?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(initialData?.longitude || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(!initialData?.address);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setAddress(initialData.address || '');
      setUnit(initialData.unit || '');
      setLatitude(initialData.latitude || null);
      setLongitude(initialData.longitude || null);
      setIsSearchVisible(!initialData.address);
    }
  }, [initialData]);

  const validate = () => {
    setError(null);
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!latitude || !longitude) {
      setError('Please select an address from the suggestions');
      return false;
    }
    return true;
  };

  const handleAddressSelect = (fullAddress: string, lat: number, lng: number) => {
    setAddress(fullAddress);
    setLatitude(lat);
    setLongitude(lng);
    setIsSearchVisible(false);
  };

  const handleEditAddress = () => {
    setIsSearchVisible(true);
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    onNext({
      name,
      address,
      unit,
      latitude: latitude!,
      longitude: longitude!,
    });
  };

  return (
    <StepContainer>
      <Typography variant="h6" gutterBottom>
        Basic Information 📍
      </Typography>

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
          disabled={loading}
          placeholder="e.g., Central Park Visitor Center"
        />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Address
          </Typography>
          {isSearchVisible ? (
            <Paper 
              elevation={0} 
              sx={{ 
                position: 'relative',
                '& > div': {
                  position: 'relative',
                  top: 0,
                  left: 0,
                  transform: 'none',
                },
              }}
            >
              <SearchBar
                onSearch={() => {}}
                onLocationRequest={() => {}}
                onAddressSelect={handleAddressSelect}
                fullWidth
              />
            </Paper>
          ) : (
            <AddressCard 
              address={address}
              unit={unit}
              onEdit={handleEditAddress}
              onUnitChange={handleUnitChange}
            />
          )}
        </Box>
      </Stack>

      <ButtonContainer 
        onNext={handleSubmit} 
        onBack={onBack}
        isLoading={loading}
      />
    </StepContainer>
  );
}