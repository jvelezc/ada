'use client';

import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationSearch({ value, onChange }: LocationSearchProps) {
  return (
    <TextField
      fullWidth
      placeholder="Search by name, address, or accessibility level..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );
}