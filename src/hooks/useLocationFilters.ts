import { useState, useCallback } from 'react';
import { LocationData } from '@/types';

export function useLocationFilters() {
  const [filters, setFilters] = useState<string[]>([]);

  const filterLocations = useCallback((locations: LocationData[]) => {
    if (filters.length === 0) return locations;

    return locations.filter((location) => {
      return filters.every((filter) => {
        switch (filter) {
          case 'high':
            return location.accessibility_level === 'high';
          case 'medium':
            return location.accessibility_level === 'medium';
          case 'low':
            return location.accessibility_level === 'low';
          case 'no-steps':
            return !location.has_steps;
          case 'restroom':
            return location.has_restroom && location.is_restroom_accessible;
          case 'service-animal':
            return location.is_dog_friendly;
          default:
            return true;
        }
      });
    });
  }, [filters]);

  return {
    filters,
    setFilters,
    filterLocations,
  };
}