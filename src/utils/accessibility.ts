import { LocationData } from '@/types';

export function getAccessibilityColor(level?: string): string {
  switch (level) {
    case 'high':
      return '#4CAF50';
    case 'medium':
      return '#FFC107';
    case 'low':
      return '#F44336';
    default:
      return '#757575';
  }
}

export function getAccessibilityFeatures(location: LocationData): string[] {
  const features: string[] = [];

  if (location.has_steps === false) {
    features.push('No steps at entrance');
  }
  if (location.has_elevator) {
    features.push('Has elevator');
  }
  if (location.has_restroom && location.is_restroom_accessible) {
    features.push('Accessible restroom available');
  }
  if (location.is_dog_friendly) {
    features.push('Service animals welcome');
  }

  return features;
}