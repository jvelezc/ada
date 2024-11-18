'use client';

import { useState } from 'react';
import {
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Box,
  IconButton,
  Rating,
  Select,
  MenuItem,
  TextField,
  Tooltip,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessibleIcon from '@mui/icons-material/Accessible';
import WcIcon from '@mui/icons-material/Wc';
import PetsIcon from '@mui/icons-material/Pets';
import StairsIcon from '@mui/icons-material/Stairs';
import { LocationData } from '@/types';
import { supabase } from '@/lib/supabase';

interface EditableFieldProps {
  label: string;
  value: any;
  onSave: (value: any) => Promise<void>;
  type: 'select' | 'text' | 'boolean';
  options?: { value: any; label: string }[];
  icon?: React.ReactNode;
}

function EditableField({ label, value, onSave, type, options, icon }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onSave(tempValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
      {icon}
      {isEditing ? (
        <Box sx={{ flex: 1 }}>
          {type === 'select' && options && (
            <Select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              size="small"
              fullWidth
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
          {type === 'text' && (
            <TextField
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              size="small"
              fullWidth
            />
          )}
          {type === 'boolean' && (
            <Select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value === 'true')}
              size="small"
              fullWidth
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          )}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <IconButton 
              size="small" 
              onClick={handleSave}
              disabled={isLoading}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => {
                setIsEditing(false);
                setTempValue(value);
                setError(null);
              }}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </Box>
          {error && (
            <Typography color="error" variant="caption">
              {error}
            </Typography>
          )}
        </Box>
      ) : (
        <>
          <Typography variant="body2" sx={{ flex: 1 }}>
            {label}: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
          </Typography>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
}

interface EditableLocationPopupProps {
  location: LocationData;
  onUpdate: (updatedLocation: LocationData) => void;
}

export default function EditableLocationPopup({ location, onUpdate }: EditableLocationPopupProps) {
  const updateField = async (field: keyof LocationData, value: any) => {
    const { data, error } = await supabase
      .from('locations')
      .update({ [field]: value })
      .eq('id', location.id)
      .select()
      .single();

    if (error) throw error;
    if (data) onUpdate(data);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">{location.name}</Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <EditableField
            label="Accessibility Level"
            value={location.accessibility_level}
            type="select"
            options={[
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
            icon={<AccessibleIcon />}
            onSave={(value) => updateField('accessibility_level', value)}
          />
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <EditableField
            label="Has Steps"
            value={location.has_steps}
            type="boolean"
            icon={<StairsIcon />}
            onSave={(value) => updateField('has_steps', value)}
          />

          {location.has_steps && (
            <EditableField
              label="Step Description"
              value={location.step_description || ''}
              type="text"
              onSave={(value) => updateField('step_description', value)}
            />
          )}

          <EditableField
            label="Has Restroom"
            value={location.has_restroom}
            type="boolean"
            icon={<WcIcon />}
            onSave={(value) => updateField('has_restroom', value)}
          />

          {location.has_restroom && (
            <EditableField
              label="Restroom Accessible"
              value={location.is_restroom_accessible}
              type="boolean"
              onSave={(value) => updateField('is_restroom_accessible', value)}
            />
          )}

          <EditableField
            label="Dog Friendly"
            value={location.is_dog_friendly}
            type="boolean"
            icon={<PetsIcon />}
            onSave={(value) => updateField('is_dog_friendly', value)}
          />

          {location.is_dog_friendly && (
            <EditableField
              label="Dog Features"
              value={location.dog_features || ''}
              type="text"
              onSave={(value) => updateField('dog_features', value)}
            />
          )}
        </Stack>

        {location.status === 'pending' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This location is pending verification
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}