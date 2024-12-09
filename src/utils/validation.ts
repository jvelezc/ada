import { LocationFormData } from '@/types';

export function validateLocationData(data: Partial<LocationFormData>): string | null {
  if (!data.name?.trim()) {
    return 'Please enter a location name';
  }
  if (!data.address?.trim()) {
    return 'Please select an address';
  }
  if (!data.latitude || !data.longitude) {
    return 'Please select a valid address from the suggestions';
  }
  return null;
}

export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
}