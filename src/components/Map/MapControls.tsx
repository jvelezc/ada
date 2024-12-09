'use client';

import { Box } from '@mui/material';
import SearchBar from '../SearchBar';
import Legend from '../Legend';
import FilterPanel from '../FilterPanel';
import AddLocationButton from '../AddLocationButton';

interface MapControlsProps {
  onSearch: (query: string) => void;
  onLocationRequest: () => void;
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  onFilterChange: (filters: string[]) => void;
}

export default function MapControls({
  onSearch,
  onLocationRequest,
  onAddressSelect,
  onFilterChange,
}: MapControlsProps) {
  return (
    <>
      <SearchBar
        onSearch={onSearch}
        onLocationRequest={onLocationRequest}
        onAddressSelect={onAddressSelect}
      />

      <FilterPanel onFilterChange={onFilterChange} />

      <Legend />

      <AddLocationButton />
    </>
  );
}