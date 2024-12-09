'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Alert } from '@mui/material';
import { ApprovedLocation, BaseLocation } from '@/types';
import { updateLocationById } from '@/lib/supabase-server';
import LocationWizard from '@/components/LocationWizard';

interface ApprovedLocationEditorProps {
  location: ApprovedLocation;
}

export default function ApprovedLocationEditor({ location }: ApprovedLocationEditorProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  /**
   * Handles the submission of updated location data.
   * Validates required fields and updates the location in the database.
   * @param data Partial<ApprovedLocation> - Updated location data
   * @returns Promise<boolean> - Success or failure of the operation
   */
  const handleSubmit = async (data: Partial<ApprovedLocation>) => {
    try {
      // Validate required fields
      if (!data.name) {
        setError('Location name is required');
        return false;
      }

      // Map to BaseLocation structure
      const updatedData: BaseLocation = {
        name: data.name,
        address: data.address || location.address || '',
        unit: data.unit || location.unit || '',
        latitude: data.latitude ?? location.latitude,
        longitude: data.longitude ?? location.longitude,
        accessibility_level: data.accessibility_level || location.accessibility_level || 'medium',
        accessibility_status_unknown: data.accessibility_status_unknown ?? location.accessibility_status_unknown,
        description: data.description || location.description || '',
        has_steps: data.has_steps ?? location.has_steps,
        step_status_unknown: data.step_status_unknown ?? location.step_status_unknown,
        step_description: data.step_description || location.step_description || '',
        door_width: data.door_width || location.door_width || 'standard',
        door_width_inches: data.door_width_inches ?? location.door_width_inches,
        door_type: data.door_type || location.door_type || 'manual_easy',
        doorway_notes: data.doorway_notes || location.doorway_notes || '',
        has_elevator: data.has_elevator ?? location.has_elevator,
        has_wide_pathways: data.has_wide_pathways ?? location.has_wide_pathways,
        floor_type: data.floor_type || location.floor_type || 'smooth',
        interior_notes: data.interior_notes || location.interior_notes || '',
        has_accessible_parking: data.has_accessible_parking ?? location.has_accessible_parking,
        parking_type: data.parking_type || location.parking_type || 'none',
        parking_status_unknown: data.parking_status_unknown ?? location.parking_status_unknown,
        has_loading_zone: data.has_loading_zone ?? location.has_loading_zone,
        parking_notes: data.parking_notes || location.parking_notes || '',
        has_restroom: data.has_restroom ?? location.has_restroom,
        restroom_unknown: data.restroom_unknown ?? location.restroom_unknown,
        is_restroom_accessible: data.is_restroom_accessible ?? location.is_restroom_accessible,
        restroom_status_unknown: data.restroom_status_unknown ?? location.restroom_status_unknown,
        restroom_notes: data.restroom_notes || location.restroom_notes || '',
        is_dog_friendly: data.is_dog_friendly ?? location.is_dog_friendly,
        dog_friendly_unknown: data.dog_friendly_unknown ?? location.dog_friendly_unknown,
        dog_friendly_status_unknown: data.dog_friendly_status_unknown ?? location.dog_friendly_status_unknown,
        dog_features: data.dog_features || location.dog_features || '',
      };

      // Update the location in the database
      await updateLocationById(location.id.toString(), updatedData);
      setOpen(false);
      router.push('/admin');
      return true;
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to update location');
      return false;
    }
  };

  return (
    <>
      <LocationWizard
        open={open}
        onClose={() => {
          setOpen(false);
          router.push('/admin');
        }}
        onSubmit={handleSubmit}
        initialData={location}
        mode="edit"
      />
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}
    </>
  );
}
