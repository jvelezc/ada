import { useState, useCallback } from 'react';
import { ViewState } from 'react-map-gl';

interface UseMapControlsProps {
  initialViewState: ViewState;
}

export function useMapControls({ initialViewState }: UseMapControlsProps) {
  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  const handleLocationRequest = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14,
            transitionDuration: 1000,
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          throw new Error('Failed to get your location');
        }
      );
    }
  }, []);

  const handleAddressSelect = useCallback((address: string, lat: number, lng: number) => {
    setViewState(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      zoom: 16,
      transitionDuration: 1000,
    }));
  }, []);

  return {
    viewState,
    setViewState,
    handleLocationRequest,
    handleAddressSelect,
  };
}